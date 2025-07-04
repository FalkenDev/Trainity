import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import { ExerciseResponseDto } from './dto/exerciseResponse.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  private toResponseDto(exercise: Exercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      createdAt: exercise.createdAt,
      muscleGroups:
        exercise.muscleGroups?.map((mg) => ({
          id: mg.id,
          name: mg.name,
          description: mg.description,
          createdAt: mg.createdAt,
          updatedAt: mg.updatedAt,
        })) || [],
    };
  }

  private toResponseList(exercises: Exercise[]): ExerciseResponseDto[] {
    return exercises.map((e) => this.toResponseDto(e));
  }

  async findAll(userId: number): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepo.find({
      where: { createdBy: { id: userId } },
      relations: ['muscleGroups'],
    });

    return this.toResponseList(exercises);
  }

  async findOne(id: number, userId: number): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['muscleGroups'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return this.toResponseDto(exercise);
  }

  async create(
    dto: CreateExerciseDto,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const exercise = this.exerciseRepo.create({
      ...dto,
      createdBy: { id: userId } as any,
    });

    const saved = await this.exerciseRepo.save(exercise);
    return this.toResponseDto(saved);
  }

  async update(
    id: number,
    dto: UpdateExerciseDto,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const existing = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['muscleGroups'],
    });

    if (!existing) {
      throw new NotFoundException('Exercise not found');
    }

    Object.assign(existing, dto);
    const updated = await this.exerciseRepo.save(existing);
    return this.toResponseDto(updated);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    await this.exerciseRepo.remove(exercise);
    return { message: 'Exercise deleted' };
  }
}
