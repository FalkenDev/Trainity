import type {
  CreateWorkout,
  UpdateWorkout,
  UpdateWorkoutExercise,
} from "@/interfaces/Workout.interface";
import { fetchWrapper } from "@/utils/fetchWrapper";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";

export const fetchAllWorkouts = async () => {
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

export const getWorkoutById = async (id: number) => {
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

export const updateWorkout = async (id: number, workout: UpdateWorkout) => {
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

export const deleteWorkout = async (id: number) => {
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

export const addExercisesToWorkout = async (
  workoutId: number,
  exerciseIds: number[],
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercises`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseIds }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to add exercises to workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding exercises to workout:", error);
    throw error;
  }
};

export const removeExercisesFromWorkout = async (
  workoutId: number,
  exerciseIds: number[],
) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8393/v1";
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercises`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseIds }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove exercises from workout");
    }
    return true;
  } catch (error) {
    console.error("Error removing exercises from workout:", error);
    throw error;
  }
};

export const updateExerciseInWorkout = async (
  workoutId: number,
  exerciseId: number,
  exerciseData: UpdateWorkoutExercise,
) => {
  try {
    const response = await fetchWrapper(
      `${apiUrl}/workouts/${workoutId}/exercise/${exerciseId}`,
      {
        method: "PATCH",
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

export const dublicateWorkout = async (id: number) => {
  try {
    const response = await fetchWrapper(`${apiUrl}/workouts/${id}/duplicate`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to duplicate workout");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error duplicating workout:", error);
    throw error;
  }
};
