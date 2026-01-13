// stores/authStore.ts
import { defineStore } from 'pinia';
import * as muscleGroupsService from '@/services/muscleGroup.service';
import type { MuscleGroup } from '@/interfaces/MuscleGroup.interface';
import { useAuthStore } from './auth.store';

export const useMuscleGroupStore = defineStore(
  'muscleGroupStore',
  () => {
    const authStore = useAuthStore();
    const muscleGroups = ref<MuscleGroup[]>([]);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    const setMuscleGroups = async (reload = false) => {
      const now = Date.now();
      if (
        muscleGroups.value &&
        !reload &&
        lastFetched.value &&
        now - lastFetched.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoading.value = true;
        muscleGroups.value = await muscleGroupsService.fetchAllMuscleGroups();
        lastFetched.value = now;
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Only fetch muscle groups when authenticated; otherwise avoid 401 loops on app boot.
    watch(
      () => authStore.isAuthenticated,
      (authed) => {
        if (authed) {
          void setMuscleGroups(true);
        }
      },
      { immediate: true },
    );

    const resetStore =  async() => {
      muscleGroups.value = [];
      isLoading.value = false;
      lastFetched.value = null;
      if (authStore.isAuthenticated) {
        await setMuscleGroups(true);
      }
    };

    return { muscleGroups, isLoading, setMuscleGroups, resetStore };
  },
  {
    persist: true,
  }
);
