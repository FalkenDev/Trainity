export interface Exercise {
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
  muscleGroups: number[];
  defaultSets: number;
  defaultReps: number;
  defaultPauseSeconds: number;
}
