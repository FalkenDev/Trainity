import type { CreateUser, User } from '@/interfaces/User.interface';
import { fetchWrapper } from '@/utils/fetchWrapper';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const createUser = async (user: CreateUser) => {
  try {
    const data = await fetchWrapper<User>(`${apiUrl}/users`, {
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

export const updateUser = async (userData: CreateUser) => {
  try {
    const data = await fetchWrapper<User>(`${apiUrl}/users`, {
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
    await fetchWrapper<void>(`${apiUrl}/users`, {
      method: 'DELETE',
    });
    return true; // deletion succeeded (204/200)
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

export const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const data = await fetchWrapper(`${apiUrl}/users/avatar`, {
      method: 'POST',
      body: formData,
    });
    return data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Failed to upload avatar');
  }
};

export const getCurrentUser = async () => {
  try {
    const data = await fetchWrapper<User>(`${apiUrl}/users`);
    return data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw new Error('Failed to fetch current user');
  }
};
