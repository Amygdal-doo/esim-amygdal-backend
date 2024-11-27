import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserResponseDto } from '../user/dtos/response/user-response.dto';
import { UserLogged } from './decorators/user.decorator';
import { LocalLoginDto } from './dtos/local-login.dto';
import { LocalRegisterBodyDto } from './dtos/local-register-body.dto';
import {
  LoggedUserInfoDto,
  LoggedUserInfoRefreshDto,
} from './dtos/logged-user-info.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginResponseDto } from './dtos/responses/login-response.dto';
import { PasswordChangedSuccesfullyResponseDto } from './dtos/responses/password-changed-succesfully.response.dto';
import { AppleAuthGuard } from './guards/apple-auth.guard';
import { MicrosoftAuthGuard } from './guards/microsoft-auth.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOCAL REGISTER AND LOGIN
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LocalLoginDto })
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Login to you account using email and password',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiForbiddenResponse()
  async login(@UserLogged() user: LoggedUserInfoDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user - only registers you as user role',
  })
  @ApiBody({ type: LocalRegisterBodyDto })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(UserResponseDto)
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse()
  async register(@Body() localRegisterBodyDto: LocalRegisterBodyDto) {
    const user = await this.authService.register(localRegisterBodyDto);
    // send email
    return user;
  }

  // Google AUTH
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Login to system with your Google account',
  })
  @UseFilters(new HttpExceptionFilter())
  async signInWithGoogle() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  @UseFilters(new HttpExceptionFilter())
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }

  // Apple AUTH

  @Get('apple')
  @UseGuards(AppleAuthGuard)
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({
    summary: 'Login to system with your Apple account',
  })
  @ApiOkResponse()
  async signInWithApple(): Promise<any> {
    return HttpStatus.OK;
  }

  @Post('apple/redirect')
  @UseGuards(AppleAuthGuard)
  @ApiExcludeEndpoint()
  @UseFilters(new HttpExceptionFilter())
  async signInWithAppleRedirect(@Req() req): Promise<any> {
    return this.authService.signInWithApple(req);
  }

  // Google AUTH
  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  @ApiOperation({
    summary: 'Login to system with your Microsoft account',
  })
  @UseFilters(new HttpExceptionFilter())
  async signInWithMicrosoft() {}

  @Get('microsoft/redirect')
  @UseGuards(MicrosoftAuthGuard)
  @ApiExcludeEndpoint()
  @UseFilters(new HttpExceptionFilter())
  async signInWithMicrosoftRedirect(@Req() req) {
    return this.authService.signInWithMicrosoft(req);
  }

  @Get('refresh')
  @ApiOperation({
    summary: 'Generates new Tokens for the user',
  })
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('Access Token')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse()
  refreshTokensGet(
    @UserLogged() loggedUserInfoRefreshDto: LoggedUserInfoRefreshDto,
  ) {
    const { refreshToken, ...loggedUserInfoDto } = loggedUserInfoRefreshDto;
    return this.authService.refreshTokens(loggedUserInfoDto, refreshToken);
  }

  // @Post('refresh')
  // @ApiOperation({
  //   summary: 'Generates new Tokens for the user',
  // })
  // @UseGuards(RefreshTokenGuard)
  // @ApiBearerAuth('Access Token')
  // refreshTokensPost(
  //   @UserLogged() loggedUserInfoRefreshDto: LoggedUserInfoRefreshDto,
  // ) {
  //   const { refreshToken, ...loggedUserInfoDto } = loggedUserInfoRefreshDto;
  //   return this.authService.refreshTokens(loggedUserInfoDto, refreshToken);
  // }

  @Post('changePassword')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({
    summary: 'Change password',
  })
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  @ApiOkResponse({ type: PasswordChangedSuccesfullyResponseDto })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async changePassword(
    @UserLogged() loggedUserInfoDto,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      loggedUserInfoDto,
      changePassword,
    );
  }
}
