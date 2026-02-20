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
