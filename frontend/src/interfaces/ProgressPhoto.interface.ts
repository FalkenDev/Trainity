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

export type PoseTag = 'front' | 'side' | 'back'

export interface ProgressPhoto {
  id: number
  photoUrl: string
  date: string
  poseTag: PoseTag | null
  notes: string | null
  createdAt: string
}

export interface CreateProgressPhotoDto {
  date?: string
  poseTag?: PoseTag | null
  notes?: string
}
