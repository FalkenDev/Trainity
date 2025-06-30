import { Controller, Post, Body, Res } from '@nestjs/common';
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
    return this.authService.login(dto).then(({ token, user }) => {
      res.cookie('auth_token', token, {
        httpOnly: true, // Prevents JS access (XSS safe)
        secure: false, // Set to true in production (HTTPS)
        sameSite: 'lax', // or 'strict'/'none' depending on your setup
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { user }; // Return only user data, token is now in cookie
    });
  }
}
