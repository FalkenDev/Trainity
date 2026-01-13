// stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Exercise } from '@/interfaces/Exercise.interface';
import * as exerciseService from '@/services/exercise.service';
import { useAuthStore } from './auth.store';

export const useExerciseStore = defineStore(
  'exerciseStore',
  () => {
    const authStore = useAuthStore();
    const exercises = ref<Exercise[]>([]);
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

    // Only fetch exercises when authenticated; otherwise avoid 401 loops on app boot.
    watch(
      () => authStore.isAuthenticated,
      (authed) => {
        if (authed) {
          void setExercises(true);
        }
      },
      { immediate: true },
    );

    const resetStore = async () => {
      exercises.value = [];
      isLoading.value = false;
      lastFetched.value = null;
      if (authStore.isAuthenticated) {
        await setExercises(true);
      }
    };

    return { exercises, isLoading, setExercises, resetStore };
  },
  {
    persist: true,
  }
);
