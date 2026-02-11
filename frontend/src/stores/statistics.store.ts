import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as statisticsService from '@/services/statistics.service'
import type {
  OverviewStatistics,
  ExerciseHistoryResponse,
  ExerciseRecords,
  ExerciseProgressPoint,
  ExerciseQuickStats,
  WorkoutHistoryResponse,
  WorkoutQuickStats,
  ProgressMetric,
  ProgressPeriod,
} from '@/interfaces/Statistics.interface'

export const useStatisticsStore = defineStore('statisticsStore', () => {
  const overview = ref<OverviewStatistics | null>(null)
  const isLoadingOverview = ref(false)

  const exerciseHistory = ref<ExerciseHistoryResponse | null>(null)
  const exerciseRecords = ref<ExerciseRecords | null>(null)
  const exerciseProgress = ref<ExerciseProgressPoint[]>([])
  const exerciseQuickStats = ref<ExerciseQuickStats | null>(null)
  const isLoadingExercise = ref(false)

  const workoutHistory = ref<WorkoutHistoryResponse | null>(null)
  const workoutQuickStats = ref<WorkoutQuickStats | null>(null)
  const isLoadingWorkout = ref(false)

  async function fetchOverview() {
    try {
      isLoadingOverview.value = true
      overview.value = await statisticsService.fetchOverviewStatistics()
    } catch (error) {
      console.error('Error fetching overview:', error)
    } finally {
      isLoadingOverview.value = false
    }
  }

  async function fetchExerciseHistory(exerciseId: number, page = 1, limit = 20) {
    try {
      isLoadingExercise.value = true
      exerciseHistory.value = await statisticsService.fetchExerciseHistory(exerciseId, page, limit)
    } catch (error) {
      console.error('Error fetching exercise history:', error)
    } finally {
      isLoadingExercise.value = false
    }
  }

  async function loadMoreExerciseHistory(exerciseId: number) {
    if (!exerciseHistory.value) return
    const nextPage = exerciseHistory.value.page + 1
    const totalPages = Math.ceil(exerciseHistory.value.total / exerciseHistory.value.limit)
    if (nextPage > totalPages) return

    try {
      isLoadingExercise.value = true
      const more = await statisticsService.fetchExerciseHistory(
        exerciseId,
        nextPage,
        exerciseHistory.value.limit
      )
      exerciseHistory.value = {
        ...more,
        entries: [...exerciseHistory.value.entries, ...more.entries],
      }
    } catch (error) {
      console.error('Error loading more exercise history:', error)
    } finally {
      isLoadingExercise.value = false
    }
  }

  async function fetchExerciseRecords(exerciseId: number) {
    try {
      exerciseRecords.value = await statisticsService.fetchExerciseRecords(exerciseId)
    } catch (error) {
      console.error('Error fetching exercise records:', error)
    }
  }

  async function fetchExerciseProgress(
    exerciseId: number,
    metric: ProgressMetric = 'estimated_1rm',
    period: ProgressPeriod = 'all'
  ) {
    try {
      isLoadingExercise.value = true
      exerciseProgress.value = await statisticsService.fetchExerciseProgress(
        exerciseId,
        metric,
        period
      )
    } catch (error) {
      console.error('Error fetching exercise progress:', error)
    } finally {
      isLoadingExercise.value = false
    }
  }

  async function fetchExerciseQuickStats(exerciseId: number) {
    try {
      exerciseQuickStats.value = await statisticsService.fetchExerciseQuickStats(exerciseId)
    } catch (error) {
      console.error('Error fetching exercise quick stats:', error)
    }
  }

  async function fetchWorkoutHistory(workoutId: number, page = 1, limit = 20) {
    try {
      isLoadingWorkout.value = true
      workoutHistory.value = await statisticsService.fetchWorkoutHistory(workoutId, page, limit)
    } catch (error) {
      console.error('Error fetching workout history:', error)
    } finally {
      isLoadingWorkout.value = false
    }
  }

  async function loadMoreWorkoutHistory(workoutId: number) {
    if (!workoutHistory.value) return
    const nextPage = workoutHistory.value.page + 1
    const totalPages = Math.ceil(workoutHistory.value.total / workoutHistory.value.limit)
    if (nextPage > totalPages) return

    try {
      isLoadingWorkout.value = true
      const more = await statisticsService.fetchWorkoutHistory(
        workoutId,
        nextPage,
        workoutHistory.value.limit
      )
      workoutHistory.value = {
        ...more,
        sessions: [...workoutHistory.value.sessions, ...more.sessions],
      }
    } catch (error) {
      console.error('Error loading more workout history:', error)
    } finally {
      isLoadingWorkout.value = false
    }
  }

  async function fetchWorkoutQuickStats(workoutId: number) {
    try {
      workoutQuickStats.value = await statisticsService.fetchWorkoutQuickStats(workoutId)
    } catch (error) {
      console.error('Error fetching workout quick stats:', error)
    }
  }

  function clearExerciseData() {
    exerciseHistory.value = null
    exerciseRecords.value = null
    exerciseProgress.value = []
    exerciseQuickStats.value = null
  }

  function clearWorkoutData() {
    workoutHistory.value = null
    workoutQuickStats.value = null
  }

  return {
    overview,
    isLoadingOverview,
    exerciseHistory,
    exerciseRecords,
    exerciseProgress,
    exerciseQuickStats,
    isLoadingExercise,
    workoutHistory,
    workoutQuickStats,
    isLoadingWorkout,
    fetchOverview,
    fetchExerciseHistory,
    loadMoreExerciseHistory,
    fetchExerciseRecords,
    fetchExerciseProgress,
    fetchExerciseQuickStats,
    fetchWorkoutHistory,
    loadMoreWorkoutHistory,
    fetchWorkoutQuickStats,
    clearExerciseData,
    clearWorkoutData,
  }
})
