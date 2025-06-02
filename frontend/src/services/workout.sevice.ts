import { fetchWrapper } from '@/utils/fetchWrapper';

export const fetchAllWorkouts = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts`);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};
