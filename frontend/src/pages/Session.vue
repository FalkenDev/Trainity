<template>
  <div>
    <BackHeader
      :show-menu="true"
      title="Workout Session"
      :route-to="'/'"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item>
            <v-list-item-title>Add Notes</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isAddExerciseOpen = true">
            <v-list-item-title>Add Exercise</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div class="my-3 d-flex justify-space-between align-center bg-grey-darken-4 pa-5">
      <p class="text-h6">
        {{ clock }}
      </p>
      <v-btn
        color="primary"
        :loading="isLoading"
        @click="finnishSession"
      >
        Finnish
      </v-btn>
    </div>

    <div class="d-flex flex-column ga-5">
      <WorkoutExerciseCard
        v-for="exercise in processedExercises"
        :key="exercise.exerciseId"
        :exercise="exercise"
        :default-weight-and-reps="workoutSession?.workout?.defaultWeightAndReps"
        :workout-sets="liveSets(exercise.exerciseId)"
        :show-rpe="showRpe"
        :rpe="liveEx(exercise.exerciseId)?.rpe"
        :notes="liveEx(exercise.exerciseId)?.notes"
        @update:set="onUpdateSet(exercise.exerciseId, $event)"
        @delete:set="onDeleteSet(exercise.exerciseId, $event)"
        @delete:exercise="onDeleteExercise(exercise.exerciseId)"
        @add:set="onAddSet(exercise.exerciseId)"
        @update:rpe="showRpe && onUpdateMeta(exercise.exerciseId, { rpe: $event })"
        @update:notes="onUpdateMeta(exercise.exerciseId, { notes: $event })"
      />
    </div>

    <div class="d-flex flex-column justify-space-between my-5 mx-5 ga-5">
      <v-btn
        color="secondary"
        @click="isAddExerciseOpen = true"
      >
        Add Exercise
      </v-btn>
      <v-btn
        color="primary"
        :loading="isLoading"
        @click="finnishSession"
      >
        Finish Session
      </v-btn>
    </div>

    <v-dialog
      v-model="isAddExerciseOpen"
      fullscreen
    >
      <AddExerciseList
        v-if="isAddExerciseOpen"
        :initial-selected-ids="processedExercises.map((e) => e.exerciseId)"
        @close="isAddExerciseOpen = false"
        @save="updateWorkoutSessionExercises"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { toast } from 'vuetify-sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import type {
  FinishedExercisePayload,
  WorkoutSession,
} from '@/interfaces/workoutSession.interface';
import type { Exercise, WorkoutSet } from '@/interfaces/Workout.interface';

import { fetchExerciseById } from '@/services/exercise.service';
import {
  abandonWorkoutSession,
  finishWorkoutSession,
} from '@/services/workoutSession.service';

const isAddExerciseOpen = ref(false);
const workoutSessionStore = useWorkoutSessionStore();
const authStore = useAuthStore();
const processedExercises = ref<Exercise[]>([]);
const isLoading = ref(false);

const workoutSession = computed<WorkoutSession | null>(
  () => workoutSessionStore.selectedWorkoutSession as WorkoutSession | null,
);
const clock = computed(() => workoutSessionStore.formattedClock);
const sessionId = computed(() => workoutSession.value?.id || 0);

const showRpe = computed(() => authStore.user?.showRpe ?? true);

function liveEx(exerciseId: number) {
  return workoutSessionStore.getLiveSession(sessionId.value)?.exercises[exerciseId];
}

function liveSets(exerciseId: number): WorkoutSet[] {
  const ex = workoutSessionStore.getLiveSession(sessionId.value)?.exercises[exerciseId];
  return ex ? ex.sets.map(s => ({
    set: s.set,
    weight: s.weight,
    reps: s.reps,
    done: s.done,
    previous: s.previous ?? 'N/A',
  })) : [];
}

