import { fetchWrapper } from '@/utils/fetchWrapper';

export const fetchAllExercises = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises`);
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
