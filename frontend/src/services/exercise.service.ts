import { fetchWrapper } from '@/utils/fetchWrapper';
import type { CreateExercise } from '@/interfaces/Exercise.interface';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllExercises = async () => {
  try {
    const data = await fetchWrapper<any[]>(`${apiUrl}/exercises`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw new Error('Failed to fetch exercises');
  }
};

export const fetchExerciseById = async (exerciseId: number) => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/exercises/${exerciseId}`);
    return data;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw new Error('Failed to fetch exercise');
  }
};

export const createExercise = async (exercise: CreateExercise) => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    });
    return data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw new Error('Failed to create exercise');
  }
};

export const updateExercise = async (
  exerciseId: number,
  exercise: CreateExercise,
) => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/exercises/${exerciseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    });
    return data;
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw new Error('Failed to update exercise');
  }
};

export const deleteExercise = async (exerciseId: number) => {
  try {
    await fetchWrapper<void>(`${apiUrl}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
    return true; // success
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw new Error('Failed to delete exercise');
  }
};

export const uploadExerciseImage = async (exerciseId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const data = await fetchWrapper<any>(`${apiUrl}/exercises/${exerciseId}/image`, {
      method: 'POST',
      body: formData,
    });
    return data;
  } catch (error) {
    console.error('Error uploading exercise image:', error);
    throw new Error('Failed to upload exercise image');
  }
};
