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
