import { fetchWrapper } from "@/utils/fetchWrapper";

export const fetchAllWorkoutSessions = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workoutSessions`);
    if (!response.ok) {
      throw new Error("Failed to fetch workout sessions");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    throw error;
  }
};

export const startWorkoutSession = async (workoutId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workoutsessions`, {
      method: "POST",
      body: JSON.stringify({ workoutId: workoutId }),
    });
    if (!response.ok) {
      throw new Error("Failed to start workout session");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error starting workout session:", error);
    throw error;
  }
};

export const getWorkoutSessionById = async (sessionId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch workout session");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workout session:", error);
    throw error;
  }
};
