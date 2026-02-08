export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar?: string
  showRpe?: boolean
  weeklyWorkoutGoal?: number
  currentStreak?: number
  currentWeekWorkouts?: number
  unitScale?: string
  weight?: number
  height?: number
  dateOfBirth?: string
  gender?: string
  primaryGoal?: string
  targetWeight?: number
  goalTimeframe?: number
  onboardingCompleted?: boolean
  showWeightTracking?: boolean
  weightGoalType?: string
  startWeight?: number
  createdAt: string
  updatedAt: string
}

export interface StreakInfo {
  currentStreak: number
  weeklyWorkoutGoal: number
  currentWeekWorkouts: number
  progressPercentage: number
}

export interface CreateUser {
  email: string
  password: string
  firstName: string
  lastName: string
}
