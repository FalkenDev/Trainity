import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { UserWithoutPasswordDto } from '../auth/dto/UserWithoutPassword.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { UploadService } from '../upload/upload.service';

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
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
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
