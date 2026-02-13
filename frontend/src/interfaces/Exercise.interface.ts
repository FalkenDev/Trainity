export type ExerciseType = 'compound' | 'isolation' | 'bodyweight'

export interface ExerciseMedia {
  id: number
  type: 'image' | 'video'
  url: string
  order: number
}

export interface Exercise {
  id: number
  name: string
  i18nKey?: string
  isNameCustom?: boolean
  description?: string | null
  image?: string | null
  exerciseType?: ExerciseType | null
  muscleGroups: MuscleGroup[]
  primaryMuscleGroup?: MuscleGroup | null
  equipment?: string[]
  instructions?: string[]
  proTips?: string[]
  mistakes?: string[]
  media?: ExerciseMedia[]
  defaultSets?: number
  defaultReps?: number
  defaultPauseSeconds?: number
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface CreateExercise {
  name: string
  description?: string
  image?: string | null
  exerciseType?: ExerciseType | null
  muscleGroupIds: number[]
  primaryMuscleGroupId?: number | null
  equipment?: string[]
  instructions?: string[]
  proTips?: string[]
  mistakes?: string[]
  defaultSets?: number
  defaultReps?: number
  defaultPauseSeconds?: number
}

export interface UpdateExercise {
  id: number
  name: string
  description?: string
  image?: string | null
  exerciseType?: ExerciseType | null
  muscleGroupIds: number[]
  primaryMuscleGroupId?: number | null
  equipment?: string[]
  instructions?: string[]
  proTips?: string[]
  mistakes?: string[]
  defaultSets?: number
  defaultReps?: number
  defaultPauseSeconds?: number
}

export interface MuscleGroup {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
