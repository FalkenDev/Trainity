// services/workout.service.ts
import type {
  CreateWorkout,
  UpdateWorkout,
  UpdateWorkoutExercise,
  Workout,
} from '@/interfaces/Workout.interface';
import { fetchWrapper } from '@/utils/fetchWrapper';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllWorkouts = async () => {
  try {
    const data = await fetchWrapper<Workout[]>(`${apiUrl}/workouts`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw new Error('Failed to fetch workouts');
  }
};

export const createWorkout = async (workout: CreateWorkout) => {
  try {
    const data = await fetchWrapper<Workout>(`${apiUrl}/workouts`, {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw new Error('Failed to create workout');
  }
};

export const getWorkoutById = async (id: number) => {
  try {
    const data = await fetchWrapper<Workout>(`${apiUrl}/workouts/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    throw new Error('Failed to fetch workout by ID');
  }
};

export const updateWorkout = async (id: number, workout: UpdateWorkout) => {
  try {
    const data = await fetchWrapper<Workout>(`${apiUrl}/workouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(workout),
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw new Error('Failed to update workout');
  }
};

export const deleteWorkout = async (id: number) => {
  try {
    // If your API returns 204 No Content, fetchWrapper will still resolve (no body).
    await fetchWrapper<void>(`${apiUrl}/workouts/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw new Error('Failed to delete workout');
  }
};

export const addExercisesToWorkout = async (
  workoutId: number,
  exerciseIds: number[],
) => {
  try {
    const data = await fetchWrapper<Workout>(
      `${apiUrl}/workouts/${workoutId}/exercises`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseIds }),
      },
    );
    return data;
  } catch (error) {
    console.error('Error adding exercises to workout:', error);
    throw new Error('Failed to add exercises to workout');
  }
};

export const removeExercisesFromWorkout = async (
  workoutId: number,
  exerciseIds: number[],
) => {
  try {
    await fetchWrapper<void>(`${apiUrl}/workouts/${workoutId}/exercises`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseIds }),
    });
    return true;
  } catch (error: unknown) {
    console.error('Error removing exercises from workout:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to remove exercises from workout',
    );
  }
};

export const updateExerciseInWorkout = async (
  workoutId: number,
  exerciseId: number,
  exerciseData: UpdateWorkoutExercise,
) => {
  try {
    const data = await fetchWrapper<Workout>(
      `${apiUrl}/workouts/${workoutId}/exercise/${exerciseId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData),
      },
    );
    return data;
  } catch (error) {
    console.error('Error updating exercise in workout:', error);
    throw new Error('Failed to update exercise in workout');
  }
};

export const dublicateWorkout = async (id: number) => {
  try {
    const data = await fetchWrapper<Workout>(`${apiUrl}/workouts/${id}/duplicate`, {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('Error duplicating workout:', error);
    throw new Error('Failed to duplicate workout');
  }
};

export const reorderExercises = async (
  workoutId: number,
  exercises: Array<{ workoutExerciseId: number; order: number }>,
) => {
  try {
    const data = await fetchWrapper<Workout>(
      `${apiUrl}/workouts/${workoutId}/exercises/reorder`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises }),
      },
    );
    return data;
  } catch (error) {
    console.error('Error reordering exercises:', error);
    throw new Error('Failed to reorder exercises');
  }
};
