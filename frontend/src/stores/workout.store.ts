// stores/authStore.ts
import { defineStore } from "pinia";
import * as workoutService from "@/services/workout.service";
import type { Workout } from "@/interfaces/Workout.interface";

export const useWorkoutStore = defineStore(
  "workoutStore",
  () => {
    const workouts = ref<Workout[]>([]);
    const currentWorkout = ref<Workout | null>(null);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    const setWorkouts = async (reload = false) => {
      const now = Date.now();
      if (
        workouts.value &&
        !reload &&
        lastFetched.value &&
        now - lastFetched.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoading.value = true;
        workouts.value = await workoutService.fetchAllWorkouts();
        if (currentWorkout.value) {
          const currentWorkoutId = currentWorkout.value.id;
          const foundWorkout = workouts.value.find(
            (w) => w.id === currentWorkoutId,
          );
          if (foundWorkout) {
            currentWorkout.value = foundWorkout;
          } else {
            currentWorkout.value = null; // Reset if not found
          }
        }
        lastFetched.value = now;
        console.log("Workouts fetched:", workouts.value);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        isLoading.value = false;
      }
    };

    setWorkouts();

    const setCurrentWorkout = (workoutId: number) => {
      const workout = workouts.value.find((w) => w.id === workoutId);
      if (workout) {
        currentWorkout.value = workout;
      } else {
        console.warn(`Workout with ID ${workoutId} not found.`);
      }
    };

    return {
      workouts,
      isLoading,
      currentWorkout,
      setCurrentWorkout,
      setWorkouts,
    };
  },
  {
    persist: true,
  },
);
