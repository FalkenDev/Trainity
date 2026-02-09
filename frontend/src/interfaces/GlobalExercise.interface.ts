import type { MuscleGroup } from './Exercise.interface'

export interface GlobalExercise {
  id: number
  i18nKey: string
  defaultName: string
  defaultDescription?: string
  image?: string
  defaultSets?: number
  defaultReps?: number
  defaultPauseSeconds?: number
  muscleGroups: MuscleGroup[]
  createdAt: string
  updatedAt: string
}
