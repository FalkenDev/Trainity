import { fetchWrapper } from '@/utils/fetchWrapper';
import type { GlobalExercise } from '@/interfaces/GlobalExercise.interface';
import type { Exercise } from '@/interfaces/Exercise.interface';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllGlobalExercises = async () => {
  try {
    const data = await fetchWrapper<GlobalExercise[]>(`${apiUrl}/global-exercises`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching global exercises:', error);
    throw new Error('Failed to fetch global exercises');
  }
};

export const importGlobalExercises = async (globalExerciseIds: number[]) => {
  try {
    const data = await fetchWrapper<Exercise[]>(`${apiUrl}/global-exercises/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ globalExerciseIds }),
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error importing global exercises:', error);
    throw new Error('Failed to import global exercises');
  }
};
