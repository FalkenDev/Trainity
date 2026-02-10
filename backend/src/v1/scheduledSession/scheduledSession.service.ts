import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ScheduledSession,
  ScheduledSessionType,
} from './scheduledSession.entity';
import { WorkoutSession } from '../workoutSession/workoutSession.entity';
import { ActivityLog } from '../activityLog/activityLog.entity';
import { Workout } from '../workout/workout.entity';
import { Activity } from '../activity/activity.entity';
import { CreateScheduledSessionDto } from './dto/createScheduledSession.dto';
import { UpdateScheduledSessionDto } from './dto/updateScheduledSession.dto';
import { DeleteType } from './dto/deleteScheduledSession.dto';

export interface ScheduledSessionForDate {
  id: number;
  type: ScheduledSessionType;
  workout: Workout | null;
  activity: Activity | null;
  scheduledDate: string | null;
  dayOfWeek: number | null;
  isRecurring: boolean;
  notes: string | null;
  resolvedDate: string; // the actual date this occurrence falls on
  isCompleted: boolean;
  linkedSessionId: number | null;
}

@Injectable()
export class ScheduledSessionService {
  constructor(
    @InjectRepository(ScheduledSession)
    private readonly scheduledRepo: Repository<ScheduledSession>,
    @InjectRepository(WorkoutSession)
    private readonly workoutSessionRepo: Repository<WorkoutSession>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async create(
    userId: number,
    dto: CreateScheduledSessionDto,
  ): Promise<ScheduledSession> {
    // Validate references
    if (dto.type === ScheduledSessionType.WORKOUT) {
      if (!dto.workoutId) {
        throw new BadRequestException('workoutId is required for workout type');
      }
      const workout = await this.workoutRepo.findOne({
        where: { id: dto.workoutId, createdBy: { id: userId } },
      });
      if (!workout) throw new NotFoundException('Workout not found');
    }

    if (dto.type === ScheduledSessionType.ACTIVITY) {
      if (!dto.activityId) {
        throw new BadRequestException(
          'activityId is required for activity type',
        );
      }
      const activity = await this.activityRepo.findOne({
        where: { id: dto.activityId, createdBy: { id: userId } },
      });
      if (!activity) throw new NotFoundException('Activity not found');
    }

    if (dto.isRecurring && dto.dayOfWeek === undefined) {
      throw new BadRequestException(
        'dayOfWeek is required for recurring schedules',
      );
    }
    if (!dto.isRecurring && !dto.scheduledDate) {
      throw new BadRequestException(
        'scheduledDate is required for one-time schedules',
      );
    }

    const scheduled = this.scheduledRepo.create({
      user: { id: userId } as any,
      type: dto.type,
      workout: dto.workoutId ? ({ id: dto.workoutId } as any) : null,
      activity: dto.activityId ? ({ id: dto.activityId } as any) : null,
      scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      dayOfWeek: dto.dayOfWeek ?? null,
      isRecurring: dto.isRecurring,
      notes: dto.notes || null,
    });

    return this.scheduledRepo.save(scheduled);
  }

  async findAllForUser(userId: number): Promise<ScheduledSession[]> {
    return this.scheduledRepo.find({
      where: { user: { id: userId } },
      relations: ['workout', 'activity'],
      order: { createdAt: 'DESC' },
    });
  }

  async findForDate(
    userId: number,
    dateStr: string,
  ): Promise<ScheduledSessionForDate[]> {
    const dayOfWeek = this.getDayOfWeek(dateStr);

    // Get all scheduled sessions for this user
    const allScheduled = await this.scheduledRepo.find({
      where: { user: { id: userId } },
      relations: ['workout', 'activity'],
    });

    // Filter: one-time matching this date OR recurring matching this dayOfWeek (not in exceptions)
    const matching = allScheduled.filter((s) => {
      if (s.isRecurring) {
        return s.dayOfWeek === dayOfWeek && !s.exceptionDates.includes(dateStr);
      } else {
        const sDate = this.toDateString(s.scheduledDate);
        return sDate === dateStr;
      }
    });

    // Check completion status for each
    return Promise.all(
      matching.map((s) => this.enrichWithCompletionStatus(s, dateStr, userId)),
    );
  }

  async findForDateRange(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<ScheduledSessionForDate[]> {
    const allScheduled = await this.scheduledRepo.find({
      where: { user: { id: userId } },
      relations: ['workout', 'activity'],
    });

    const results: ScheduledSessionForDate[] = [];
    const dates = this.getDateRange(startDate, endDate);

    for (const dateStr of dates) {
      const dayOfWeek = this.getDayOfWeek(dateStr);

      for (const s of allScheduled) {
        let matches = false;

        if (s.isRecurring) {
          matches =
            s.dayOfWeek === dayOfWeek && !s.exceptionDates.includes(dateStr);
        } else {
          const sDate = this.toDateString(s.scheduledDate);
          matches = sDate === dateStr;
        }

        if (matches) {
          const enriched = await this.enrichWithCompletionStatus(
            s,
            dateStr,
            userId,
          );
          results.push(enriched);
        }
      }
    }

    return results;
  }

  async findOne(userId: number, id: number): Promise<ScheduledSession> {
    const scheduled = await this.scheduledRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['workout', 'activity'],
    });
    if (!scheduled) throw new NotFoundException('Scheduled session not found');
    return scheduled;
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateScheduledSessionDto,
  ): Promise<ScheduledSession> {
    const scheduled = await this.findOne(userId, id);

    if (dto.type !== undefined) scheduled.type = dto.type;
    if (dto.workoutId !== undefined) {
      scheduled.workout = dto.workoutId ? ({ id: dto.workoutId } as any) : null;
    }
    if (dto.activityId !== undefined) {
      scheduled.activity = dto.activityId
        ? ({ id: dto.activityId } as any)
        : null;
    }
    if (dto.scheduledDate !== undefined) {
      scheduled.scheduledDate = dto.scheduledDate
        ? new Date(dto.scheduledDate)
        : null;
    }
    if (dto.dayOfWeek !== undefined) scheduled.dayOfWeek = dto.dayOfWeek;
    if (dto.isRecurring !== undefined) scheduled.isRecurring = dto.isRecurring;
    if (dto.notes !== undefined) scheduled.notes = dto.notes || null;

    return this.scheduledRepo.save(scheduled);
  }

