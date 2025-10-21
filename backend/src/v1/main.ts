import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { AuthExceptionsFilter } from './filters/authException.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalFilters(new AuthExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    ['/api/docs', '/api/docs-json'],
    basicAuth({
      users: { admin: 'password' },
      challenge: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Trainity-Api Documentation')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('v1');

  // Serve static files from the uploads directory (after setting global prefix)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(1337, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}/api/docs `);
}

void bootstrap();
