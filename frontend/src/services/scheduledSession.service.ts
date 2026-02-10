import { fetchWrapper } from '@/utils/fetchWrapper'
import type {
  ScheduledSession,
  ScheduledSessionForDate,
  CreateScheduledSessionDto,
  UpdateScheduledSessionDto,
  DeleteScheduledSessionParams,
} from '@/interfaces/ScheduledSession.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchAllScheduledSessions = async (): Promise<ScheduledSession[]> => {
  try {
    const data = await fetchWrapper<ScheduledSession[]>(`${apiUrl}/scheduled-sessions`)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching scheduled sessions:', error)
    throw new Error('Failed to fetch scheduled sessions')
  }
}

export const fetchScheduledSessionsForDate = async (
  date: string
): Promise<ScheduledSessionForDate[]> => {
  try {
    const data = await fetchWrapper<ScheduledSessionForDate[]>(
      `${apiUrl}/scheduled-sessions/date/${date}`
    )
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching scheduled sessions for date:', error)
    throw new Error('Failed to fetch scheduled sessions for date')
  }
}

export const fetchScheduledSessionsForRange = async (
  start: string,
  end: string
): Promise<ScheduledSessionForDate[]> => {
  try {
    const data = await fetchWrapper<ScheduledSessionForDate[]>(
      `${apiUrl}/scheduled-sessions/range?start=${start}&end=${end}`
    )
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching scheduled sessions for range:', error)
    throw new Error('Failed to fetch scheduled sessions for range')
  }
}

export const createScheduledSession = async (
  dto: CreateScheduledSessionDto
): Promise<ScheduledSession> => {
  try {
    const data = await fetchWrapper<ScheduledSession>(`${apiUrl}/scheduled-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return data
  } catch (error) {
    console.error('Error creating scheduled session:', error)
    throw new Error('Failed to create scheduled session')
  }
}

export const updateScheduledSession = async (
  id: number,
  dto: UpdateScheduledSessionDto
): Promise<ScheduledSession> => {
  try {
    const data = await fetchWrapper<ScheduledSession>(`${apiUrl}/scheduled-sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return data
  } catch (error) {
    console.error('Error updating scheduled session:', error)
    throw new Error('Failed to update scheduled session')
  }
}

export const deleteScheduledSession = async (
  id: number,
  params: DeleteScheduledSessionParams
): Promise<{ message: string }> => {
  try {
    const data = await fetchWrapper<{ message: string }>(`${apiUrl}/scheduled-sessions/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return data
  } catch (error) {
    console.error('Error deleting scheduled session:', error)
    throw new Error('Failed to delete scheduled session')
  }
}