  async deleteScheduledSession(
    userId: number,
    id: number,
    deleteType: DeleteType,
    occurrenceDate?: string,
  ): Promise<{ message: string }> {
    const scheduled = await this.findOne(userId, id);

    if (deleteType === DeleteType.THIS && scheduled.isRecurring) {
      if (!occurrenceDate) {
        throw new BadRequestException(
          'occurrenceDate is required when deleting a single occurrence',
        );
      }
      // Add the date to exception list
      if (!scheduled.exceptionDates.includes(occurrenceDate)) {
        scheduled.exceptionDates = [
          ...scheduled.exceptionDates,
          occurrenceDate,
        ];
      }
      await this.scheduledRepo.save(scheduled);
      return { message: 'Occurrence removed' };
    }

    // Delete all (or one-time)
    await this.scheduledRepo.remove(scheduled);
    return { message: 'Scheduled session deleted' };
  }

  // --- Private helpers ---

  private async enrichWithCompletionStatus(
    scheduled: ScheduledSession,
    dateStr: string,
    userId: number,
  ): Promise<ScheduledSessionForDate> {
    let isCompleted = false;
    let linkedSessionId: number | null = null;

    if (scheduled.type === ScheduledSessionType.WORKOUT) {
      // First: check by direct FK link
      const linked = await this.workoutSessionRepo.findOne({
        where: {
          scheduledSession: { id: scheduled.id },
          status: 'finished',
        },
      });
      if (linked) {
        const sessionDate = this.toDateString(
          linked.endedAt || linked.startedAt,
        );
        if (sessionDate === dateStr) {
          isCompleted = true;
          linkedSessionId = linked.id;
        }
      }

      // Fallback: check if the user finished the same workout on this date (without FK link)
      if (!isCompleted && scheduled.workout?.id) {
        const byWorkout = await this.workoutSessionRepo.findOne({
          where: {
            user: { id: userId },
            workout: { id: scheduled.workout.id },
            status: 'finished',
          },
        });
        if (byWorkout) {
          const sessionDate = this.toDateString(
            byWorkout.endedAt || byWorkout.startedAt,
          );
          if (sessionDate === dateStr) {
            isCompleted = true;
            linkedSessionId = byWorkout.id;
          }
        }
      }
    } else {
      // First: check by direct FK link
      // Use query builder with string date to avoid timezone issues with PostgreSQL date columns
      const linked = await this.activityLogRepo
        .createQueryBuilder('log')
        .where('log.scheduledSessionId = :scheduledId', {
          scheduledId: scheduled.id,
        })
        .andWhere('log.date = :date', { date: dateStr })
        .getOne();
      if (linked) {
        isCompleted = true;
        linkedSessionId = linked.id;
      }

      // Fallback: check if the user logged the same activity on this date (without FK link)
      if (!isCompleted && scheduled.activity?.id) {
        const byActivity = await this.activityLogRepo
          .createQueryBuilder('log')
          .where('log.userId = :userId', { userId })
          .andWhere('log.activityId = :activityId', {
            activityId: scheduled.activity.id,
          })
          .andWhere('log.date = :date', { date: dateStr })
          .getOne();
        if (byActivity) {
          isCompleted = true;
          linkedSessionId = byActivity.id;
        }
      }
    }

    return {
      id: scheduled.id,
      type: scheduled.type,
      workout: scheduled.workout,
      activity: scheduled.activity,
      scheduledDate: this.toDateString(scheduled.scheduledDate),
      dayOfWeek: scheduled.dayOfWeek,
      isRecurring: scheduled.isRecurring,
      notes: scheduled.notes,
      resolvedDate: dateStr,
      isCompleted,
      linkedSessionId,
    };
  }

  private getDayOfWeek(dateStr: string): number {
    const d = new Date(dateStr + 'T12:00:00');
    const jsDay = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    return jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Mon, ..., 6=Sun
  }

  private toDateString(date: Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private getDateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    const current = new Date(start + 'T12:00:00');
    const last = new Date(end + 'T12:00:00');

    while (current <= last) {
      dates.push(this.toDateString(current)!);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}
