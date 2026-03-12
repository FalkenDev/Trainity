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

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionsFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();


    const isLocalhost =
      request?.hostname === 'localhost' ||
      request?.hostname === '127.0.0.1' ||
      request?.hostname === '::1';

    const cookiePath = process.env.AUTH_COOKIE_PATH || '/';

    // Map env value to correct type for sameSite
    let cookieSameSite: boolean | 'lax' | 'strict' | 'none' | undefined = 'lax';
    const envSameSite = process.env.AUTH_COOKIE_SAMESITE?.toLowerCase();
    if (envSameSite === 'lax' || envSameSite === 'strict' || envSameSite === 'none') {
      cookieSameSite = envSameSite;
    } else if (envSameSite === 'true') {
      cookieSameSite = true;
    } else if (envSameSite === 'false') {
      cookieSameSite = false;
    } else if (envSameSite === undefined) {
      cookieSameSite = 'lax';
    } else {
      cookieSameSite = undefined;
    }

    let cookieDomain = process.env.AUTH_COOKIE_DOMAIN || undefined;
    let cookieSecure = process.env.AUTH_COOKIE_SECURE === 'true';

    if (isLocalhost) {
      cookieDomain = undefined;
      cookieSecure = false;
      cookieSameSite = 'lax';
    }

    if (cookieSameSite === 'none') {
      cookieSecure = true;
    }

    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSameSite,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
      ...(cookiePath ? { path: cookiePath } : {}),
    });

    response.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
