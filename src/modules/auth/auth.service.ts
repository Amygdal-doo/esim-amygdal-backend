import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggedUserInfoDto } from './dtos/logged-user-info.dto';
import { LoginResponseDto } from './dtos/responses/login-response.dto';
import {
  hashPassword,
  verifyPassword,
} from 'src/common/helpers/hash-password.helper';
import { ExistingUserException } from 'src/common/exceptions/errors/user/existing-user.exception';
import { ExistingUsernameException } from 'src/common/exceptions/errors/user/existing-username.exception';
import { SocialUserExistException } from 'src/common/exceptions/errors/auth/social-login.exception';
import { WrongCredidentialsException } from 'src/common/exceptions/errors/auth/wrong-credidentials.exception';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangingPasswordException } from 'src/common/exceptions/errors/auth/changing-password.exception';
import { UserNotFoundException } from 'src/common/exceptions/errors/user/user-no-exist.exception';
import { PasswordSocialException } from 'src/common/exceptions/errors/auth/password-social-exception';
import { PasswordException } from 'src/common/exceptions/errors/auth/password-exception';
import { LoginType, Prisma, Role } from '@prisma/client';
import { PasswordChangedSuccesfullyResponseDto } from './dtos/responses/password-changed-succesfully.response.dto';
import { AiraloService } from '../airalo/services/airalo.service';
import { UserRefreshTokenService } from '../user/services/user-refresh-token.service';
import { UserAiraloTokenService } from '../user/services/user-airalo-token.service';
import { encryptToken } from 'src/common/helpers/encrypt.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRefreshTokenService: UserRefreshTokenService,
    private readonly userAiraloTokenService: UserAiraloTokenService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly aireloService: AiraloService,
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

  async setUpAiraloToken(userId: string) {
    const user = await this.userService.findById(userId);

    try {
      const airaloTokenResponse = await this.aireloService.getToken();
      const encryptedToken = encryptToken(airaloTokenResponse.access_token);

      await this.userAiraloTokenService.create(
        user.id,
        encryptedToken,
        airaloTokenResponse.expires_in,
      );
    } catch (error) {
      console.error('Error generating Airalo token:', error.message);
      // Optionally handle failure to associate token
    }
  }

  async register(data: Prisma.UserCreateInput) {
    const emailExist = await this.userService.findByEmail(data.email);
    if (emailExist) throw new ExistingUserException();
    const usernameExist = await this.userService.findByUsername(data.username);
    if (usernameExist) throw new ExistingUsernameException();

    const hashedPw = await hashPassword(data.password);

    data.password = hashedPw;
    data.loginType = LoginType.CREDENTIALS;

    const user = await this.userService.create(data);

    // Generate Airalo Token and associate with the user
    await this.setUpAiraloToken(user.id);

    return user;
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
    await this.userRefreshTokenService.updateRefreshToken(
      userId,
      hashedRefreshToken,
    );
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
      const registerUser: Prisma.UserCreateInput = {
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
      await this.setUpAiraloToken(user.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e);
    }
  }

  async signInWithApple(data: any): Promise<LoginResponseDto> {
    if (!data.user) throw new BadRequestException(); //check if data.user exists

    const appleId = data.user.appleId;
    let user = await this.userService.findByAppleId(appleId);

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

    if (user) throw new SocialUserExistException('apple');

    try {
      const registerUser: Prisma.UserCreateInput = {
        // dto or interfaace
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        username: await this.userService.generateUniqueUsername(),
        email: data.user.email,
        role: Role.USER,
        // password: null,
        appleId: appleId,
        loginType: LoginType.APPLE,
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
      await this.setUpAiraloToken(user.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e);
    }
  }

  async refreshTokens(
    loggedUserInfoDto: LoggedUserInfoDto,
    refreshToken: string,
  ) {
    const refreshTk = await this.userRefreshTokenService.findByUserId(
      loggedUserInfoDto.id,
    );
    if (!refreshTk) throw new ForbiddenException('Access Denied'); // 403 Forbidden

    const refreshTokenMatches = await verifyPassword(
      refreshTk.token,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied'); // 403 Forbidden
    const tokens = await this.getAccessAndRefreshTokens(loggedUserInfoDto);
    await this.updateRefreshToken(loggedUserInfoDto.id, tokens.refreshToken);
    return tokens;
  }

  async changePassword(
    loggedUserInfoDto: LoggedUserInfoDto,
    changePasswordDto: ChangePasswordDto,
  ): Promise<PasswordChangedSuccesfullyResponseDto> {
    const { oldPassword, newPassword, repeatPassword } = changePasswordDto;
    const { id } = loggedUserInfoDto;

    if (newPassword != repeatPassword) throw new ChangingPasswordException();

    const user = await this.userService.findById(id);
    if (!user) throw new UserNotFoundException();

    if ((!user.password && !!user.googleId) || user.googleId)
      throw new PasswordSocialException();

    const isMatch = await verifyPassword(user.password, oldPassword);
    if (!isMatch) throw new PasswordException();

    const hashedPw = await hashPassword(newPassword);

    await this.userService.updateUserById(id, {
      password: hashedPw,
    });

    return {
      message: 'Password changed successfully.',
    };
  }

  async signInWithMicrosoft(data: any): Promise<LoginResponseDto> {
    if (!data.user) throw new BadRequestException(); //check if data.user exists
    const microsoftId = data.user.microsoftId;
    let user = await this.userService.findByMicrosoftId(microsoftId);

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

    if (user) throw new SocialUserExistException('microsoft');

    try {
      const registerUser: Prisma.UserCreateInput = {
        // dto or interfaace
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        username: await this.userService.generateUniqueUsername(),
        email: data.user.email,
        role: Role.USER,
        //password: null,
        microsoftId: microsoftId,
        loginType: LoginType.MICROSOFT,
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
      await this.setUpAiraloToken(user.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e);
    }
  }
}
