import { defineStore } from 'pinia';
import * as workoutSessionService from '@/services/workoutSession.service';
import { useAuthStore } from './auth.store';
import type { tempWorkoutSession } from '@/interfaces/workoutSession.interface';

type LiveSet = {
  set: number;
  weight: number;
  reps: number;
  done: boolean;
  previous?: string;
};

type LiveExercise = {
  exerciseId: number;
  sets: LiveSet[];
  rpe?: number;
  notes?: string;
};

type LiveSessionState = {
  sessionId: number;
  exercises: Record<number, LiveExercise>;
};

export const useWorkoutSessionStore = defineStore(
  'workoutSessionStore',
  () => {
    const workoutSessions = ref<object[]>([]);
    const selectedWorkoutSession = ref<object | null>(null);
    const isLoading = ref<boolean>(false);
    const lastFetched = ref<number | null>(null);
    const cacheDuration = 10 * 1000;
    const authStore = useAuthStore();

    const secondsElapsed = ref(0);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const isRunning = ref(false);

    const formattedClock = computed(() => {
      const minutes = Math.floor(secondsElapsed.value / 60);
      const seconds = secondsElapsed.value % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    });

    const liveSessions = ref<Record<number, LiveSessionState>>({});

    async function setWorkoutSessions(reload = false) {
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
      } finally {
        isLoading.value = false;
      }
    }

    if (authStore.isAuthenticated) {
      setWorkoutSessions();
    }

    async function fetchSelectedWorkoutSession(sessionId: number) {
      if (!sessionId) {
        selectedWorkoutSession.value = null;
        return;
      }
      try {
        isLoading.value = true;
        selectedWorkoutSession.value =
          await workoutSessionService.getWorkoutSessionById(sessionId);
        if (!selectedWorkoutSession.value) {
          selectedWorkoutSession.value = null;
          return;
        }
      } finally {
        isLoading.value = false;
      }
    }

    function startClock() {
      if (intervalId) return;
      intervalId = setInterval(() => {
        secondsElapsed.value++;
      }, 1000);
      isRunning.value = true;
    }

    function stopClock() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      isRunning.value = false;
    }

    function resetClock() {
      stopClock();
      secondsElapsed.value = 0;
    }

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

    function getLiveSession(sessionId: number): LiveSessionState | undefined {
      return liveSessions.value[sessionId];
    }

    function initLiveSessionFromSnapshot(session: tempWorkoutSession) {
      const sessionId = session.id;
      if (typeof sessionId === 'undefined') return;
      if (liveSessions.value[sessionId]) return;

      const fromServer =
        Array.isArray(session.exercises) && session.exercises.length > 0;
      const exercises: Record<number, LiveExercise> = {};

      if (fromServer && session.exercises) {
        type ServerExercise = {
          exerciseId?: number;
          sets?: {
            setNumber?: number;
            weight?: number;
            reps?: number;
          }[];
          notes?: string;
        };
        for (const ex of session.exercises as ServerExercise[]) {
          const exId = ex.exerciseId;
          if (typeof exId === 'undefined') continue;
          type ServerSet = {
            setNumber?: number;
            weight?: number;
            reps?: number;
          };
          const sets: LiveSet[] = (ex.sets || []).map((s: ServerSet, i: number) => ({
            set: s.setNumber ?? i + 1,
            weight: s.weight ?? 0,
            reps: s.reps ?? 0,
            done: true,
            previous: 'N/A',
          }));
          exercises[exId] = {
            exerciseId: exId,
            sets,
            rpe: undefined,
            notes: ex.notes ?? '',
          };
        }
      } else {
        if (session.workoutSnapshot && Array.isArray(session.workoutSnapshot.exercises)) {
          for (const base of session.workoutSnapshot.exercises) {
            const sets: LiveSet[] = [];
            for (let i = 1; i <= (base.sets ?? 0); i++) {
              sets.push({
                set: i,
                weight: base.weight ?? 0,
                reps: base.reps ?? 0,
                done: false,
                previous: 'N/A',
              });
            }
            if (typeof base.exerciseId !== 'undefined') {
              exercises[base.exerciseId] = {
                exerciseId: base.exerciseId,
                sets,
                rpe: undefined,
                notes: '',
              };
            }
          }
        }
      }

      liveSessions.value[sessionId] = { sessionId, exercises };
    }

    function upsertExercise(sessionId: number, exerciseId: number) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      if (!ls.exercises[exerciseId]) {
        ls.exercises[exerciseId] = {
          exerciseId,
          sets: [],
          rpe: undefined,
          notes: '',
        };
      }
    }

    function removeExercise(sessionId: number, exerciseId: number) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      delete ls.exercises[exerciseId];
    }

    function updateSet(sessionId: number, exerciseId: number, set: LiveSet) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      const ex = ls.exercises[exerciseId];
      if (!ex) return;
      const idx = ex.sets.findIndex((s) => s.set === set.set);
      if (idx !== -1) ex.sets[idx] = set;
    }

    function addSet(sessionId: number, exerciseId: number) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      upsertExercise(sessionId, exerciseId);
      const ex = ls.exercises[exerciseId];
      const last = ex.sets[ex.sets.length - 1];
      ex.sets.push({
        set: ex.sets.length + 1,
        weight: last?.weight ?? 0,
        reps: last?.reps ?? 0,
        done: false,
        previous: 'N/A',
      });
    }

    function deleteSet(
      sessionId: number,
      exerciseId: number,
      setNumber: number,
    ) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      const ex = ls.exercises[exerciseId];
      if (!ex) return;
      const idx = ex.sets.findIndex((s) => s.set === setNumber);
      if (idx !== -1) {
        ex.sets.splice(idx, 1);
        ex.sets.forEach((s, i) => (s.set = i + 1));
      }
    }

    function updateExerciseMeta(
      sessionId: number,
      exerciseId: number,
      meta: { rpe?: number; notes?: string },
    ) {
      const ls = liveSessions.value[sessionId];
      if (!ls) return;
      upsertExercise(sessionId, exerciseId);
      const ex = ls.exercises[exerciseId];
      ex.rpe = meta.rpe ?? ex.rpe;
      ex.notes = meta.notes ?? ex.notes;
    }

    function clearLiveSession(sessionId: number) {
      delete liveSessions.value[sessionId];
    }

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
      liveSessions,
      getLiveSession,
      initLiveSessionFromSnapshot,
      upsertExercise,
      removeExercise,
      updateSet,
      addSet,
      deleteSet,
      updateExerciseMeta,
      clearLiveSession,
    };
  },
  {
    persist: {
      key: 'workoutSessionStore',
      pick: [
        'secondsElapsed',
        'isRunning',
        'workoutSessions',
        'selectedWorkoutSession',
        'lastFetched',
        'liveSessions',
      ],
    },
  },
);