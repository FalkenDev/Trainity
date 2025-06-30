import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutSession } from './workoutSession.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutStatus } from '../types/WorkoutStatus.type';

@Injectable()
export class WorkoutSessionService {
  constructor(
    @InjectRepository(WorkoutSession)
    private readonly sessionRepo: Repository<WorkoutSession>,

    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,

    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,

    @InjectRepository(WorkoutSessionExercise)
    private readonly sessionExerciseRepo: Repository<WorkoutSessionExercise>,

    @InjectRepository(WorkoutSessionSet)
    private readonly setRepo: Repository<WorkoutSessionSet>,
  ) {}

  async getAllSessions(userId: number): Promise<WorkoutSession[]> {
    console.log('Fetching all workout sessions for user:', userId);
    return this.sessionRepo.find({ where: { user: { id: userId } } });
  }

  async getOneSession(id: number, userId: number): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id, user: { id: userId } },
      relations: [
        'workout',
        'exercises',
        'exercises.exercise',
        'exercises.sets',
      ],
    });

    if (!session) throw new NotFoundException('Workout session not found');
    return session;
  }

  async createSession(
    workoutId: number,
    userId: number,
  ): Promise<WorkoutSession> {
    const workout = await this.workoutRepo.findOne({
      where: { id: workoutId },
      relations: ['exercises', 'exercises.exercise'],
    });

    if (!workout) throw new NotFoundException('Workout not found');

    const workoutSnapshot = {
      title: workout.title,
      description: workout.description,
      time: workout.time,
      exercises: workout.exercises.map((ex) => ({
        exerciseId: ex.exercise.id,
        order: ex.order,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        pauseSeconds: ex.pauseSeconds,
      })),
    };

    const session = this.sessionRepo.create({
      user: { id: userId },
      workout,
      workoutSnapshot,
      exercises: [],
      startedAt: new Date(),
    });

    return this.sessionRepo.save(session);
  }

  async addExerciseToSession(
    sessionId: number,
    exerciseId: number,
    userId: number,
    sets: {
      setNumber: number;
      weight: number;
      reps: number;
      rpe?: number;
      notes?: string;
    }[],
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, user: { id: userId } },
      relations: ['exercises', 'exercises.sets'],
    });

    if (!session) throw new NotFoundException('Session not found');

    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
      relations: ['muscleGroups'],
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const snapshot = {
      name: exercise.name,
      description: exercise.description,
      img: undefined, // Optional image if you add it to Exercise
      muscleGroups: exercise.muscleGroups?.map((mg) => mg.name),
    };

    const sessionExercise = this.sessionExerciseRepo.create({
      session,
      exercise,
      exerciseSnapshot: snapshot,
      sets: sets.map((s) => this.setRepo.create(s)),
    });

    await this.sessionExerciseRepo.save(sessionExercise);

    // Reload session to return full updated entity
    return this.getOneSession(sessionId, userId);
  }

  async completeSession(
    sessionId: number,
    userId: number,
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, user: { id: userId } },
      relations: ['exercises', 'exercises.sets', 'exercises.exercise'],
    });

    if (!session) throw new NotFoundException('Session not found');

    let totalWeight = 0;
    const stats = [];

    for (const ex of session.exercises) {
      let exTotal = 0;
      for (const set of ex.sets) {
        exTotal += set.weight * set.reps;
      }
      stats.push({ exerciseId: ex.exercise?.id, totalWeight: exTotal });
      totalWeight += exTotal;
    }

    session.status = WorkoutStatus.FINISHED;
    session.endedAt = new Date();
    session.totalWeight = totalWeight;
    session.exerciseStats = stats;

    return this.sessionRepo.save(session);
  }

  async updateSession(
    sessionId: number,
    userId: number,
    data: Partial<WorkoutSession>,
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, user: { id: userId } },
    });

    if (!session) throw new NotFoundException('Session not found');

    Object.assign(session, data);
    return this.sessionRepo.save(session);
  }

  async deleteSession(
    sessionId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, user: { id: userId } },
    });

    if (!session) throw new NotFoundException('Session not found');

    await this.sessionRepo.remove(session);
    return { message: 'Workout session deleted' };
  }
}
