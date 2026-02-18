export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'endurance'

export interface Workout {
  id: number
  title: string
  time: number
  description?: string
  type?: WorkoutType | null
  exercises: Exercise[]
  targetMuscleGroups?: MuscleGroup[]
  defaultWeightAndReps: 'default' | 'latest'
  createdAt: Date
  updatedAt: Date
}

export interface Exercise {
  id: number
  order: number
  sets: number
  reps: number
  weight: number
  pauseSeconds: number
  exerciseId: number
  exercise: {
    id: number
    name: string
    i18nKey?: string
    isNameCustom?: boolean
    description?: string | null
    img: string
    muscleGroups: MuscleGroup[]
    primaryMuscleGroup?: { id: number; name: string } | null
    createdBy: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
  }
}

export interface WorkoutSet {
  set: number
  previous: string
  weight: number
  reps: number
  done: boolean
}

type FinishedSetPayload = {
  setNumber: number
  weight: number
  reps: number
}

export interface WorkoutExercisePayload {
  exerciseId: number
  sets: [FinishedSetPayload, ...FinishedSetPayload[]]
}

export interface CreateWorkoutExercise {
  exerciseId: number
  order: number
  sets: number
  reps: number
  weight: number
  pauseSeconds: number
}

export interface CreateWorkout {
  title: string
  time: number
  description?: string
  type?: WorkoutType
  targetMuscleGroupIds?: number[]
}

export interface UpdateWorkout {
  title?: string
  time?: number
  description?: string
  type?: WorkoutType | null
  targetMuscleGroupIds?: number[]
  defaultWeightAndReps?: 'default' | 'latest'
}

export interface AddExerciseToWorkout {
  exerciseId: number
  order: number
  sets: number
  reps: number
  weight: number
  pauseSeconds: number
}

export interface UpdateWorkoutExercise {
  sets?: number
  reps?: number
  weight?: number
  pauseSeconds?: number
}

export interface MuscleGroup {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