async function updateWorkoutSessionExercises(newExerciseIds: number[]) {
  if (!workoutSession.value) return;
  isLoading.value = true;
  try {
    const existingIds = processedExercises.value.map((e) => e.exerciseId);
    const toAdd = newExerciseIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !newExerciseIds.includes(id));

    for (const id of toRemove) {
      workoutSessionStore.removeExercise(sessionId.value, id);
      const idx = processedExercises.value.findIndex((e) => e.exerciseId === id);
      if (idx !== -1) processedExercises.value.splice(idx, 1);
    }

    if (toAdd.length) {
      const snapshotById = new Map<
        number,
        { sets: number; reps: number; weight: number; pauseSeconds?: number }
      >();
      for (const base of workoutSession.value.workoutSnapshot?.exercises || []) {
        snapshotById.set(base.exerciseId, {
          sets: base.sets ?? 0,
          reps: base.reps ?? 0,
          weight: base.weight ?? 0,
          pauseSeconds: base.pauseSeconds ?? 0,
        });
      }

      for (const id of toAdd) {
        const details = await fetchExerciseById(id);

        const snap = snapshotById.get(id);
        const plannedSets = (snap?.sets ?? 0) || details.defaultSets || 1;
        const plannedReps = (snap?.reps ?? 0) || details.defaultReps || 8;
        const plannedWeight = (snap?.weight ?? 0) || 0;
        const pauseSeconds =
          (snap?.pauseSeconds ?? undefined) ??
          details.defaultPauseSeconds ??
          60;

        workoutSessionStore.upsertExercise(sessionId.value, id);

        const live = workoutSessionStore.getLiveSession(sessionId.value);
        const exLive = live?.exercises[id];
        if (exLive && exLive.sets.length === 0) {
          for (let i = 1; i <= plannedSets; i++) {
            workoutSessionStore.addSet(sessionId.value, id);
            workoutSessionStore.updateSet(sessionId.value, id, {
              set: i,
              weight: plannedWeight,
              reps: plannedReps,
              done: false,
              previous: 'N/A',
            });
          }
        }

        processedExercises.value.push({
          exerciseId: id,
          id,
          order: 0,
          sets: plannedSets,
          reps: plannedReps,
          weight: plannedWeight,
          pauseSeconds,
          exercise: {
            id: details.id,
            name: details.name,
            description: details.description,
            img: details.image ?? '',
            muscleGroups: details.muscleGroups ?? [],
            defaultSets: details.defaultSets ?? 0,
            defaultReps: details.defaultReps ?? 0,
            defaultPauseSeconds: details.defaultPauseSeconds ?? 0,
            createdBy: details.createdBy ?? '',
            createdAt: details.createdAt ?? '',
            updatedAt: details.updatedAt ?? '',
          },
        } as Exercise);
      }
    }
  } finally {
    isLoading.value = false;
    isAddExerciseOpen.value = false;
  }
}

function onDeleteExercise(exerciseId: number) {
  workoutSessionStore.removeExercise(sessionId.value, exerciseId);
  const idx = processedExercises.value.findIndex((e) => e.exerciseId === exerciseId);
  if (idx !== -1) processedExercises.value.splice(idx, 1);
}

function onUpdateMeta(
  exerciseId: number,
  data: { rpe?: number; notes?: string },
) {
  workoutSessionStore.updateExerciseMeta(sessionId.value, exerciseId, data);
}

function onUpdateSet(exerciseId: number, updatedSet: WorkoutSet) {
  workoutSessionStore.updateSet(sessionId.value, exerciseId, {
    set: updatedSet.set,
    weight: updatedSet.weight,
    reps: updatedSet.reps,
    done: !!updatedSet.done,
    previous: updatedSet.previous,
  });
}

function onDeleteSet(exerciseId: number, setToDelete: WorkoutSet) {
  workoutSessionStore.deleteSet(sessionId.value, exerciseId, setToDelete.set);
}

function onAddSet(exerciseId: number) {
  workoutSessionStore.addSet(sessionId.value, exerciseId);
}

