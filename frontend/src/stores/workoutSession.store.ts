// stores/authStore.ts
import { defineStore } from 'pinia';
import * as workoutSessionService from '@/services/workoutSession.service';

export const useWorkoutSessionStore = defineStore(
  'workoutSessionStore',
  () => {
    const workoutSessions = ref([]);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    const setWorkoutSessions = async (reload = false) => {
      const now = Date.now();
      if (
        workoutSessions.value &&
        !reload &&
        lastFetched.value &&
        now - lastFetched.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoading.value = true;
        workoutSessions.value =
          await workoutSessionService.fetchAllWorkoutSessions();
        lastFetched.value = now;
      } catch (error) {
        console.error('Error fetching workout sessions:', error);
      } finally {
        isLoading.value = false;
      }
    };

    setWorkoutSessions();

    return { workoutSessions, isLoading, setWorkoutSessions };
  },
  {
    persist: true,
  }
);
