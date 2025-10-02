import type { CreateUser } from '@/interfaces/User.interface';
import { fetchWrapper } from '@/utils/fetchWrapper';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const createUser = async (user: CreateUser) => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const getUser = async () => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/users/me`);
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

export const updateUser = async (userData: CreateUser) => {
  try {
    const data = await fetchWrapper<any>(`${apiUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

export const deleteUser = async () => {
  try {
    await fetchWrapper<void>(`${apiUrl}/users/me`, {
      method: 'DELETE',
    });
    return true; // deletion succeeded (204/200)
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};
