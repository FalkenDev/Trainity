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

import { fetchWrapper } from '@/utils/fetchWrapper'
import type { ProgressPhoto, CreateProgressPhotoDto } from '@/interfaces/ProgressPhoto.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchAllProgressPhotos = async (): Promise<ProgressPhoto[]> => {
  const data = await fetchWrapper<ProgressPhoto[]>(`${apiUrl}/progress-photos`)
  return Array.isArray(data) ? data : []
}

export const uploadProgressPhoto = async (
  file: File,
  dto: CreateProgressPhotoDto
): Promise<ProgressPhoto> => {
  const form = new FormData()
  form.append('file', file)
  if (dto.date) form.append('date', dto.date)
  if (dto.poseTag) form.append('poseTag', dto.poseTag)
  if (dto.notes) form.append('notes', dto.notes)

  return fetchWrapper<ProgressPhoto>(`${apiUrl}/progress-photos`, {
    method: 'POST',
    body: form,
  })
}

export const deleteProgressPhoto = async (id: number): Promise<void> => {
  await fetchWrapper(`${apiUrl}/progress-photos/${id}`, { method: 'DELETE' })
}
