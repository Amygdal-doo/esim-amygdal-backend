import { ConfigModule } from '@nestjs/config';
import { ISendGridModuleOptions } from '../interfaces/sendgrid.interface';

ConfigModule.forRoot();

export const sendGridModuleOptions: ISendGridModuleOptions = {
  apiKey: process.env.SENDGRID_API_KEY,
};
