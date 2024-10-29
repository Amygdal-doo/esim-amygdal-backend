import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggedUserInfoDto } from './dtos/logged-user-info.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import {
  hashPassword,
  verifyPassword,
} from 'src/common/helpers/hash-password.helper';
import { LoginType } from 'src/common/enums/loginType.enum';
import { ExistingUserException } from 'src/common/exceptions/errors/user/existing-user.exception';
import { ExistingUsernameException } from 'src/common/exceptions/errors/user/existing-username.exception';
import { SocialUserExistException } from 'src/common/exceptions/errors/auth/social-login.exception';
import * as userSchema from '../user/schemas/schema';
import { Role } from 'src/common/enums/role.enum';
import { LocalRegisterBodyDto } from './dtos/local-register-body.dto';
import { WrongCredidentialsException } from 'src/common/exceptions/errors/auth/wrong-credidentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async getAccessAndRefreshTokens(
    payload: LoggedUserInfoDto,
  ): Promise<LoginResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(localRegisterBodyDto: LocalRegisterBodyDto) {
    const emailExist = await this.userService.findByEmail(
      localRegisterBodyDto.email,
    );
    if (emailExist) throw new ExistingUserException();
    const usernameExist = await this.userService.findByUsername(
      localRegisterBodyDto.username,
    );
    if (usernameExist) throw new ExistingUsernameException();

    const hashedPw = await hashPassword(localRegisterBodyDto.password);

    const data: typeof userSchema.userTable.$inferInsert & {
      password: string;
    } = {
      password: hashedPw,
      email: localRegisterBodyDto.email,
      username: localRegisterBodyDto.username,
      firstName: localRegisterBodyDto.firstName,
      lastName: localRegisterBodyDto.lastName,
      loginType: LoginType.CREDENTIALS,
      role: Role.USER,
    };
    return this.userService.create(data);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoggedUserInfoDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new WrongCredidentialsException();
    // if (user.archived) throw new ForbiddenException();
    if (!user?.password) throw new SocialUserExistException('social');

    const isMatch = await verifyPassword(user.password, password);
    if (!isMatch) throw new WrongCredidentialsException();

    //maybe check for update in role ?

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      loginType: user.loginType,
    };
  }

  async login(payload: LoggedUserInfoDto): Promise<LoginResponseDto> {
    const tokens = await this.getAccessAndRefreshTokens(payload);
    await this.updateRefreshToken(payload.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async signInWithGoogle(data: any): Promise<LoginResponseDto> {
    if (!data.user) throw new BadRequestException(); //check if data.user exists
    const googleId = data.user.googleId;
    let user = await this.userService.findByGoogleId(googleId);

    // if (user?.archived) throw new ForbiddenException();

    if (user) {
      const payload: LoggedUserInfoDto = {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        loginType: user.loginType,
      };
      const { accessToken, refreshToken } =
        await this.getAccessAndRefreshTokens(payload);
      await this.updateRefreshToken(user.id, refreshToken);
      return { accessToken, refreshToken };
    }
    user = await this.userService.findByEmail(data.user.email);
    if (user) throw new SocialUserExistException('google');

    try {
      const registerUser: typeof userSchema.userTable.$inferInsert & {
        googleId: string;
      } = {
        // dto or interfaace
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        username: await this.userService.generateUniqueUsername(),
        email: data.user.email,
        role: Role.USER,
        //password: null,
        googleId,
        loginType: LoginType.GOOGLE,
      };

      const newUser = await this.userService.create(registerUser);
      const payload: LoggedUserInfoDto = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
        loginType: newUser.loginType,
      };
      const { accessToken, refreshToken } =
        await this.getAccessAndRefreshTokens(payload);
      await this.updateRefreshToken(newUser.id, refreshToken);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e);
    }
  }
}
