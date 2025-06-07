import { fetchWrapper } from "@/utils/fetchWrapper";
import type { CreateExercise } from "@/interfaces/Exercise.interface";

export const fetchAllExercises = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises`);
    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const fetchExerciseById = async (exerciseId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises/${exerciseId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch exercise");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercise:", error);
    throw error;
  }
};

export const createExercise = async (exercise: CreateExercise) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises`, {
      method: "POST",
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error("Failed to create exercise");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }
};

export const updateExercise = async (
  exerciseId: string,
  exercise: CreateExercise
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises/${exerciseId}`, {
      method: "PUT",
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error("Failed to update exercise");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }
};

export const deleteExercise = async (exerciseId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/exercises/${exerciseId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete exercise");
    }
    return true; // Return true on successful deletion
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }
};
