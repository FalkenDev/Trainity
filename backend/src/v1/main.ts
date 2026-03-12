/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { AuthExceptionsFilter } from './filters/authException.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Read allowed origins from env (comma-separated)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000'];
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


  // Cache-control and no-store headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.removeHeader?.('ETag');
    next();
  });

  app.enableCors({
    origin: allowedOrigins,
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
