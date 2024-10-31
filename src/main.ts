import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from 'src/common/config';
import * as fs from 'fs';

async function bootstrap() {
  let httpsOptions;

  // in development mode, use a self-signed certificate
  // for https to work with apple auth
  if (process.env.NODE_ENV === 'development') {
    httpsOptions = {
      key: fs.readFileSync('certificates/localhost.key'),
      cert: fs.readFileSync('certificates/localhost.crt'),
    };
  }
  /******  1064abac-4e28-4f7c-bd94-2adbe995521b  *******/
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Use helmet for security
  app.use(helmet());

  // enable cors
  app.enableCors();

  app.setGlobalPrefix('api' /*, { exclude: ['v1/some-route'] }*/);

  //Enabling api Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  //Enabling swagger
  const document = SwaggerModule.createDocument(app, configSwagger, {
    //ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  // Loading env files
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen(PORT);
}
bootstrap();
