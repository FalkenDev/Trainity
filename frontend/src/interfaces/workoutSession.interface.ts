import type { Workout } from './Workout.interface'
import type { Exercise as UserExercise } from './Exercise.interface'

export interface PerformedSet {
  setNumber: number
  weight?: number
  reps?: number
  // Cardio fields
  distance?: number
  duration?: number
  calories?: number
}

export interface FinishedExercisePayload {
  exerciseId: number
  rpe?: number
  notes?: string
  sets: PerformedSet[]
}

export interface FinishSessionPayload {
  completedExercises: FinishedExercisePayload[]
  notes?: string
}

export interface WorkoutSession {
  id: number
  userId: number
  startedAt: string
  endedAt?: string
  status: 'in_progress' | 'finished' | 'abandoned'
  notes?: string
  workout?: Workout | null
  exercises: {
    exerciseId: number
    exercise?: UserExercise
    sets: PerformedSet[]
  }[]
  totalWeight: number
  exerciseStats: {
    exerciseId: number
    totalWeight: number
    id: number
  }[]
  scheduledSessionId?: number
  createdAt: string
  updatedAt: string
}

export interface tempWorkoutSession {
  id?: number
  userId?: number
  startedAt?: string
  endedAt?: string
  status?: 'in_progress' | 'finished' | 'abandoned'
  notes?: string
  workout?: Workout | null
  exercises?: {
    exerciseId?: number
    exercise?: UserExercise
    sets?: PerformedSet[]
  }[]
  totalWeight?: number
  exerciseStats?: {
    exerciseId?: number
    totalWeight?: number
    id?: number
  }[]
  createdAt?: string
  updatedAt?: string
}
