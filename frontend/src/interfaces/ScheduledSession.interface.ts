import type { Workout } from './Workout.interface'
import type { Activity } from './Activity.interface'

export type ScheduledSessionType = 'workout' | 'activity'

export interface ScheduledSession {
  id: number
  type: ScheduledSessionType
  workout: Workout | null
  activity: Activity | null
  scheduledDate: string | null
  dayOfWeek: number | null // 0=Mon, ..., 6=Sun
  isRecurring: boolean
  exceptionDates: string[]
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ScheduledSessionForDate {
  id: number
  type: ScheduledSessionType
  workout: Workout | null
  activity: Activity | null
  scheduledDate: string | null
  dayOfWeek: number | null
  isRecurring: boolean
  notes: string | null
  resolvedDate: string
  isCompleted: boolean
  linkedSessionId: number | null
}

export interface CreateScheduledSessionDto {
  type: ScheduledSessionType
  workoutId?: number
  activityId?: number
  scheduledDate?: string // YYYY-MM-DD
  dayOfWeek?: number // 0-6
  isRecurring: boolean
  notes?: string
}

export interface UpdateScheduledSessionDto {
  type?: ScheduledSessionType
  workoutId?: number
  activityId?: number
  scheduledDate?: string
  dayOfWeek?: number
  isRecurring?: boolean
  notes?: string
}

export interface DeleteScheduledSessionParams {
  deleteType: 'this' | 'all'
  occurrenceDate?: string // YYYY-MM-DD, required when deleteType is 'this'
}

export interface LogPastWorkoutSessionDto {
  workoutId?: number
  startedAt: string
  endedAt: string
  notes?: string
  scheduledSessionId?: number
  completedExercises?: {
    exerciseId: number
    sets: { setNumber: number; weight: number; reps: number }[]
  }[]
}
