import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { UserWithoutPasswordDto } from '../auth/dto/UserWithoutPassword.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { UploadService } from '../upload/upload.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,

    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,

    @InjectRepository(WorkoutSession)
    private readonly sessionRepo: Repository<WorkoutSession>,

    private readonly uploadService: UploadService,
  ) {}

  async findOneById(userId: number): Promise<UserWithoutPasswordDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserWithoutPasswordDto(user);
  }

  async updateUser(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<UserWithoutPasswordDto> {
    const needsPassword = !!dto.newPassword;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: needsPassword
        ? [
            'id',
            'email',
            'firstName',
            'lastName',
            'avatar',
            'showRpe',
            'password',
            'createdAt',
            'updatedAt',
          ]
        : [
            'id',
            'email',
            'firstName',
            'lastName',
            'avatar',
            'showRpe',
            'createdAt',
            'updatedAt',
          ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Email already in use');
      }
      user.email = dto.email;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      if (!user.password) {
        throw new BadRequestException('Password not available for comparison');
      }
      const ok = await bcrypt.compare(dto.currentPassword, user.password);
      if (!ok) {
        throw new BadRequestException('Current password is incorrect');
      }
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    const { currentPassword, newPassword, email, ...safeDto } = dto;
    Object.assign(user, safeDto);
    const updated = await this.userRepo.save(user);

    return new UserWithoutPasswordDto(updated);
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete related data
    await this.exerciseRepo.delete({ createdBy: { id: userId } });
    await this.workoutRepo.delete({ createdBy: { id: userId } });
    await this.sessionRepo.delete({ user: { id: userId } });

    await this.userRepo.remove(user);

    return { message: 'User and all related data deleted' };
  }

  async updateAvatar(
    userId: number,
    avatarUrl: string,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete old avatar if exists
    if (user.avatar) {
      await this.uploadService.deleteImage(user.avatar);
    }

    user.avatar = avatarUrl;
    const updated = await this.userRepo.save(user);

    return new UserWithoutPasswordDto(updated);
  }
}
