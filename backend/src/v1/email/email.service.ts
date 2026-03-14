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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly frontendUrl: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.from = this.configService.get<string>('EMAIL_FROM') ?? 'noreply@localhost';
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #555; margin-bottom: 24px;">Use the code below to verify your Trainity account. It expires in <strong>15 minutes</strong>.</p>
        <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">If you didn't create a Trainity account, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: `${code} is your Trainity verification code`,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #555; margin-bottom: 24px;">Use the code below to reset your Trainity password. It expires in <strong>15 minutes</strong>.</p>
        <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: `${code} is your Trainity password reset code`,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }
}
