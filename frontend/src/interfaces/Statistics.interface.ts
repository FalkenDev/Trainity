export type RecordType =
  | 'max_weight'
  | 'max_volume_set'
  | 'max_volume_session'
  | 'max_reps'
  | 'estimated_1rm'

export interface ExerciseHistorySet {
  setNumber: number
  weight: number | null
  reps: number | null
  rpe: number | null
  distance?: number | null
  duration?: number | null
  calories?: number | null
}

export interface ExerciseHistoryEntry {
  date: string
  sessionId: number
  sets: ExerciseHistorySet[]
  totalVolume: number
  notes?: string | null
}

export interface ExerciseHistoryResponse {
  entries: ExerciseHistoryEntry[]
  total: number
  page: number
  limit: number
}

export interface RecordEntry {
  value: number
  date: string
  setDetails: { weight: number; reps: number; rpe?: number } | null
}

export interface ExerciseRecords {
  maxWeight: RecordEntry | null
  estimatedOneRepMax: RecordEntry | null
  maxVolumeSet: RecordEntry | null
  maxVolumeSession: RecordEntry | null
  maxReps: RecordEntry | null
}

export interface ExerciseProgressPoint {
  date: string
  value: number
}

export interface ExerciseQuickStats {
  records: ExerciseRecords
  recentHistory: ExerciseHistoryEntry[]
  totalSessions: number
}

export interface WorkoutHistorySession {
  id: number
  date: string
  duration: number
  totalVolume: number
  exerciseCount: number
  notes?: string | null
}

export interface WorkoutHistorySummary {
  timesCompleted: number
  averageDuration: number
  averageVolume: number
  lastPerformed: string | null
  firstPerformed: string | null
}

export interface WorkoutHistoryResponse {
  sessions: WorkoutHistorySession[]
  summary: WorkoutHistorySummary
  total: number
  page: number
  limit: number
}

export interface WorkoutQuickStats {
  timesCompleted: number
  averageDuration: number
  lastPerformed: string | null
  recentSessions: {
    id: number
    date: string
    duration: number
    totalVolume: number
  }[]
}

export interface OverviewStatistics {
  totalWorkouts: number
  totalVolume: number
  totalDuration: number
  workoutsThisWeek: number
  workoutsThisMonth: number
  averageSessionDuration: number
  currentStreak: number
  longestStreak: number
  mostTrainedExercises: { name: string; count: number }[]
  mostTrainedMuscleGroups: { name: string; count: number }[]
  muscleGroupVolume: { name: string; volume: number }[]
  recentPRs: PersonalRecord[]
}

export interface PersonalRecord {
  exerciseId: number
  exerciseName: string
  recordType: RecordType
  value: number
  date: string
  setDetails: { weight: number; reps: number; rpe?: number } | null
}

export interface NewRecordNotification {
  exerciseId: number
  recordType: RecordType
  value: number
  isNew: boolean
}

export type ProgressMetric = 'estimated_1rm' | 'max_weight' | 'total_volume' | 'max_reps'
export type ProgressPeriod = '1m' | '3m' | '6m' | '1y' | 'all'

export interface WeeklyTrend {
  weekStart: string
  totalVolume: number
  workoutCount: number
  totalDuration: number
}

export interface ComparisonPeriod {
  workouts: number
  volume: number
  duration: number
}

export interface ComparisonStats {
  weekly: {
    current: ComparisonPeriod
    previous: ComparisonPeriod
  }
  monthly: {
    current: ComparisonPeriod
    previous: ComparisonPeriod
  }
}

export interface HeatmapDay {
  date: string
  count: number
}
