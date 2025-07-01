import { fetchWrapper } from "@/utils/fetchWrapper";
import type {
  WorkoutExercise,
  WorkoutSession,
} from "@/interfaces/workoutSession.interface";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";

export const fetchAllWorkoutSessions = async () => {
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

export const addFinnishedExerciseToSession = async (
  sessionId: string,
  workoutExercise: WorkoutExercise
) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}/exercises`,
      {
        method: "PATCH",
        body: JSON.stringify(workoutExercise),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add finished exercise to session");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding finished exercise to session:", error);
    throw error;
  }
};

export const getWorkoutSessionById = async (sessionId: string) => {
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

export const updateWorkoutSession = async (
  sessionId: string,
  sessionData: WorkoutSession
) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`,
      {
        method: "PUT",
        body: JSON.stringify(sessionData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update workout session");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating workout session:", error);
    throw error;
  }
};

export const finnishWorkoutSession = async (sessionId: string) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}/complete`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to finish workout session");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error finishing workout session:", error);
    throw error;
  }
};

export const deleteWorkoutSession = async (sessionId: string) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workoutsessions/${sessionId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete workout session");
    }
    return true; // Assuming deletion is successful if no error is thrown
  } catch (error) {
    console.error("Error deleting workout session:", error);
    throw error;
  }
};
