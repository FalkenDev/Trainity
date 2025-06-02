import type { Workout } from "./Workout.interface";

export interface WorkoutSession {
  _id: string;
  userId: string;
  startedAt: string;
  status: string;
  exercises: any[];
  totalWeight: number;
  notes: string;
  exerciseStats: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  workout: Workout;
}
