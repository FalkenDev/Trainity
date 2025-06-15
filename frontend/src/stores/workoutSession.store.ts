// stores/authStore.ts
import { defineStore } from "pinia";
import * as workoutSessionService from "@/services/workoutSession.service";

export const useWorkoutSessionStore = defineStore(
  "workoutSessionStore",
  () => {
    const workoutSessions = ref([]);
    const selectedWorkoutSession = ref(null);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;

    // TODO: Maybe needed or will the selectedWorkoutSession only be in need ?
    // const hasActiveSession = ref(false);

    // TODO: We need to set the clock to the last time the user was working out if the user refreshes the page / finding the active workout session.
    // This is to keep track of the time elapsed during the workout session.
    const secondsElapsed = ref(0);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const isRunning = ref(false);

    const formattedClock = computed(() => {
      const minutes = Math.floor(secondsElapsed.value / 60);
      const seconds = secondsElapsed.value % 60;
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      return `${formattedMinutes}:${formattedSeconds}`;
    });

    // TODO: When initializing the store, we should check if there are a current workout session and if so, set it as the selectedWorkoutSession.
    // This is bcs if the user refreshes the page, we want to keep the current workout session in progress.
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
        console.error("Error fetching workout sessions:", error);
      } finally {
        isLoading.value = false;
      }
    };

    setWorkoutSessions();

    const fetchSelectedWorkoutSession = async (sessionId: string) => {
      if (!sessionId) {
        selectedWorkoutSession.value = null;
        return;
      }
      try {
        isLoading.value = true;
        selectedWorkoutSession.value =
          await workoutSessionService.getWorkoutSessionById(sessionId);
        if (!selectedWorkoutSession.value) {
          throw new Error("Workout session not found");
        }
      } catch (error) {
        console.error("Error fetching workout session by ID:", error);
        selectedWorkoutSession.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const startClock = () => {
      if (intervalId) return;

      intervalId = setInterval(() => {
        secondsElapsed.value++;
      }, 1000);
      isRunning.value = true;
    };

    const stopClock = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      isRunning.value = false;
    };

    const resetClock = () => {
      stopClock();
      secondsElapsed.value = 0;
    };

    watch(
      isRunning,
      (newValue) => {
        if (newValue && intervalId === null) {
          startClock();
        } else if (!newValue && intervalId !== null) {
          stopClock();
        }
      },
      { immediate: true },
    );

    return {
      workoutSessions,
      isLoading,
      fetchSelectedWorkoutSession,
      setWorkoutSessions,
      startClock,
      stopClock,
      resetClock,
      formattedClock,
      secondsElapsed,
      isRunning,
      selectedWorkoutSession,
    };
  },
  {
    persist: {
      key: "workoutSessionStore",
      pick: [
        "secondsElapsed",
        "isRunning",
        "workoutSessions",
        "selectedWorkoutSession",
        "lastFetched",
      ],
    },
  },
);
