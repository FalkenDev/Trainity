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
