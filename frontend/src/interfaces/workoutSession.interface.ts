import type { Workout } from './Workout.interface';
export interface PerformedSet {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface FinishedExercisePayload {
  exerciseId: string;
  rpe?: number;
  notes?: string;
  sets: PerformedSet[];
}

export interface FinishSessionPayload {
  completedExercises: FinishedExercisePayload[];
  notes?: string;
}

export interface WorkoutSession {
  _id: string;
  userId: string;
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
    exerciseId: string;
    sets: PerformedSet[];
  }[];
  totalWeight: number;
  exerciseStats: {
    exerciseId: string;
    totalWeight: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
