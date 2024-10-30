import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserResponseDto } from './dtos/response/user-response.dto';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get logged User',
    description: 'Get all neccesary information about logged user',
  })
  @ApiBearerAuth('Access Token')
  @UseGuards(AccessTokenGuard)
  @Serialize(UserResponseDto)
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async me(@UserLogged() loggedUserInfoDto: LoggedUserInfoDto) {
    return this.userService.getLoggedUser(loggedUserInfoDto.id);
  }
}
