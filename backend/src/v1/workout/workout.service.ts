import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Workout } from './workout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { WorkoutResponseDto } from './dto/workoutResponse.dto';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepo: Repository<Workout>,

    @InjectRepository(WorkoutSession)
    private readonly workoutSessionRepository: Repository<WorkoutSession>,
  ) {}

  async getWorkoutList(userId: number): Promise<WorkoutResponseDto[]> {
    const workouts = await this.workoutRepo.find({
      where: { createdBy: { id: userId } },
      relations: ['exercises', 'exercises.exercise', 'createdBy'],
    });

    return workouts.map((w) => this.toResponseDto(w));
  }

  async createWorkout(
    dto: CreateWorkoutDto,
    userId: number,
  ): Promise<WorkoutResponseDto> {
    const workout = this.workoutRepo.create({
      ...dto,
      createdBy: { id: userId } as User,
    });

    const saved = await this.workoutRepo.save(workout);
    return this.toResponseDto(saved);
  }

  async getWorkout(id: number, userId: number): Promise<WorkoutResponseDto> {
    const workout = await this.workoutRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['exercises', 'exercises.exercise'],
    });

    if (!workout) throw new NotFoundException('Workout not found');
    return this.toResponseDto(workout);
  }

  async updateWorkout(
    id: number,
    dto: UpdateWorkoutDto,
    userId: number,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });
    if (!workout) throw new NotFoundException('Workout not found');

    Object.assign(workout, dto);
    const updated = await this.workoutRepo.save(workout);
    return this.toResponseDto(updated);
  }

  async deleteWorkout(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const workout = await this.workoutRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });
    if (!workout) throw new NotFoundException('Workout not found');

    await this.workoutSessionRepository.update(
      { workout: { id } },
      { workout: undefined },
    );
    await this.workoutRepo.remove(workout);

    return { message: 'Workout deleted and references removed' };
  }

  async duplicateWorkout(
    id: number,
    userId: number,
  ): Promise<WorkoutResponseDto> {
    const original = await this.workoutRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['exercises', 'createdBy'],
    });

    if (!original) throw new NotFoundException('Workout not found');

    const baseTitle = original.title.replace(/\s\(\d+\)$/, '');
    const existingCopies = await this.workoutRepo.find({
      where: { createdBy: { id: userId }, title: Like(`${baseTitle}%`) },
    });

    let copyNumber = 1;
    existingCopies.forEach((w) => {
      const match = w.title.match(/\((\d+)\)$/);
      const number = match ? parseInt(match[1], 10) : 0;
      copyNumber = Math.max(copyNumber, number + 1);
    });

    const duplicate = this.workoutRepo.create({
      ...original,
      title: `${baseTitle} (${copyNumber})`,
      createdBy: original.createdBy,
      id: undefined,
    });

    const saved = await this.workoutRepo.save(duplicate);
    return this.toResponseDto(saved);
  }

  private toResponseDto(workout: Workout): WorkoutResponseDto {
    return {
      id: workout.id,
      title: workout.title,
      description: workout.description,
      time: workout.time,
      defaultWeightAndReps: workout.defaultWeightAndReps,
      exercises:
        workout.exercises?.map((e) => ({
          order: e.order,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          pauseSeconds: e.pauseSeconds,
          exercise: {
            id: e.exercise.id,
            name: e.exercise.name,
            description: e.exercise.description,
          },
        })) || [],
      createdAt: workout.createdAt,
    };
  }
}
