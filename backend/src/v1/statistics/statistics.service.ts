import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRecord, RecordType } from './exerciseRecord.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { WorkoutSessionExercise } from '../workoutSession/workoutSessionExercise.entity';
import { WorkoutSessionSet } from '../workoutSession/workoutSessionSet.entity';
import { Exercise } from '../exercise/exercise.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(ExerciseRecord)
    private readonly recordRepo: Repository<ExerciseRecord>,
    @InjectRepository(WorkoutSession)
    private readonly sessionRepo: Repository<WorkoutSession>,
    @InjectRepository(WorkoutSessionExercise)
    private readonly sessionExerciseRepo: Repository<WorkoutSessionExercise>,
    @InjectRepository(WorkoutSessionSet)
    private readonly setRepo: Repository<WorkoutSessionSet>,
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  // ─── Exercise History ────────────────────────────────────
  async getExerciseHistory(
    userId: number,
    exerciseId: number,
    page = 1,
    limit = 20,
  ) {
    const qb = this.sessionExerciseRepo
      .createQueryBuilder('se')
      .innerJoinAndSelect('se.session', 'ws')
      .leftJoinAndSelect('se.sets', 'sets')
      .where('se.exercise.id = :exerciseId', { exerciseId })
      .andWhere('ws.user.id = :userId', { userId })
      .andWhere('ws.status = :status', { status: 'finished' })
      .orderBy('ws.endedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    const entries = items.map((se) => {
      const sets = (se.sets ?? [])
        .sort((a, b) => a.setNumber - b.setNumber)
        .map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
          rpe: s.rpe,
          distance: s.distance,
          duration: s.duration,
          calories: s.calories,
        }));

      let totalVolume = 0;
      for (const s of se.sets ?? []) {
        totalVolume += (s.weight ?? 0) * (s.reps ?? 0);
      }

      return {
        date: se.session.endedAt ?? se.session.startedAt,
        sessionId: se.session.id,
        sets,
        totalVolume,
        notes: se.notes,
      };
    });

    return { entries, total, page, limit };
  }

  // ─── Exercise Records ────────────────────────────────────
  async getExerciseRecords(userId: number, exerciseId: number) {
    const records = await this.recordRepo.find({
      where: { user: { id: userId }, exercise: { id: exerciseId } },
      relations: ['workoutSession'],
    });

    const result: Record<
      string,
      { value: number; date: Date; setDetails: any } | null
    > = {
      maxWeight: null,
      estimatedOneRepMax: null,
      maxVolumeSet: null,
      maxVolumeSession: null,
      maxReps: null,
    };

    for (const r of records) {
      const entry = {
        value: Number(r.value),
        date: r.achievedAt,
        setDetails: r.setDetails,
      };
      switch (r.recordType) {
        case RecordType.MAX_WEIGHT:
          result.maxWeight = entry;
          break;
        case RecordType.ESTIMATED_1RM:
          result.estimatedOneRepMax = entry;
          break;
        case RecordType.MAX_VOLUME_SET:
          result.maxVolumeSet = entry;
          break;
        case RecordType.MAX_VOLUME_SESSION:
          result.maxVolumeSession = entry;
          break;
        case RecordType.MAX_REPS:
          result.maxReps = entry;
          break;
      }
    }

    return result;
  }

  // ─── Exercise Progress Chart Data ────────────────────────
  async getExerciseProgress(
    userId: number,
    exerciseId: number,
    metric: 'estimated_1rm' | 'max_weight' | 'total_volume' | 'max_reps',
    period: '1m' | '3m' | '6m' | '1y' | 'all' = 'all',
  ) {
    const dateFilter = this.getPeriodDate(period);

    const qb = this.sessionExerciseRepo
      .createQueryBuilder('se')
      .innerJoinAndSelect('se.session', 'ws')
      .leftJoinAndSelect('se.sets', 'sets')
      .where('se.exercise.id = :exerciseId', { exerciseId })
      .andWhere('ws.user.id = :userId', { userId })
      .andWhere('ws.status = :status', { status: 'finished' })
      .orderBy('ws.endedAt', 'ASC');

    if (dateFilter) {
      qb.andWhere('ws.endedAt >= :dateFilter', { dateFilter });
    }

    const items = await qb.getMany();

    const dataPoints: { date: Date; value: number }[] = [];
    for (const se of items) {
      const date = se.session.endedAt ?? se.session.startedAt;
      let value = 0;

      switch (metric) {
        case 'estimated_1rm':
          value = this.computeBestEstimated1RM(se.sets ?? []);
          break;
        case 'max_weight':
          value = this.computeMaxWeight(se.sets ?? []);
          break;
        case 'total_volume':
          value = this.computeTotalVolume(se.sets ?? []);
          break;
        case 'max_reps':
          value = this.computeMaxReps(se.sets ?? []);
          break;
      }

      if (value > 0) {
        dataPoints.push({ date, value });
      }
    }

    return dataPoints;
  }

  // ─── Workout History ─────────────────────────────────────
  async getWorkoutHistory(
    userId: number,
    workoutId: number,
    page = 1,
    limit = 20,
  ) {
    const qb = this.sessionRepo
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.exercises', 'ex')
      .leftJoinAndSelect('ex.sets', 'sets')
      .where('ws.workout.id = :workoutId', { workoutId })
      .andWhere('ws.user.id = :userId', { userId })
      .andWhere('ws.status = :status', { status: 'finished' })
      .orderBy('ws.endedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    const sessions = items.map((ws) => {
      const durationMs =
        ws.endedAt && ws.startedAt
          ? new Date(ws.endedAt).getTime() - new Date(ws.startedAt).getTime()
          : 0;
      return {
        id: ws.id,
        date: ws.endedAt ?? ws.startedAt,
        duration: Math.round(durationMs / 60000),
        totalVolume: ws.totalWeight,
        exerciseCount: (ws.exercises ?? []).length,
        notes: ws.notes,
      };
    });

    // Overall summary across ALL sessions for this workout (not just the page)
    const allSessions = await this.sessionRepo.find({
      where: {
        workout: { id: workoutId },
        user: { id: userId },
        status: 'finished' as const,
      },
      select: ['id', 'startedAt', 'endedAt', 'totalWeight'],
    });

    const timesCompleted = allSessions.length;
    let totalDuration = 0;
    let totalVolume = 0;
    let lastPerformed: Date | null = null;
    let firstPerformed: Date | null = null;

    for (const s of allSessions) {
      const dur =
        s.endedAt && s.startedAt
          ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
          : 0;
      totalDuration += dur;
      totalVolume += s.totalWeight ?? 0;
      const endDate = s.endedAt ?? s.startedAt;
      if (!lastPerformed || endDate > lastPerformed) lastPerformed = endDate;
      if (!firstPerformed || endDate < firstPerformed) firstPerformed = endDate;
    }

    const summary = {
      timesCompleted,
      averageDuration:
        timesCompleted > 0
          ? Math.round(totalDuration / timesCompleted / 60000)
          : 0,
      averageVolume:
        timesCompleted > 0 ? Math.round(totalVolume / timesCompleted) : 0,
      lastPerformed,
      firstPerformed,
    };

    return { sessions, summary, total, page, limit };
  }

  // ─── Overview Statistics ─────────────────────────────────
  async getOverview(userId: number) {
    const allSessions = await this.sessionRepo.find({
      where: { user: { id: userId }, status: 'finished' as const },
      relations: [
        'exercises',
        'exercises.exercise',
        'exercises.exercise.muscleGroups',
      ],
    });

    const totalWorkouts = allSessions.length;
    let totalVolume = 0;
    let totalDuration = 0;
    const now = new Date();
    const startOfWeek = this.getStartOfWeek(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let workoutsThisWeek = 0;
    let workoutsThisMonth = 0;

    const exerciseCount = new Map<number, { name: string; count: number }>();
    const muscleGroupCount = new Map<number, { name: string; count: number }>();

    for (const s of allSessions) {
      totalVolume += s.totalWeight ?? 0;
      const dur =
        s.endedAt && s.startedAt
          ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
          : 0;
      totalDuration += dur;

      const endDate = s.endedAt ?? s.startedAt;
      if (endDate >= startOfWeek) workoutsThisWeek++;
      if (endDate >= startOfMonth) workoutsThisMonth++;

      for (const ex of s.exercises ?? []) {
        if (ex.exercise) {
          const curr = exerciseCount.get(ex.exercise.id) ?? {
            name: ex.exercise.name,
            count: 0,
          };
          curr.count++;
          exerciseCount.set(ex.exercise.id, curr);

          for (const mg of ex.exercise.muscleGroups ?? []) {
            const currMg = muscleGroupCount.get(mg.id) ?? {
              name: mg.name,
              count: 0,
            };
            currMg.count++;
            muscleGroupCount.set(mg.id, currMg);
          }
        }
      }
    }

    const recentPRs = await this.recordRepo.find({
      where: { user: { id: userId } },
      relations: ['exercise'],
      order: { achievedAt: 'DESC' },
      take: 10,
    });

    return {
      totalWorkouts,
      totalVolume,
      totalDuration: Math.round(totalDuration / 60000),
      workoutsThisWeek,
      workoutsThisMonth,
      averageSessionDuration:
        totalWorkouts > 0
          ? Math.round(totalDuration / totalWorkouts / 60000)
          : 0,
      mostTrainedExercises: [...exerciseCount.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      mostTrainedMuscleGroups: [...muscleGroupCount.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      recentPRs: recentPRs.map((r) => ({
        exerciseId: r.exercise?.id,
        exerciseName: r.exercise?.name,
        recordType: r.recordType,
        value: Number(r.value),
        date: r.achievedAt,
        setDetails: r.setDetails,
      })),
    };
  }

  // ─── PR Computation & Upsert ─────────────────────────────
  async computeAndUpsertRecords(
    userId: number,
    sessionId: number,
    completedExercises: {
      exerciseId: number;
      sets: { weight: number; reps: number; rpe?: number }[];
    }[],
  ): Promise<
    {
      exerciseId: number;
      recordType: RecordType;
      value: number;
      isNew: boolean;
    }[]
  > {
    const newRecords: {
      exerciseId: number;
      recordType: RecordType;
      value: number;
      isNew: boolean;
    }[] = [];
    const now = new Date();

    for (const ce of completedExercises) {
      const { exerciseId, sets } = ce;
      if (!sets || sets.length === 0) continue;

      // Compute all metrics for this exercise in this session
      const maxWeight = this.computeMaxWeight(sets as any);
      const maxReps = this.computeMaxReps(sets as any);
      const maxVolumeSet = this.computeMaxVolumeSet(sets as any);
      const totalVolume = this.computeTotalVolume(sets as any);
      const estimated1RM = this.computeBestEstimated1RM(sets as any);

      // Find the set that achieved each record for setDetails
      const maxWeightSet = sets.reduce((best, s) =>
        (s.weight ?? 0) > (best.weight ?? 0) ? s : best,
      );
      const maxRepsSet = sets.reduce((best, s) =>
        (s.reps ?? 0) > (best.reps ?? 0) ? s : best,
      );
      const maxVolumeSetData = sets.reduce((best, s) =>
        (s.weight ?? 0) * (s.reps ?? 0) > (best.weight ?? 0) * (best.reps ?? 0)
          ? s
          : best,
      );
      const best1RMSet = sets.reduce((best, s) => {
        const e1rm = this.epley(s.weight ?? 0, s.reps ?? 0);
        const bestE1rm = this.epley(best.weight ?? 0, best.reps ?? 0);
        return e1rm > bestE1rm ? s : best;
      });

      const candidates: {
        recordType: RecordType;
        value: number;
        setDetails: { weight: number; reps: number; rpe?: number } | null;
      }[] = [
        {
          recordType: RecordType.MAX_WEIGHT,
          value: maxWeight,
          setDetails: {
            weight: maxWeightSet.weight,
            reps: maxWeightSet.reps,
            rpe: maxWeightSet.rpe,
          },
        },
        {
          recordType: RecordType.MAX_REPS,
          value: maxReps,
          setDetails: {
            weight: maxRepsSet.weight,
            reps: maxRepsSet.reps,
            rpe: maxRepsSet.rpe,
          },
        },
        {
          recordType: RecordType.MAX_VOLUME_SET,
          value: maxVolumeSet,
          setDetails: {
            weight: maxVolumeSetData.weight,
            reps: maxVolumeSetData.reps,
            rpe: maxVolumeSetData.rpe,
          },
        },
        {
          recordType: RecordType.MAX_VOLUME_SESSION,
          value: totalVolume,
          setDetails: null,
        },
        {
          recordType: RecordType.ESTIMATED_1RM,
          value: estimated1RM,
          setDetails: {
            weight: best1RMSet.weight,
            reps: best1RMSet.reps,
            rpe: best1RMSet.rpe,
          },
        },
      ];

      for (const candidate of candidates) {
        if (candidate.value <= 0) continue;

        const existing = await this.recordRepo.findOne({
          where: {
            user: { id: userId },
            exercise: { id: exerciseId },
            recordType: candidate.recordType,
          },
        });

        if (!existing) {
          await this.recordRepo.save(
            this.recordRepo.create({
              user: { id: userId } as any,
              exercise: { id: exerciseId } as any,
              workoutSession: { id: sessionId } as any,
              recordType: candidate.recordType,
              value: candidate.value,
              achievedAt: now,
              setDetails: candidate.setDetails,
            }),
          );
          newRecords.push({
            exerciseId,
            recordType: candidate.recordType,
            value: candidate.value,
            isNew: true,
          });
        } else if (candidate.value > Number(existing.value)) {
          existing.value = candidate.value;
          existing.workoutSession = { id: sessionId } as any;
          existing.achievedAt = now;
          existing.setDetails = candidate.setDetails;
          await this.recordRepo.save(existing);
          newRecords.push({
            exerciseId,
            recordType: candidate.recordType,
            value: candidate.value,
            isNew: true,
          });
        }
      }
    }

    return newRecords;
  }

  // ─── Compact history for exercise dialog ─────────────────
  async getExerciseQuickStats(userId: number, exerciseId: number) {
    const records = await this.getExerciseRecords(userId, exerciseId);

    // Last 3 sessions
    const recent = await this.getExerciseHistory(userId, exerciseId, 1, 3);

    return {
      records,
      recentHistory: recent.entries,
      totalSessions: recent.total,
    };
  }

  // ─── Compact history for workout details ─────────────────
  async getWorkoutQuickStats(userId: number, workoutId: number) {
    const allSessions = await this.sessionRepo.find({
      where: {
        workout: { id: workoutId },
        user: { id: userId },
        status: 'finished' as const,
      },
      select: ['id', 'startedAt', 'endedAt', 'totalWeight'],
      order: { endedAt: 'DESC' },
    });

    const timesCompleted = allSessions.length;
    let totalDuration = 0;
    let lastPerformed: Date | null = null;

    for (const s of allSessions) {
      const dur =
        s.endedAt && s.startedAt
          ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
          : 0;
      totalDuration += dur;
      const endDate = s.endedAt ?? s.startedAt;
      if (!lastPerformed || endDate > lastPerformed) lastPerformed = endDate;
    }

    const recentSessions = allSessions.slice(0, 3).map((s) => {
      const durMs =
        s.endedAt && s.startedAt
          ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
          : 0;
      return {
        id: s.id,
        date: s.endedAt ?? s.startedAt,
        duration: Math.round(durMs / 60000),
        totalVolume: s.totalWeight,
      };
    });

    return {
      timesCompleted,
      averageDuration:
        timesCompleted > 0
          ? Math.round(totalDuration / timesCompleted / 60000)
          : 0,
      lastPerformed,
      recentSessions,
    };
  }

  // ─── Helper Functions ────────────────────────────────────

  private epley(weight: number, reps: number): number {
    if (reps <= 0 || weight <= 0) return 0;
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30) * 100) / 100;
  }

  private computeMaxWeight(sets: { weight?: number; reps?: number }[]): number {
    return sets.reduce((max, s) => Math.max(max, s.weight ?? 0), 0);
  }

  private computeMaxReps(sets: { weight?: number; reps?: number }[]): number {
    return sets.reduce((max, s) => Math.max(max, s.reps ?? 0), 0);
  }

  private computeMaxVolumeSet(
    sets: { weight?: number; reps?: number }[],
  ): number {
    return sets.reduce(
      (max, s) => Math.max(max, (s.weight ?? 0) * (s.reps ?? 0)),
      0,
    );
  }

  private computeTotalVolume(
    sets: { weight?: number; reps?: number }[],
  ): number {
    return sets.reduce((sum, s) => sum + (s.weight ?? 0) * (s.reps ?? 0), 0);
  }

  private computeBestEstimated1RM(
    sets: { weight?: number; reps?: number }[],
  ): number {
    return sets.reduce(
      (max, s) => Math.max(max, this.epley(s.weight ?? 0, s.reps ?? 0)),
      0,
    );
  }

  private getPeriodDate(period: string): Date | null {
    const now = new Date();
    switch (period) {
      case '1m':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case '3m':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case '6m':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case '1y':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      default:
        return null;
    }
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
