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
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserWithoutPasswordDto } from './dto/UserWithoutPassword.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ActivityService } from '../activity/activity.service';
import { ExerciseSeedService } from '../exercise/exerciseSeed.service';
import { activitiesToSeed } from '../seed/data/activities.data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly activityService: ActivityService,
    private readonly exerciseSeedService: ExerciseSeedService,
  ) {}

  async register(dto: RegisterDto): Promise<UserWithoutPasswordDto> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const defaultShowRpeRaw =
      this.configService.get<string>('DEFAULT_SHOW_RPE');
    const defaultShowRpe =
      defaultShowRpeRaw == null
        ? true
        : ['1', 'true', 'yes', 'on'].includes(defaultShowRpeRaw.toLowerCase());

    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      showRpe: defaultShowRpe,
    });
    const savedUser = await this.userRepo.save(user);

    // Seed default activities for new user
    await this.seedDefaultActivities(savedUser.id);

    // Seed default exercises for new user
    await this.exerciseSeedService.seedDefaultExercises(savedUser.id);

    return new UserWithoutPasswordDto(savedUser);
  }

  /**
   * Seed default activities for a new user.
   * Uses the shared activitiesToSeed list so updates only need to happen in one place.
   */
  private async seedDefaultActivities(userId: number): Promise<void> {
    for (const activity of activitiesToSeed) {
      try {
        await this.activityService.create(activity, userId);
      } catch (error) {
        // Ignore errors (e.g., duplicate names) and continue
        console.error(
          `Failed to seed activity ${activity.name}:`,
          error.message,
        );
      }
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'password',
        'showRpe',
        'onboardingCompleted',
      ],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDto = new UserWithoutPasswordDto(user);

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      token,
      user: userDto,
    };
  }
}
