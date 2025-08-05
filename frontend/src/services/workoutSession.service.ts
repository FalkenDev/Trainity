import { fetchWrapper } from '@/utils/fetchWrapper';
import type {
  FinishSessionPayload,
  WorkoutSession,
} from '@/interfaces/workoutSession.interface';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";

export const fetchAllWorkoutSessions = async () => {
  try {
    const response = await fetchWrapper(`${apiUrl}/workoutSessions`);
    if (!response.ok) {
      throw new Error('Failed to fetch workout sessions');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    throw error;
  }
};

export const startWorkoutSession = async (workoutId: number) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/workoutsessions`, {
      method: 'POST',
      body: JSON.stringify({ workoutId: workoutId }),
    });
    if (!response.ok) {
      throw new Error('Failed to start workout session');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting workout session:', error);
    throw error;
  }
};

export const abandonWorkoutSession = async (sessionId: number) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}/abandon`,
      {
        method: 'POST',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to abandon workout session');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error abandoning workout session:', error);
    throw error;
  }
};

// export const addFinnishedExerciseToSession = async (
//   sessionId: string,
//   workoutExercise: WorkoutExercise
// ) => {
//   try {
//     const response = await fetchWrapper(
//       `${apiUrl}/workoutsessions/${sessionId}/abandon`,
//       {
//         method: 'POST',
//       },
//     );
//     if (!response.ok) {
//       throw new Error('Failed to abandon workout session');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error abandoning workout session:', error);
//     throw error;
//   }
// };

export const getWorkoutSessionById = async (sessionId: number) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch workout session');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workout session:', error);
    throw error;
  }
};

export const updateWorkoutSession = async (
  sessionId: number,
  sessionData: WorkoutSession,
) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(sessionData),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to update workout session');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating workout session:', error);
    throw error;
  }
};

export const finishWorkoutSession = async (
  sessionId: number,
  payload: FinishSessionPayload,
) => {
  const response = await fetchWrapper(
    `${apiUrl}/workoutSessions/${sessionId}/complete`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error('Failed to finish workout session');
  }
  return await response.json();
};

export const deleteWorkoutSession = async (sessionId: number) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete workout session');
    }
    return true; // Assuming deletion is successful if no error is thrown
  } catch (error) {
    console.error('Error deleting workout session:', error);
    throw error;
  }
};
