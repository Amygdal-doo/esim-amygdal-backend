import {
  Body,
  Controller,
  Get,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserLogged } from '../../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../../auth/dtos/logged-user-info.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserProfileService } from '../services/user-profile.service';
import { UpdateUserProfileDto } from '../dtos/requests/update-user-profile.dto';
import { UserProfileResponseDto } from '../dtos/response/profile-response.dto';

@ApiTags('User Profile')
@Controller({ path: 'user/profile', version: '1' })
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get logged User Profile',
    description: 'Get all neccesary information about logged user profile',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(UserProfileResponseDto)
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async me(@UserLogged() loggedUserInfoDto: LoggedUserInfoDto) {
    return this.userProfileService.findByUserId(loggedUserInfoDto.id);
  }

  @Put('')
  @ApiOperation({
    summary: 'Update logged User Profile',
    description: 'Update information about logged user profile',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(UserProfileResponseDto)
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Body() update: UpdateUserProfileDto,
  ) {
    console.log(update);
    return this.userProfileService.updateOrCreate(loggedUserInfoDto.id, update);
  }
}
