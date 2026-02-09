export interface Exercise {
  id: number
  name: string
  i18nKey?: string
  isNameCustom?: boolean
  description?: string | null
  image?: string | null
  muscleGroups: MuscleGroup[]
  defaultSets: number
  defaultReps: number
  defaultPauseSeconds: number
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface CreateExercise {
  name: string
  description: string
  image?: string | null
  muscleGroupIds: number[]
  defaultSets: number
  defaultReps: number
  defaultPauseSeconds: number
}

export interface UpdateExercise {
  id: number
  name: string
  description: string
  image?: string | null
  muscleGroups: number[]
  defaultSets: number
  defaultReps: number
  defaultPauseSeconds: number
}

export interface MuscleGroup {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
