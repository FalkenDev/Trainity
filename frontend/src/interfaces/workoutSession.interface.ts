import type { Workout } from './Workout.interface';
export interface PerformedSet {
  setNumber: number;
  weight?: number;
  reps?: number;
  // Cardio fields
  distance?: number;
  duration?: number;
  calories?: number;
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
  workout?: Workout | null;
  exercises: {
    exerciseSnapshot: {
      name: string;
      description: string;
      muscleGroups: number[];
    };
    exerciseId: number;
    sets: PerformedSet[];
  }[];
  totalWeight: number;
  exerciseStats: {
    exerciseId: number;
    totalWeight: number;
    id: number;
  }[];
  createdAt: string;
  updatedAt: string;
  workoutSnapshot: {
    title: string;
    description: string;
    time: number;
    exercises: {
      exerciseId: number;
      order: number;
      sets: number;
      reps: number;
      weight: number;
      pauseSeconds?: number;
    }[];
  };
}

export interface tempWorkoutSession {
  id?: number;
  userId?: number;
  startedAt?: string;
  endedAt?: string;
  status?: 'in_progress' | 'finished' | 'abandoned';
  notes?: string;
  workout?: Workout | null;
  exercises?: {
    exerciseSnapshot?: {
      name?: string;
      description?: string;
      muscleGroups?: number[];
    };
    exerciseId?: number;
    sets?: PerformedSet[];
  }[];
  totalWeight?: number;
  exerciseStats?: {
    exerciseId?: number;
    totalWeight?: number;
    id?: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
  workoutSnapshot?: {
    title?: string;
    description?: string;
    time?: number;
    exercises?: {
      exerciseId?: number;
      order?: number;
      sets?: number;
      reps?: number;
      weight?: number;
      pauseSeconds?: number;
    }[];
  };
}
  
