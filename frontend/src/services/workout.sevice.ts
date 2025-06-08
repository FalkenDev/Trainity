import type {
  AddExerciseToWorkout,
  CreateWorkout,
  UpdateWorkout,
} from "@/interfaces/Workout.interface";
import { fetchWrapper } from "@/utils/fetchWrapper";

export const fetchAllWorkouts = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts`);
    if (!response.ok) {
      throw new Error("Failed to fetch workouts");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};

export const createWorkout = async (workout: CreateWorkout) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
    });
    if (!response.ok) {
      throw new Error("Failed to create workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating workout:", error);
    throw error;
  }
};

export const getWorkoutById = async (id: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch workout by ID");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    throw error;
  }
};

export const updateWorkout = async (id: string, workout: UpdateWorkout) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(workout),
    });
    if (!response.ok) {
      throw new Error("Failed to update workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error;
  }
};

export const deleteWorkout = async (id: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete workout");
    }
    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error;
  }
};

export const addExerciseToWorkout = async (
  workoutId: string,
  exerciseId: string,
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercise`,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to add exercise to workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding exercise to workout:", error);
    throw error;
  }
};

export const removeExerciseFromWorkout = async (
  workoutId: string,
  exerciseId: string,
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercise/${exerciseId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to remove exercise from workout");
    }
    return true;
  } catch (error) {
    console.error("Error removing exercise from workout:", error);
    throw error;
  }
};

export const updateExerciseInWorkout = async (
  workoutId: string,
  exerciseId: string,
  exerciseData: AddExerciseToWorkout,
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    console.log("Updating exercise in workout:", exerciseData);
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercise/${exerciseId}`,
      {
        method: "PUT",
        body: JSON.stringify(exerciseData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update exercise in workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating exercise in workout:", error);
    throw error;
  }
};
