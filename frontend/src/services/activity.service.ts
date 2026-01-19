import { fetchWrapper } from '@/utils/fetchWrapper';
import type { Activity, CreateActivityDto } from '@/interfaces/Activity.interface';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const fetchAllActivities = async () => {
  try {
    const data = await fetchWrapper<Activity[]>(`${apiUrl}/activity`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw new Error('Failed to fetch activities');
  }
};

export const fetchActivityById = async (activityId: number) => {
  try {
    const data = await fetchWrapper<Activity>(`${apiUrl}/activity/${activityId}`);
    return data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw new Error('Failed to fetch activity');
  }
};

export const createActivity = async (activity: CreateActivityDto) => {
  try {
    const data = await fetchWrapper<Activity>(`${apiUrl}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw new Error('Failed to create activity');
  }
};

export const updateActivity = async (
  activityId: number,
  activity: Partial<CreateActivityDto>,
) => {
  try {
    const data = await fetchWrapper<Activity>(`${apiUrl}/activity/${activityId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw new Error('Failed to update activity');
  }
};

export const deleteActivity = async (activityId: number) => {
  try {
    await fetchWrapper(`${apiUrl}/activity/${activityId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw new Error('Failed to delete activity');
  }
};
