import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health() {
    return { ok: true, at: 'auth' };
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'User already exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    // Read cookie options from environment variables, with sensible defaults
    const cookieDomain = process.env.AUTH_COOKIE_DOMAIN || undefined;
    const cookieSecure = process.env.AUTH_COOKIE_SECURE === 'true';
    const cookieSameSite = (process.env.AUTH_COOKIE_SAMESITE || 'lax') as
      | 'lax'
      | 'strict'
      | 'none'
      | boolean;
    const cookiePath = process.env.AUTH_COOKIE_PATH || undefined;

    return this.authService.login(dto).then(({ token, user }) => {
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
        ...(cookiePath ? { path: cookiePath } : {}),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return { user };
    });
  }
}
