export interface Exercise {
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
}

export interface CreateExercise {
  name: string;
  description: string;
  image?: string | null;
  muscleGroupIds: number[];
  defaultSets: number;
  defaultReps: number;
  defaultPauseSeconds: number;
}

export interface UpdateExercise {
  name: string;
  description: string;
  image?: string | null;
  muscleGroups: string[];
  defaultSets: number;
  defaultReps: number;
  defaultPauseSeconds: number;
}
