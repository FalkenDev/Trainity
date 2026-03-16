/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

export interface WeightLog {
  id: number
  date: string
  weight: number
  notes?: string
  createdAt: string
}

export interface WeightLogStats {
  currentWeight?: number
  startWeight?: number
  changeFromStart?: number
  lastLogWeight?: number
  changeFromLastLog?: number
  targetWeight?: number
  weightGoalType?: string
}

export interface CreateWeightLogDto {
  date: string
  weight: number
  notes?: string
}

export interface UpdateWeightLogDto {
  weight?: number
  notes?: string
}
