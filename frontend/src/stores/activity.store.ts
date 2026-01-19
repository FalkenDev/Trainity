import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Activity, ActivityLog } from '@/interfaces/Activity.interface';
import * as activityService from '@/services/activity.service';
import * as activityLogService from '@/services/activityLog.service';
import { useAuthStore } from './auth.store';

export const useActivityStore = defineStore(
  'activityStore',
  () => {
    const authStore = useAuthStore();
    const activities = ref<Activity[]>([]);
    const activityLogs = ref<ActivityLog[]>([]);
    const isLoadingActivities = ref<boolean>(false);
    const isLoadingLogs = ref<boolean>(false);
    const lastFetchedActivities = ref<number | null>(null);
    const lastFetchedLogs = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    const fetchActivities = async (reload = false) => {
      const now = Date.now();
      if (
        activities.value &&
        !reload &&
        lastFetchedActivities.value &&
        now - lastFetchedActivities.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoadingActivities.value = true;
        activities.value = await activityService.fetchAllActivities();
        lastFetchedActivities.value = now;
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        isLoadingActivities.value = false;
      }
    };

    const fetchActivityLogs = async (reload = false) => {
      const now = Date.now();
      if (
        activityLogs.value &&
        !reload &&
        lastFetchedLogs.value &&
        now - lastFetchedLogs.value < cacheDuration
      ) {
        return;
      }

      try {
        isLoadingLogs.value = true;
        activityLogs.value = await activityLogService.fetchAllActivityLogs();
        lastFetchedLogs.value = now;
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        isLoadingLogs.value = false;
      }
    };

    // Only fetch when authenticated
    watch(
      () => authStore.isAuthenticated,
      (authed) => {
        if (authed) {
          void fetchActivities(true);
          void fetchActivityLogs(true);
        }
      },
      { immediate: true },
    );

    const resetStore = async () => {
      activities.value = [];
      activityLogs.value = [];
      isLoadingActivities.value = false;
      isLoadingLogs.value = false;
      lastFetchedActivities.value = null;
      lastFetchedLogs.value = null;
      if (authStore.isAuthenticated) {
        await fetchActivities(true);
        await fetchActivityLogs(true);
      }
    };

    return {
      activities,
      activityLogs,
      isLoadingActivities,
      isLoadingLogs,
      fetchActivities,
      fetchActivityLogs,
      resetStore,
    };
  },
);
