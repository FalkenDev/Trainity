/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import type { WorkoutSession } from '@/interfaces/workoutSession.interface'

export interface WorkoutInitialData {
  time: number
  exercises: WorkoutExerciseInitialData[]
}

export interface WorkoutExerciseInitialData {
  exerciseId: number
  sets: number
  reps: number
  weight: number
  setWeights: number[]
  pauseSeconds: number
  order: number
}

export function mapSessionToWorkoutInitialData(
  session: WorkoutSession,
  durationSeconds = 0
): WorkoutInitialData {
  const exercises: WorkoutExerciseInitialData[] = session.exercises.map((ex, index) => {
    const completedSets = ex.sets.filter(s => s.reps != null || s.weight != null)
    const lastSet = completedSets[completedSets.length - 1]
    return {
      exerciseId: ex.exercise?.id ?? ex.exerciseId,
      sets: completedSets.length || 1,
      reps: lastSet?.reps ?? 10,
      weight: lastSet?.weight ?? 0,
      setWeights: completedSets.map(s => s.weight ?? 0),
      pauseSeconds: 60,
      order: index + 1,
    }
  })

  return {
    time: Math.round(durationSeconds / 60),
    exercises,
  }
}
