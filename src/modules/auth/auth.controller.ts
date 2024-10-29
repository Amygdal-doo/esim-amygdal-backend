import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserResponseDto } from '../user/dtos/response/user-response.dto';
import { UserLogged } from './decorators/user.decorator';
import { LocalLoginDto } from './dtos/local-login.dto';
import { LocalRegisterBodyDto } from './dtos/local-register-body.dto';
import { LoggedUserInfoDto } from './dtos/logged-user-info.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

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
    summary: 'Login for users',
  })
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
}
