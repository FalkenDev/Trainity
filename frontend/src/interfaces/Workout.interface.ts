export interface Workout {
  _id: string;
  title: string;
  time: number;
  description?: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  exerciseId: string;
  order: number;
  pauseSeconds: number;
  sets: number;
  reps: number;
  weight: number;
}
