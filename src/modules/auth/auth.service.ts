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
import { PasswordException } from 'src/common/exceptions/errors/auth/password-exception';
import { LoginType, Prisma, Role } from '@prisma/client';
import { PasswordChangedSuccesfullyResponseDto } from './dtos/responses/password-changed-succesfully.response.dto';
import { AiraloService } from '../airalo/services/airalo.service';
import { UserRefreshTokenService } from '../user/services/user-refresh-token.service';
import { UserAiraloTokenService } from '../user/services/user-airalo-token.service';
import { encryptToken } from 'src/common/helpers/encrypt.helper';
import { ChangeEmailDto } from './dtos/change-email.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import {
  generateRandomToken,
  hashToken,
  hashTokenWithExpiry,
} from 'src/common/utilities/hash-token.util';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { UserResetPasswordTokenService } from '../user/services/user-reset-password-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRefreshTokenService: UserRefreshTokenService,
    private readonly userAiraloTokenService: UserAiraloTokenService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly aireloService: AiraloService,
    private readonly sendgridService: SendgridService,
    private readonly resetPasswordTokenService: UserResetPasswordTokenService,
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
      isEmailConfirmed: user.isEmailConfirmed,
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
        isEmailConfirmed: user.isEmailConfirmed,
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
        isEmailConfirmed: newUser.isEmailConfirmed,
        loginType: newUser.loginType,
      };
      const { accessToken, refreshToken } =
        await this.getAccessAndRefreshTokens(payload);
      await this.updateRefreshToken(newUser.id, refreshToken);
      await this.setUpAiraloToken(newUser.id);
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
        isEmailConfirmed: user.isEmailConfirmed,
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
        isEmailConfirmed: newUser.isEmailConfirmed,
        loginType: newUser.loginType,
      };
      const { accessToken, refreshToken } =
        await this.getAccessAndRefreshTokens(payload);
      await this.updateRefreshToken(newUser.id, refreshToken);
      await this.setUpAiraloToken(newUser.id);
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
    const { id, loginType } = loggedUserInfoDto;

    const user = await this.userService.findById(id);
    if (!user) throw new UserNotFoundException();

    const passExists = !!user.password;

    if (!oldPassword && loggedUserInfoDto.loginType === LoginType.CREDENTIALS)
      throw new ForbiddenException("old password can't be empty");

    if (passExists && (loginType !== LoginType.CREDENTIALS || !oldPassword))
      throw new BadRequestException("old password can't be empty");

    if (passExists) {
      const isMatch = await verifyPassword(user.password, oldPassword);
      if (!isMatch) throw new PasswordException();
    }

    if (newPassword != repeatPassword) throw new ChangingPasswordException();

    // if ((!user.password && !!user.googleId) || user.googleId)
    //   throw new PasswordSocialException();

    const hashedPw = await hashPassword(newPassword);

    await this.userService.updateUserById(id, {
      password: hashedPw,
    });

    return {
      message: 'Password changed successfully.',
    };
  }

  async changeEmail(
    loggedUserInfoDto: LoggedUserInfoDto,
    changeEmailDto: ChangeEmailDto,
  ): Promise<PasswordChangedSuccesfullyResponseDto> {
    const { currentPassword, oldEmail, email } = changeEmailDto;
    const { id } = loggedUserInfoDto;

    // if (newPassword != repeatPassword) throw new ChangingPasswordException();

    const user = await this.userService.findById(id);
    if (!user) throw new UserNotFoundException();

    if (email === oldEmail) throw new BadRequestException('Email is the same');

    if (oldEmail !== user.email)
      throw new BadRequestException('Current email is not correct');

    if (!user.password)
      throw new BadRequestException(
        'Cant change email if your account does not have a password',
      );

    // if ((!user.password && !!user.googleId) || user.googleId)
    //   throw new PasswordSocialException();

    const isMatch = await verifyPassword(user.password, currentPassword);
    if (!isMatch) throw new PasswordException();

    const newEmail = await this.userService.findByEmail(email);
    if (newEmail)
      throw new BadRequestException(
        'new email is already connected to another account',
      );

    await this.userService.changeEmail(loggedUserInfoDto, email); // update email

    return {
      message: 'Email changed successfully.',
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
        isEmailConfirmed: user.isEmailConfirmed,
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
        isEmailConfirmed: newUser.isEmailConfirmed,
        loginType: newUser.loginType,
      };
      const { accessToken, refreshToken } =
        await this.getAccessAndRefreshTokens(payload);
      await this.updateRefreshToken(newUser.id, refreshToken);
      await this.setUpAiraloToken(newUser.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error(e);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.getUserByEmail(forgotPasswordDto.email);
    if (!user) throw new UserNotFoundException();

    if (user.googleId || user.microsoftId || user.appleId)
      if (!user.password) {
        throw new ForbiddenException(
          'You are using social login and your account does not have a password,cant change the password',
        );
      }

    const token = generateRandomToken();
    const hashedToken = hashTokenWithExpiry(token);

    await this.userService.setUserResetPasswordToken(user.id, {
      expiresAt: hashedToken.expiresAt,
      tokenHash: hashedToken.tokenHash,
    });
    await this.sendgridService.sendResetPasswordToken({
      to: forgotPasswordDto.email,
      token,
    });
  }

  async resetPassword(newPassword: string, token: string) {
    const hashedToken = hashToken(token);
    const tokenRecord =
      await this.resetPasswordTokenService.getuniqueToken(hashedToken);

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userService.updateUserById(tokenRecord.user.id, {
      password: hashedPassword,
    });
    await this.resetPasswordTokenService.deleteById(tokenRecord.id);
    return { message: 'Password is reset' };
  }
}
