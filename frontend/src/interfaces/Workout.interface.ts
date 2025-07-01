export interface Workout {
  id: number;
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
  exerciseId: number;
  exercise: {
    id: number;
    name: string;
    description: string;
    img: string;
    muscleGroups: number[];
    defaultSets: number;
    defaultReps: number;
    defaultPauseSeconds: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
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
  exerciseId: number;
  sets: [FinishedSetPayload, ...FinishedSetPayload[]];
}

export interface CreateWorkout {
  title: string;
  time: number;
  description?: string;
  exercises: [
    {
      exerciseId: number;
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
  exerciseId: number;
  order: number;
  sets: number;
  reps: number;
  weight: number;
  pauseSeconds: number;
}
