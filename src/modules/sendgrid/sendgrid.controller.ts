import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserLogged } from '../auth/decorators/user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { SendgridService } from './sendgrid.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller({ path: 'email', version: '1' })
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Post('confirm')
  @ApiBody({ type: ConfirmEmailDto })
  @ApiOperation({ description: 'Email confirmation' })
  @HttpCode(200)
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.sendgridService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.sendgridService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @ApiBearerAuth('Access Token')
  @ApiOperation({ description: 'Resend Confirmation link' })
  @UseGuards(AccessTokenGuard)
  async resendConfirmationLink(@UserLogged() loggedUserInfoDto) {
    await this.sendgridService.resendConfirmationLink(loggedUserInfoDto.id);
  }
}
