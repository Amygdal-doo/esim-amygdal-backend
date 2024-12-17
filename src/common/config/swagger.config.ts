import { DocumentBuilder } from '@nestjs/swagger';
import * as packageJSON from '../../../package.json';

export const configSwagger = new DocumentBuilder()
  .setTitle('Welcome to esim app API Documentation')
  .setDescription('Swagger esim app')
  .setVersion(`API version: ${packageJSON.version}`)
  .addTag('esim')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter access token',
      in: 'header',
    },
    'Access Token',
  )
  .build();
