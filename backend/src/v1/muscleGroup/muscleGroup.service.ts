import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroup } from './muscleGroup.entity';
import { CreateMuscleGroupDto } from './dto/createMuscleGroup.dto';
import { UpdateMuscleGroupDto } from './dto/updateMuscleGroup.dto';

@Injectable()
export class MuscleGroupService {
  constructor(
    @InjectRepository(MuscleGroup)
    private readonly muscleGroupRepo: Repository<MuscleGroup>,
  ) {}

  async findAll(): Promise<MuscleGroup[]> {
    return this.muscleGroupRepo.find();
  }

  async findOne(id: number): Promise<MuscleGroup> {
    const muscleGroup = await this.muscleGroupRepo.findOne({ where: { id } });

    if (!muscleGroup) {
      throw new NotFoundException('Muscle group not found');
    }

    return muscleGroup;
  }

  async create(dto: CreateMuscleGroupDto): Promise<MuscleGroup> {
    const existing = await this.muscleGroupRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(
        'Muscle group with that name already exists',
      );
    }

    const muscleGroup = this.muscleGroupRepo.create(dto);
    return this.muscleGroupRepo.save(muscleGroup);
  }

  async update(id: number, dto: UpdateMuscleGroupDto): Promise<MuscleGroup> {
    const muscleGroup = await this.findOne(id);
    Object.assign(muscleGroup, dto);
    return this.muscleGroupRepo.save(muscleGroup);
  }

  async remove(id: number): Promise<{ message: string }> {
    const muscleGroup = await this.findOne(id);

    await this.muscleGroupRepo.remove(muscleGroup);

    return { message: 'Muscle group deleted' };
  }
}