const finnishSession = async () => {
  if (isLoading.value) return;
  if (!workoutSession.value?.id) {
    toast.error('Active session not found.');
    return;
  }

  isLoading.value = true;

  const live = workoutSessionStore.getLiveSession(sessionId.value);
  const completedExercises: FinishedExercisePayload[] = [];

  if (live) {
    for (const ex of Object.values(live.exercises)) {
      const performed = (ex.sets || [])
        .filter((s) => s.done)
        .map((s) => ({ setNumber: s.set, weight: s.weight, reps: s.reps }));
      if (performed.length > 0) {
        completedExercises.push({
          exerciseId: ex.exerciseId,
          sets: performed,
          rpe: ex.rpe,
          notes: ex.notes,
        });
      }
    }
  }

  try {
    if (completedExercises.length === 0) {
      await abandonWorkoutSession(sessionId.value);
      toast.info('No exercises completed. Session abandoned.');
      workoutSessionStore.stopClock();
      workoutSessionStore.selectedWorkoutSession = null;
      workoutSessionStore.resetClock();
      workoutSessionStore.clearLiveSession(sessionId.value);
      router.push('/');
    } else {
      const finalPayload = { completedExercises, notes: '' };
      await finishWorkoutSession(sessionId.value, finalPayload);
      toast.success('Workout session finished successfully!');
      workoutSessionStore.stopClock();
      workoutSessionStore.selectedWorkoutSession = null;
      workoutSessionStore.resetClock();
      workoutSessionStore.clearLiveSession(sessionId.value);
      router.push('/');
    }
  } catch {
    toast.error('An error occurred while finishing the session.');
  } finally {
    isLoading.value = false;
  }
};

watchEffect(async () => {
  const s = workoutSession.value;
  if (!s) {
    processedExercises.value = [];
    return;
  }

  workoutSessionStore.initLiveSessionFromSnapshot(s);

  const live = workoutSessionStore.getLiveSession(s.id);
  const idsFromLive = live ? Object.keys(live.exercises).map(Number) : [];

  let exerciseIds: number[];
  if (idsFromLive.length) {
    exerciseIds = idsFromLive;
  } else {
    exerciseIds = (s.workoutSnapshot?.exercises || []).map((b) => b.exerciseId);
  }

  const detailsList = await Promise.all(
    exerciseIds.map(async (id) => {
      const d = await fetchExerciseById(id);
      return { id, d };
    }),
  );

  processedExercises.value = detailsList.map(({ id, d }) => {
    const baseSnap = s.workoutSnapshot?.exercises?.find((b) => b.exerciseId === id);
    const liveEx = live?.exercises[id];

    const plannedSets =
      liveEx?.sets?.length ||
      baseSnap?.sets ||
      d.defaultSets ||
      1;

    const plannedReps =
      (liveEx?.sets?.[0]?.reps ?? undefined) ||
      baseSnap?.reps ||
      d.defaultReps ||
      8;

    const plannedWeight =
      (liveEx?.sets?.[0]?.weight ?? undefined) ||
      baseSnap?.weight ||
      0;

    const pauseSeconds =
      baseSnap?.pauseSeconds ??
      d.defaultPauseSeconds ??
      60;

    return {
      exerciseId: id,
      id,
      order: 0,
      sets: plannedSets,
      reps: plannedReps,
      weight: plannedWeight,
      pauseSeconds,
      exercise: {
        id: d.id,
        name: d.name,
        description: d.description,
        img: d.image ?? '',
        muscleGroups: d.muscleGroups ?? [],
        defaultSets: d.defaultSets ?? 0,
        defaultReps: d.defaultReps ?? 0,
        defaultPauseSeconds: d.defaultPauseSeconds ?? 0,
        createdBy: d.createdBy ?? '',
        createdAt: d.createdAt ?? '',
        updatedAt: d.updatedAt ?? '',
      },
    } as Exercise;
  });
});

watchEffect(() => {
  const s = workoutSession.value;
  if (!s) return;

  const raw = (s as WorkoutSession).startedAt as string | undefined;
  if (raw) {
    const isoGuess =
      raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z';
    const ms = Date.parse(isoGuess);
    if (!Number.isNaN(ms)) {
      workoutSessionStore.startedAt = ms;
    }
  }
  if (workoutSessionStore.startedAt != null) {
    workoutSessionStore.startClock();
  }
});

onMounted(() => {
  if (!workoutSessionStore.isRunning && workoutSessionStore.startedAt == null) {
    workoutSessionStore.startClock();
  }
});
</script>