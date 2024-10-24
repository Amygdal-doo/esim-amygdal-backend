import { DocumentBuilder } from '@nestjs/swagger';

export const configSwagger = new DocumentBuilder()
  .setTitle('SMS app')
  .setDescription('Swagger esim app')
  .setVersion('1.0')
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
