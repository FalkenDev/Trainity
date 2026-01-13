import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
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
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const isLocalhost =
      req.hostname === 'localhost' ||
      req.hostname === '127.0.0.1' ||
      req.hostname === '::1';

    const cookiePath = process.env.AUTH_COOKIE_PATH || '/';

    const envSameSite = process.env.AUTH_COOKIE_SAMESITE?.toLowerCase();
    let cookieSameSite: boolean | 'lax' | 'strict' | 'none' | undefined = 'lax';
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

    // Local dev (http://localhost:*): never set Domain or Secure, and avoid SameSite=None
    if (isLocalhost) {
      cookieDomain = undefined;
      cookieSecure = false;
      cookieSameSite = 'lax';
    }

    // Browsers require Secure when SameSite=None
    if (cookieSameSite === 'none') {
      cookieSecure = true;
    }

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
