// services/workoutSession.service.ts
import { fetchWrapper } from '@/utils/fetchWrapper';
import type {
  FinishSessionPayload,
  WorkoutSession,
} from '@/interfaces/workoutSession.interface';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  try {
    const data = await fetchWrapper<WorkoutSession[]>(
      `${apiUrl}/workoutSessions`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    throw new Error('Failed to fetch workout sessions');
  }
};

export const startWorkoutSession = async (
  workoutId: number,
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId }),
      },
    );
    return data;
  } catch (error) {
    console.error('Error starting workout session:', error);
    throw new Error('Failed to start workout session');
  }
};

export const abandonWorkoutSession = async (
  sessionId: number,
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}/abandon`,
      { method: 'POST' },
    );
    return data;
  } catch (error) {
    console.error('Error abandoning workout session:', error);
    throw new Error('Failed to abandon workout session');
  }
};

export const getWorkoutSessionById = async (
  sessionId: number,
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}`,
    );
    return data;
  } catch (error) {
    console.error('Error fetching workout session:', error);
    throw new Error('Failed to fetch workout session');
  }
};

export const updateWorkoutSession = async (
  sessionId: number,
  sessionData: WorkoutSession,
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      },
    );
    return data;
  } catch (error) {
    console.error('Error updating workout session:', error);
    throw new Error('Failed to update workout session');
  }
};

export const finishWorkoutSession = async (
  sessionId: number,
  payload: FinishSessionPayload,
): Promise<WorkoutSession> => {
  try {
    const data = await fetchWrapper<WorkoutSession>(
      `${apiUrl}/workoutSessions/${sessionId}/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    return data;
  } catch (error) {
    console.error('Error finishing workout session:', error);
    throw new Error('Failed to finish workout session');
  }
};

export const deleteWorkoutSession = async (
  sessionId: number,
): Promise<{ message: string }> => {
  try {
    const data = await fetchWrapper<{ message: string }>(
      `${apiUrl}/workoutSessions/${sessionId}`,
      { method: 'DELETE' },
    );
    return data;
  } catch (error) {
    console.error('Error deleting workout session:', error);
    throw new Error('Failed to delete workout session');
  }
};