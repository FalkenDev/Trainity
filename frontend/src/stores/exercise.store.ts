// stores/authStore.ts
import { defineStore } from 'pinia';
import * as exerciseService from '@/services/exercise.service';

export const useExerciseStore = defineStore(
  'exerciseStore',
  () => {
    const exercises = ref([]);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    const setExercises = async (reload = false) => {
      const now = Date.now();
      if (
        exercises.value &&
        !reload &&
        lastFetched.value &&
        now - lastFetched.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoading.value = true;
        exercises.value = await exerciseService.fetchAllExercises();
        lastFetched.value = now;
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        isLoading.value = false;
      }
    };

    setExercises();

    const resetStore = async () => {
      exercises.value = [];
      isLoading.value = false;
      lastFetched.value = null;
      await setExercises(true);
    };

    return { exercises, isLoading, setExercises, resetStore };
  },
  {
    persist: true,
  }
);
