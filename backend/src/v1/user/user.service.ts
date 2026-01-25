import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { UserWithoutPasswordDto } from '../auth/dto/UserWithoutPassword.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UpdateUserPreferencesDto } from './dto/UpdateUserPreferences.dto';
import { Workout } from '../workout/workout.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';
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

    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,

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
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
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

    // Destructure to exclude sensitive fields before saving
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * Update streak and weekly workout count when a workout is completed
   * Should be called after finishing a workout session
   */
  async updateStreakOnWorkoutCompletion(userId: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const now = new Date();

    // Check if we need to reset for a new week
    await this.checkAndResetWeeklyProgress(user, now);

    // Increment current week workouts
    user.currentWeekWorkouts += 1;

    // Increment streak by 1 for every workout
    user.currentStreak += 1;

    user.lastStreakCheckDate = now;
    await this.userRepo.save(user);
  }

  /**
   * Check if we're in a new week and reset/update streak accordingly
   * Counts both workout sessions and activity logs
   */
  private async checkAndResetWeeklyProgress(
    user: User,
    now: Date,
  ): Promise<void> {
    if (!user.lastStreakCheckDate) {
      // First time tracking - reset counters
      user.currentWeekWorkouts = 0;
      user.currentStreak = 0;
      return;
    }

    const lastCheck = new Date(user.lastStreakCheckDate);

    // Get the Monday of each week (ISO week starts on Monday)
    const getMondayOfWeek = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const lastWeekMonday = getMondayOfWeek(lastCheck);
    const currentWeekMonday = getMondayOfWeek(now);

    // If we're in a new week
    if (currentWeekMonday > lastWeekMonday) {
      // Calculate how many weeks have passed
      const weeksPassed = Math.floor(
        (currentWeekMonday.getTime() - lastWeekMonday.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );

      // Count unique days with activities (sessions OR logs) in the previous week
      const lastWeekSunday = new Date(currentWeekMonday);
      lastWeekSunday.setDate(lastWeekSunday.getDate() - 1);
      lastWeekSunday.setHours(23, 59, 59, 999);

      const workoutDays = await this.countUniqueDaysWithActivity(
        user.id,
        lastWeekMonday,
        lastWeekSunday,
      );

      // Check if user met their goal in the previous week
      if (workoutDays < user.weeklyWorkoutGoal) {
        // Didn't meet goal, reset streak to 0
        user.currentStreak = 0;
      } else if (weeksPassed > 1) {
        // More than one week passed (means they didn't workout at all in between)
        // Even if they met the goal in the last tracked week, they missed weeks in between
        user.currentStreak = 0;
      }
      // If they met the goal and it's been exactly 1 week, streak continues

      // Reset weekly workout count for the new week
      user.currentWeekWorkouts = 0;
    }
  }

  /**
   * Count unique days with either workout sessions or activity logs in a date range
   */
  private async countUniqueDaysWithActivity(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // Get all workout session dates
    const sessions = await this.sessionRepo.find({
      where: {
        user: { id: userId },
      },
      select: ['startedAt'],
    });

    // Get all activity log dates
    const activityLogs = await this.activityLogRepo.find({
      where: {
        user: { id: userId },
      },
      select: ['date'],
    });

    // Collect unique date strings (YYYY-MM-DD)
    const uniqueDays = new Set<string>();

    sessions.forEach((session) => {
      const date = new Date(session.startedAt);
      if (date >= startDate && date <= endDate) {
        const dateString = date.toISOString().split('T')[0];
        uniqueDays.add(dateString);
      }
    });

    activityLogs.forEach((log) => {
      const date = new Date(log.date);
      if (date >= startDate && date <= endDate) {
        const dateString = date.toISOString().split('T')[0];
        uniqueDays.add(dateString);
      }
    });

    return uniqueDays.size;
  }

  /**
   * Update streak and weekly workout count when an activity log is created
   * Should be called after logging an activity
   */
  async updateStreakOnActivityLog(userId: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const now = new Date();

    // Check if we need to reset for a new week
    await this.checkAndResetWeeklyProgress(user, now);

    // Increment current week workouts
    user.currentWeekWorkouts += 1;

    // Increment streak by 1 for every activity
    user.currentStreak += 1;

    user.lastStreakCheckDate = now;
    await this.userRepo.save(user);
  }

  /**
   * Get user's current streak information
   */
  async getStreakInfo(userId: number): Promise<{
    currentStreak: number;
    weeklyWorkoutGoal: number;
    currentWeekWorkouts: number;
    progressPercentage: number;
  }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if we need to update streak for new week
    const now = new Date();
    await this.checkAndResetWeeklyProgress(user, now);

    // Recalculate current week workouts based on actual activity
    const getMondayOfWeek = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const currentWeekMonday = getMondayOfWeek(now);
    const currentWeekSunday = new Date(currentWeekMonday);
    currentWeekSunday.setDate(currentWeekSunday.getDate() + 6);
    currentWeekSunday.setHours(23, 59, 59, 999);

    user.currentWeekWorkouts = await this.countUniqueDaysWithActivity(
      userId,
      currentWeekMonday,
      currentWeekSunday,
    );

    await this.userRepo.save(user);

    const progressPercentage =
      user.weeklyWorkoutGoal > 0
        ? Math.min(
            (user.currentWeekWorkouts / user.weeklyWorkoutGoal) * 100,
            100,
          )
        : 0;

    return {
      currentStreak: user.currentStreak,
      weeklyWorkoutGoal: user.weeklyWorkoutGoal,
      currentWeekWorkouts: user.currentWeekWorkouts,
      progressPercentage: Math.round(progressPercentage),
    };
  }

  /**
   * Update user's weekly workout goal
   */
  async updateWeeklyWorkoutGoal(
    userId: number,
    weeklyWorkoutGoal: number,
  ): Promise<UserWithoutPasswordDto> {
    if (weeklyWorkoutGoal < 1 || weeklyWorkoutGoal > 7) {
      throw new BadRequestException(
        'Weekly workout goal must be between 1 and 7',
      );
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.weeklyWorkoutGoal = weeklyWorkoutGoal;
    const updated = await this.userRepo.save(user);

    return new UserWithoutPasswordDto(updated);
  }

  /**
   * Update user preferences (onboarding data)
   */
  async updateUserPreferences(
    userId: number,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update all provided fields
    if (dto.unitScale !== undefined) user.unitScale = dto.unitScale;
    if (dto.weight !== undefined) user.weight = dto.weight;
    if (dto.height !== undefined) user.height = dto.height;
    if (dto.dateOfBirth !== undefined)
      user.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.gender !== undefined) user.gender = dto.gender;
    if (dto.primaryGoal !== undefined) user.primaryGoal = dto.primaryGoal;
    if (dto.weeklyWorkoutGoal !== undefined) {
      if (dto.weeklyWorkoutGoal < 1 || dto.weeklyWorkoutGoal > 7) {
        throw new BadRequestException(
          'Weekly workout goal must be between 1 and 7',
        );
      }
      user.weeklyWorkoutGoal = dto.weeklyWorkoutGoal;
    }
    if (dto.targetWeight !== undefined) user.targetWeight = dto.targetWeight;
    if (dto.goalTimeframe !== undefined) user.goalTimeframe = dto.goalTimeframe;
    if (dto.onboardingCompleted !== undefined)
      user.onboardingCompleted = dto.onboardingCompleted;

    const updated = await this.userRepo.save(user);
    return new UserWithoutPasswordDto(updated);
  }
}
