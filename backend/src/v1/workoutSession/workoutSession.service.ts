import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WorkoutSession } from './workoutSession.entity';
import { Workout } from '../workout/workout.entity';
import { WorkoutSessionExercise } from './workoutSessionExercise.entity';
import { WorkoutSessionSet } from './workoutSessionSet.entity';
import { Exercise } from '../exercise/exercise.entity';
import { WorkoutStatus } from '../types/WorkoutStatus.type';
import { UserService } from '../user/user.service';
import { ScheduledSession } from '../scheduledSession/scheduledSession.entity';
import { StatisticsService } from '../statistics/statistics.service';

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
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async getAllSessions(userId: number): Promise<WorkoutSession[]> {
    return this.sessionRepo.find({ where: { user: { id: userId } } });
  }

  async getOneSession(id: number, userId: number): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id, user: { id: userId } },
      relations: [
        'workout',
        'workout.exercises',
        'workout.exercises.exercise',
        'exercises',
        'exercises.exercise',
        'exercises.sets',
      ],
      withDeleted: true,
    });

    if (!session) throw new NotFoundException('Workout session not found');
    return session;
  }

  async createSession(
    workoutId: number,
    userId: number,
    scheduledSessionId?: number,
  ): Promise<WorkoutSession> {
    const workout = await this.workoutRepo.findOne({
      where: { id: workoutId },
      relations: ['exercises', 'exercises.exercise'],
    });

    if (!workout) throw new NotFoundException('Workout not found');

    const session = this.sessionRepo.create({
      user: { id: userId },
      workout,
      exercises: [],
      startedAt: new Date(),
      scheduledSession: scheduledSessionId
        ? ({ id: scheduledSessionId } as any)
        : null,
    });

    return this.sessionRepo.save(session);
  }

  async createEmptySession(
    userId: number,
    scheduledSessionId?: number,
  ): Promise<WorkoutSession> {
    const session = this.sessionRepo.create({
      user: { id: userId },
      workout: null,
      exercises: [],
      startedAt: new Date(),
      scheduledSession: scheduledSessionId
        ? ({ id: scheduledSessionId } as any)
        : null,
    });

    return this.sessionRepo.save(session);
  }

  async logPastSession(
    userId: number,
    dto: {
      workoutId?: number;
      startedAt: string;
      endedAt: string;
      notes?: string;
      scheduledSessionId?: number;
      completedExercises?: {
        exerciseId: number;
        sets: { setNumber: number; weight: number; reps: number }[];
      }[];
    },
  ): Promise<WorkoutSession> {
    return this.dataSource.transaction(async (manager) => {
      let workout: Workout | null = null;
      if (dto.workoutId) {
        workout = await manager.findOne(Workout, {
          where: { id: dto.workoutId },
          withDeleted: true,
        });
      }

      const session = manager.create(WorkoutSession, {
        user: { id: userId },
        workout: workout || null,
        exercises: [],
        startedAt: new Date(dto.startedAt),
        endedAt: new Date(dto.endedAt),
        status: 'finished' as const,
        totalWeight: 0,
        exerciseStats: [],
        notes: dto.notes || null,
        scheduledSession: dto.scheduledSessionId
          ? ({ id: dto.scheduledSessionId } as any)
          : undefined,
      } as any);

      const saved = await manager.save(WorkoutSession, session);

      // Save completed exercises & sets if provided
      if (dto.completedExercises?.length) {
        const sessionExercises: WorkoutSessionExercise[] = [];
        const allSets: WorkoutSessionSet[] = [];

        for (const ce of dto.completedExercises) {
          const exercise = await manager.findOne(Exercise, {
            where: { id: ce.exerciseId },
            withDeleted: true,
          });
          if (!exercise)
            throw new NotFoundException(`Exercise ${ce.exerciseId} not found`);

          const sessionExercise = manager.create(WorkoutSessionExercise, {
            session: saved,
            exercise,
          });
          sessionExercises.push(sessionExercise);
        }

        await manager.save(WorkoutSessionExercise, sessionExercises);

        for (let i = 0; i < dto.completedExercises.length; i++) {
          const ce = dto.completedExercises[i];
          const sessionExercise = sessionExercises[i];
          const sets = (ce.sets ?? []).map((s) =>
            manager.create(WorkoutSessionSet, {
              setNumber: s.setNumber,
              weight: s.weight,
              reps: s.reps,
              sessionExercise,
            }),
          );
          allSets.push(...sets);
        }

        if (allSets.length) {
          await manager.save(WorkoutSessionSet, allSets);
        }

        // Compute totalWeight & exerciseStats
        let totalWeight = 0;
        const stats: { exerciseId: number; totalWeight: number }[] = [];
        for (let i = 0; i < dto.completedExercises.length; i++) {
          const ce = dto.completedExercises[i];
          let exTotal = 0;
          for (const s of ce.sets ?? []) {
            exTotal += s.weight * s.reps;
          }
          stats.push({ exerciseId: ce.exerciseId, totalWeight: exTotal });
          totalWeight += exTotal;
        }

        saved.totalWeight = totalWeight;
        saved.exerciseStats = stats;
        await manager.save(WorkoutSession, saved);
      }

      // Update streak
      await this.userService.updateStreakOnWorkoutCompletion(userId);

      // Compute and upsert personal records for logged past sessions
      if (dto.completedExercises?.length) {
        const completedForRecords = dto.completedExercises
          .filter((ce) => ce.sets?.length)
          .map((ce) => ({
            exerciseId: ce.exerciseId,
            sets: (ce.sets ?? []).map((s) => ({
              weight: s.weight ?? 0,
              reps: s.reps ?? 0,
            })),
          }));

        if (completedForRecords.length) {
          await this.statisticsService.computeAndUpsertRecords(
            userId,
            saved.id,
            completedForRecords,
          );
        }
      }

      return manager.findOneOrFail(WorkoutSession, {
        where: { id: saved.id },
        relations: [
          'exercises',
          'exercises.sets',
          'exercises.exercise',
          'exercises.exercise.muscleGroups',
        ],
        withDeleted: true,
      });
    });
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
      withDeleted: true,
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const sessionExercise = this.sessionExerciseRepo.create({
      session,
      exercise,
      sets: sets.map((s) => this.setRepo.create(s)),
    });

    await this.sessionExerciseRepo.save(sessionExercise);

    // Reload session to return full updated entity
    return this.getOneSession(sessionId, userId);
  }

  async completeSession(
    sessionId: number,
    userId: number,
    payload?: {
      completedExercises?: {
        exerciseId: number;
        notes?: string;
        sets: {
          setNumber: number;
          weight: number;
          reps: number;
          rpe?: number;
          notes?: string;
        }[];
      }[];
      notes?: string;
    },
  ): Promise<WorkoutSession> {
    return this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(WorkoutSession, {
        where: { id: sessionId, user: { id: userId } },
        relations: ['exercises', 'exercises.sets', 'exercises.exercise'],
      });
      if (!session) throw new NotFoundException('Session not found');

      const newlyCreatedExercises: WorkoutSessionExercise[] = [];
      const setsToSave: WorkoutSessionSet[] = [];
      const setsToRemove: WorkoutSessionSet[] = [];
      const exercisesToUpdateNotes: WorkoutSessionExercise[] = [];

      if (payload?.completedExercises?.length) {
        const existingByExerciseId = new Map<number, WorkoutSessionExercise>();
        for (const ex of session.exercises ?? []) {
          if (ex.exercise?.id) existingByExerciseId.set(ex.exercise.id, ex);
        }

        for (const ce of payload.completedExercises) {
          let sessionExercise = existingByExerciseId.get(ce.exerciseId);

          if (!sessionExercise) {
            const exercise = await manager.findOne(Exercise, {
              where: { id: ce.exerciseId },
              withDeleted: true,
            });
            if (!exercise) throw new NotFoundException('Exercise not found');

            sessionExercise = manager.create(WorkoutSessionExercise, {
              session,
              exercise,
              notes: ce.notes,
            });

            newlyCreatedExercises.push(sessionExercise);
            session.exercises.push(sessionExercise);
          } else if (
            ce.notes !== undefined &&
            ce.notes !== sessionExercise.notes
          ) {
            sessionExercise.notes = ce.notes;
            exercisesToUpdateNotes.push(sessionExercise);
          }

          if (sessionExercise.sets?.length) {
            setsToRemove.push(...sessionExercise.sets);
          }

          const newSets = (ce.sets ?? []).map((s) =>
            manager.create(WorkoutSessionSet, {
              setNumber: s.setNumber,
              weight: s.weight,
              reps: s.reps,
              rpe: s.rpe,
              notes: s.notes,
            }),
          );

          sessionExercise.sets = newSets;
          if (newSets.length) setsToSave.push(...newSets);
        }
      }

      if (newlyCreatedExercises.length) {
        await manager.save(WorkoutSessionExercise, newlyCreatedExercises);
      }

      if (setsToRemove.length) {
        await manager.remove(WorkoutSessionSet, setsToRemove);
      }

      for (const ex of session.exercises ?? []) {
        if (ex.sets?.length) {
          for (const s of ex.sets) s.sessionExercise = ex;
        }
      }

      if (setsToSave.length) {
        await manager.save(WorkoutSessionSet, setsToSave);
      }

      for (const ex of exercisesToUpdateNotes) {
        await manager.update(
          WorkoutSessionExercise,
          { id: ex.id },
          { notes: ex.notes ?? '' },
        );
      }

      if (payload?.notes !== undefined) {
        session.notes = payload.notes;
      }

      let totalWeight = 0;
      const stats: { exerciseId: number; totalWeight: number }[] = [];
      for (const ex of session.exercises ?? []) {
        let exTotal = 0;
        for (const set of ex.sets ?? []) {
          exTotal += set.weight * set.reps;
        }
        stats.push({ exerciseId: ex.exercise?.id, totalWeight: exTotal });
        totalWeight += exTotal;
      }

      session.status = 'finished';
      session.endedAt = new Date();
      session.totalWeight = totalWeight;
      session.exerciseStats = stats;

      await manager.save(WorkoutSession, session);

      // Update user's streak after finishing workout
      await this.userService.updateStreakOnWorkoutCompletion(userId);

      // Compute and upsert personal records
      const completedForRecords = (session.exercises ?? [])
        .filter((ex) => ex.exercise?.id && ex.sets?.length)
        .map((ex) => ({
          exerciseId: ex.exercise.id,
          sets: (ex.sets ?? []).map((s) => ({
            weight: s.weight ?? 0,
            reps: s.reps ?? 0,
            rpe: s.rpe,
          })),
        }));

      let newRecords: any[] = [];
      if (completedForRecords.length) {
        newRecords = await this.statisticsService.computeAndUpsertRecords(
          userId,
          session.id,
          completedForRecords,
        );
      }

      const result = await manager.findOneOrFail(WorkoutSession, {
        where: { id: session.id },
        relations: [
          'exercises',
          'exercises.sets',
          'exercises.exercise',
          'exercises.exercise.muscleGroups',
        ],
        withDeleted: true,
      });

      return { ...result, newRecords } as any;
    });
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

  async abandonSession(
    sessionId: number,
    userId: number,
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, user: { id: userId } },
    });

    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    if (
      session.status === WorkoutStatus.FINISHED ||
      session.status === WorkoutStatus.ABANDONED
    ) {
      throw new BadRequestException(
        `Session is already ${session.status} and cannot be abandoned.`,
      );
    }

    session.status = WorkoutStatus.ABANDONED;
    session.endedAt = new Date();

    return this.sessionRepo.save(session);
  }
}
