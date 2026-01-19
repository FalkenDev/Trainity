import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';
import { ActivityResponseDto } from './dto/activityResponse.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  private toResponseDto(activity: Activity): ActivityResponseDto {
    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      icon: activity.icon,
      trackDistance: activity.trackDistance,
      trackPace: activity.trackPace,
      trackElevation: activity.trackElevation,
      trackCalories: activity.trackCalories,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }

  async findAll(userId: number): Promise<ActivityResponseDto[]> {
    const activities = await this.activityRepo.find({
      where: { createdBy: { id: userId } },
      order: { name: 'ASC' },
    });

    return activities.map((a) => this.toResponseDto(a));
  }

  async findOne(id: number, userId: number): Promise<ActivityResponseDto> {
    const activity = await this.activityRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.toResponseDto(activity);
  }

  async create(
    dto: CreateActivityDto,
    userId: number,
  ): Promise<ActivityResponseDto> {
    // Check for duplicate name
    const existing = await this.activityRepo.findOne({
      where: { name: dto.name, createdBy: { id: userId } },
    });

    if (existing) {
      throw new ConflictException('Activity with this name already exists');
    }

    const activity = this.activityRepo.create({
      ...dto,
      createdBy: { id: userId } as any,
    });

    const saved = await this.activityRepo.save(activity);
    return this.toResponseDto(saved);
  }

  async update(
    id: number,
    dto: UpdateActivityDto,
    userId: number,
  ): Promise<ActivityResponseDto> {
    const activity = await this.activityRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check for duplicate name if name is being updated
    if (dto.name && dto.name !== activity.name) {
      const existing = await this.activityRepo.findOne({
        where: { name: dto.name, createdBy: { id: userId } },
      });

      if (existing) {
        throw new ConflictException('Activity with this name already exists');
      }
    }

    Object.assign(activity, dto);
    const saved = await this.activityRepo.save(activity);
    return this.toResponseDto(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    const activity = await this.activityRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.activityRepo.remove(activity);
  }
}
