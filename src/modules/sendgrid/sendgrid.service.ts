import { BadRequestException, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { IVerificationTokenPayload } from '../auth/interfaces/verification-token-payloa.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/services/user.service';
import { IConfirmEmail } from './interfaces/confirm-email.interface';
import { EmailVerifiedException } from 'src/common/exceptions/errors/email/email-verified.exception';
import { SendResetPasswordTokenParamDto } from './dtos/params/reset-password.dto';
import { IResetPasword } from './interfaces/reset-password.interface';

@Injectable()
export class SendgridService {
  private readonly FROM = this.configService.get<string>('SENDGRID_FROM_EMAIL');
  private readonly FRONTEND_URL = this.configService.get('FRONTEND_URL');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async send(mail: sgMail.MailDataRequired) {
    try {
      const transport = await sgMail.send(mail);
      if (transport) {
        // console.log(`Email successfully dispatched to ${mail.to}`)
        return {
          message: `Email successfully sent to ${mail.to}`,
        };
      } else return 'Email failed to send';
    } catch (error) {
      console.log(error.response.body);
      return 'Email failed to send';
    }
  }

  JwtGenerateVerificationToken(payload: IVerificationTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}`,
    });
  }

  public sendVerificationLink(email: string, name: string) {
    const payload: IVerificationTokenPayload = { email };
    const token = this.JwtGenerateVerificationToken(payload);
    const url = `${this.FRONTEND_URL}/confirm-email?token=${token}`;
    const templateId = this.configService.get<string>(
      'CONFIRM_EMAIL_TEMPLATE_ID',
    );
    const dynamicTemplateData: IConfirmEmail = {
      name,
      url,
    };

    const mail: sgMail.MailDataRequired = {
      to: email,
      from: this.FROM,
      templateId,
      dynamicTemplateData,
    };

    return this.send(mail);
  }

  async sendResetPasswordToken(params: SendResetPasswordTokenParamDto) {
    const { token, to } = params;
    const url = `${this.FRONTEND_URL}/reset-password?token=${token}`;
    const templateId = this.configService.get<string>(
      'RESET_PASSWORD_TEMPLATE_ID',
    );

    const dynamicTemplateData: IResetPasword = {
      url,
    };

    const mail: sgMail.MailDataRequired = {
      to,
      from: this.FROM,
      templateId,
      dynamicTemplateData,
    };

    return this.send(mail);
  }

  async confirmEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user.isEmailConfirmed) {
      throw new EmailVerifiedException();
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmationLink(userId: string) {
    const user = await this.userService.findById(userId);
    if (user.isEmailConfirmed) throw new EmailVerifiedException();

    await this.sendVerificationLink(user.email, user.firstName);
  }
}
