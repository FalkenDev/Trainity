import { fetchWrapper } from '@/utils/fetchWrapper'
import type {
  ExerciseHistoryResponse,
  ExerciseRecords,
  ExerciseProgressPoint,
  ExerciseQuickStats,
  WorkoutHistoryResponse,
  WorkoutQuickStats,
  OverviewStatistics,
  ProgressMetric,
  ProgressPeriod,
} from '@/interfaces/Statistics.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchOverviewStatistics = async (): Promise<OverviewStatistics> => {
  const data = await fetchWrapper<OverviewStatistics>(`${apiUrl}/statistics/overview`)
  return data
}

export const fetchExerciseHistory = async (
  exerciseId: number,
  page = 1,
  limit = 20
): Promise<ExerciseHistoryResponse> => {
  const data = await fetchWrapper<ExerciseHistoryResponse>(
    `${apiUrl}/statistics/exercises/${exerciseId}/history?page=${page}&limit=${limit}`
  )
  return data
}

export const fetchExerciseRecords = async (exerciseId: number): Promise<ExerciseRecords> => {
  const data = await fetchWrapper<ExerciseRecords>(
    `${apiUrl}/statistics/exercises/${exerciseId}/records`
  )
  return data
}

export const fetchExerciseProgress = async (
  exerciseId: number,
  metric: ProgressMetric = 'estimated_1rm',
  period: ProgressPeriod = 'all'
): Promise<ExerciseProgressPoint[]> => {
  const data = await fetchWrapper<ExerciseProgressPoint[]>(
    `${apiUrl}/statistics/exercises/${exerciseId}/progress?metric=${metric}&period=${period}`
  )
  return data
}

export const fetchExerciseQuickStats = async (exerciseId: number): Promise<ExerciseQuickStats> => {
  const data = await fetchWrapper<ExerciseQuickStats>(
    `${apiUrl}/statistics/exercises/${exerciseId}/quick`
  )
  return data
}

export const fetchWorkoutHistory = async (
  workoutId: number,
  page = 1,
  limit = 20
): Promise<WorkoutHistoryResponse> => {
  const data = await fetchWrapper<WorkoutHistoryResponse>(
    `${apiUrl}/statistics/workouts/${workoutId}/history?page=${page}&limit=${limit}`
  )
  return data
}

export const fetchWorkoutQuickStats = async (workoutId: number): Promise<WorkoutQuickStats> => {
  const data = await fetchWrapper<WorkoutQuickStats>(
    `${apiUrl}/statistics/workouts/${workoutId}/quick`
  )
  return data
}
