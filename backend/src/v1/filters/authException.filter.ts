import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionsFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();


    // Read cookie options from environment variables, with sensible defaults
    const cookieDomain = process.env.AUTH_COOKIE_DOMAIN || undefined;
    const cookieSecure = process.env.AUTH_COOKIE_SECURE === 'true';
    const cookieSameSite = process.env.AUTH_COOKIE_SAMESITE || 'lax';
    const cookiePath = process.env.AUTH_COOKIE_PATH || undefined;

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
