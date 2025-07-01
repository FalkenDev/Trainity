import type { Workout } from './Workout.interface';
export interface PerformedSet {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface FinishedExercisePayload {
  exerciseId: number;
  rpe?: number;
  notes?: string;
  sets: PerformedSet[];
}

export interface FinishSessionPayload {
  completedExercises: FinishedExercisePayload[];
  notes?: string;
}

export interface WorkoutSession {
  id: number;
  userId: number;
  startedAt: string;
  endedAt?: string;
  status: 'in_progress' | 'finished' | 'abandoned';
  notes?: string;
  workout: Workout;
  exercises: {
    exerciseSnapshot: {
      name: string;
      description: string;
      muscleGroups: string[];
    };
    exerciseId: number;
    sets: PerformedSet[];
  }[];
  totalWeight: number;
  exerciseStats: {
    exerciseId: string;
    totalWeight: number;
    id: number;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
