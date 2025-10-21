import type { MuscleGroup } from '@/interfaces/Exercise.interface';
import { fetchWrapper } from '@/utils/fetchWrapper';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllMuscleGroups = async () => {
  try {
    const data = await fetchWrapper<MuscleGroup[]>(`${apiUrl}/muscleGroups`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching muscle groups:', error);
    throw new Error('Failed to fetch muscle groups');
  }
};

export const createMuscleGroup = async (muscleGroup: {
  name: string;
  description?: string;
}) => {
  try {
    const data = await fetchWrapper<MuscleGroup>(`${apiUrl}/muscleGroups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(muscleGroup),
    });
    return data;
  } catch (error) {
    console.error('Error creating muscle group:', error);
    throw new Error('Failed to create muscle group');
  }
};

export const getMuscleGroupById = async (id: number) => {
  try {
    const data = await fetchWrapper<MuscleGroup>(`${apiUrl}/muscleGroups/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching muscle group by ID:', error);
    throw new Error('Failed to fetch muscle group by ID');
  }
};

export const updateMuscleGroup = async (
  id: number,
  muscleGroup: { name: string; description?: string },
) => {
  try {
    const data = await fetchWrapper<MuscleGroup>(`${apiUrl}/muscleGroups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(muscleGroup),
    });
    return data;
  } catch (error) {
    console.error('Error updating muscle group:', error);
    throw new Error('Failed to update muscle group');
  }
};

export const deleteMuscleGroup = async (id: number) => {
  try {
    await fetchWrapper<void>(`${apiUrl}/muscleGroups/${id}`, {
      method: 'DELETE',
    });
    return true; // success
  } catch (error) {
    console.error('Error deleting muscle group:', error);
    throw new Error('Failed to delete muscle group');
  }
};
