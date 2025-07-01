export interface Workout {
  id: string;
  title: string;
  time: number;
  description?: string;
  exercises: Exercise[];
  defaultWeightAndReps: 'default' | 'latest' | 'exercise';
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  order: number;
  sets: number;
  reps: number;
  weight: number;
  pauseSeconds: number;
  exerciseId: string;
  exercise: {
    id: string;
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

export interface WorkoutSet {
  set: number;
  previous: string;
  weight: number;
  reps: number;
  done: boolean;
}

type FinishedSetPayload = {
  setNumber: number;
  weight: number;
  reps: number;
};

export interface WorkoutExercisePayload {
  exerciseId: string;
  sets: [FinishedSetPayload, ...FinishedSetPayload[]];
}

export interface CreateWorkout {
  title: string;
  time: number;
  description?: string;
  exercises: [
    {
      exerciseId: string;
      order: number;
      sets: number;
      reps: number;
      weight: number;
      pauseSeconds: number;
    },
  ];
}

export interface UpdateWorkout {
  title?: string;
  time?: number;
  description?: string;
  defaultWeightAndReps: 'default' | 'latest' | 'exercise';
}

export interface AddExerciseToWorkout {
  exerciseId: string;
  order: number;
  sets: number;
  reps: number;
  weight: number;
  pauseSeconds: number;
}
