/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
}

export interface MuscleGroup {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
