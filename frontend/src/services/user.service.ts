import type { CreateUser } from "@/interfaces/User.interface";
import { fetchWrapper } from "@/utils/fetchWrapper";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";

export const createUser = async (user: CreateUser) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/users`, {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await fetchWrapper(`${apiUrl}/users/me`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (userData: CreateUser) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/users/me`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await fetchWrapper(`${apiUrl}/users/me`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return true; // Assuming deletion is successful
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
