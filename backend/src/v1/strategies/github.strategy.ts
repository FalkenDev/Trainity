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

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') as string,
      callbackURL: `${configService.get<string>('BACKEND_URL') ?? 'http://localhost:1337'}/v1/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    const email: string | undefined =
      profile.emails?.find((e: any) => e.verified)?.value ??
      profile.emails?.[0]?.value;

    const firstName = profile.displayName?.split(' ')[0] ?? profile.username ?? '';
    const lastName = profile.displayName?.split(' ').slice(1).join(' ') ?? '';
    const avatar = profile.photos?.[0]?.value;

    return this.authService.findOrCreateGithubUser({
      githubId: profile.id,
      email,
      firstName,
      lastName,
      avatar,
    });
  }
}
