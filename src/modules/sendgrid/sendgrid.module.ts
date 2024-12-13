import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { JwtModule } from '@nestjs/jwt';
import { SendgridController } from './sendgrid.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      /*secret: process.env.JWT_SECRET,
            signOptions: {
              expiresIn: process.env.EXPIRES_IN,
            },*/
    }),
  ],
  providers: [SendgridService],
  exports: [SendgridService],
  controllers: [SendgridController],
})
export class SendgridModule {}
