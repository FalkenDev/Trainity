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

    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    response.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
}
