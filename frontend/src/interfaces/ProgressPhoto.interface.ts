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
