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
  order: number;
  sets: number;
  reps: number;
  weight: number;
  pauseSeconds: number;
  exercise: {
    _id: string;
    name: string;
    description: string;
    img: string;
    muscleGroups: string[];
    defaultSets: number;
    defaultReps: number;
    defaultPauseSeconds: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
