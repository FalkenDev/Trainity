import type { Workout } from "./Workout.interface";

export interface WorkoutSession {
  _id: string;
  userId: string;
  startedAt: string;
  status: string;
  exercises: unknown[];
  totalWeight: number;
  notes: string;
  exerciseStats: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  workout: Workout;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: [
    {
      setNumber: number;
      weight: number;
      reps: number;
      rpe: number;
      notes?: string;
    }
  ];
}
