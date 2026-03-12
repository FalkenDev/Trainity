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

// services/workoutSession.service.ts
import { fetchWrapper } from '@/utils/fetchWrapper'
import type { FinishSessionPayload, WorkoutSession } from '@/interfaces/workoutSession.interface'
import type { LogPastWorkoutSessionDto } from '@/interfaces/ScheduledSession.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchAllWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  try {
    const data = await fetchWrapper<WorkoutSession[]>(`${apiUrl}/workoutSessions`)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching workout sessions:', error)
    throw new Error('Failed to fetch workout sessions')
  }
}

export const startWorkoutSession = async (
  workoutId: number,
  scheduledSessionId?: number
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(`${apiUrl}/workoutSessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workoutId, scheduledSessionId }),
    })
    return data
  } catch (error) {
    console.error('Error starting workout session:', error)
    throw new Error('Failed to start workout session')
  }
}

export const startEmptyWorkoutSession = async (
  scheduledSessionId?: number
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(`${apiUrl}/workoutSessions/empty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledSessionId }),
    })
    return data
  } catch (error) {
    console.error('Error starting empty workout session:', error)
    throw new Error('Failed to start empty workout session')
  }
}

export const logPastWorkoutSession = async (
  dto: LogPastWorkoutSessionDto
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(`${apiUrl}/workoutSessions/log-past`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return data
  } catch (error) {
    console.error('Error logging past workout session:', error)
    throw new Error('Failed to log past workout session')
  }
}

export const abandonWorkoutSession = async (sessionId: number): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}/abandon`,
      { method: 'POST' }
    )
    return data
  } catch (error) {
    console.error('Error abandoning workout session:', error)
    throw new Error('Failed to abandon workout session')
  }
}

export const getWorkoutSessionById = async (sessionId: number): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(`${apiUrl}/workoutSessions/${sessionId}`)
    return data
  } catch (error) {
    console.error('Error fetching workout session:', error)
    throw new Error('Failed to fetch workout session')
  }
}

export const updateWorkoutSession = async (
  sessionId: number,
  sessionData: Partial<WorkoutSession>
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(`${apiUrl}/workoutSessions/${sessionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    })
    return data
  } catch (error) {
    console.error('Error updating workout session:', error)
    throw new Error('Failed to update workout session')
  }
}

export const finishWorkoutSession = async (
  sessionId: number,
  payload: FinishSessionPayload
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    return data
  } catch (error) {
    console.error('Error finishing workout session:', error)
    throw new Error('Failed to finish workout session')
  }
}

export const deleteWorkoutSession = async (sessionId: number): Promise<{ message: string }> => {
  try {
    const data = await fetchWrapper<{ message: string }>(`${apiUrl}/workoutSessions/${sessionId}`, {
      method: 'DELETE',
    })
    return data
  } catch (error) {
    console.error('Error deleting workout session:', error)
    throw new Error('Failed to delete workout session')
  }
}
