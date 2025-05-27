import { fetchWrapper } from "@/utils/fetchWrapper";

export const fetchAllMuscleGroups = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
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
