import { fetchWrapper } from "@/utils/fetchWrapper";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";

export const fetchAllMuscleGroups = async () => {
  try {
    const response = await fetchWrapper(`${apiUrl}/muscleGroups`);
    if (!response.ok) {
      throw new Error("Failed to fetch muscle groups");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching muscle groups:", error);
    throw error;
  }
};

export const createMuscleGroup = async (muscleGroup: {
  name: string;
  description?: string;
}) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/muscleGroups`, {
      method: "POST",
      body: JSON.stringify(muscleGroup),
    });
    if (!response.ok) {
      throw new Error("Failed to create muscle group");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating muscle group:", error);
    throw error;
  }
};

export const getMuscleGroupById = async (id: number) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/muscleGroups/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch muscle group by ID");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching muscle group by ID:", error);
    throw error;
  }
};

export const updateMuscleGroup = async (
  id: number,
  muscleGroup: { name: string; description?: string }
) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/muscleGroups/${id}`, {
      method: "PUT",
      body: JSON.stringify(muscleGroup),
    });
    if (!response.ok) {
      throw new Error("Failed to update muscle group");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating muscle group:", error);
    throw error;
  }
};

export const deleteMuscleGroup = async (id: number) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/muscleGroups/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete muscle group");
    }
    return true; // Return true if deletion was successful
  } catch (error) {
    console.error("Error deleting muscle group:", error);
    throw error;
  }
};
