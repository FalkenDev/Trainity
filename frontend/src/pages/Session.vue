<template>
  <div>
    <BackHeader :show-menu="true" title="Workout Session">
      <template #menuAppend>
        <v-list>
          <v-list-item>
            <v-list-item-title>Test</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>
    <div
      class="my-3 d-flex justify-space-between align-center bg-grey-darken-4 pa-5"
    >
      <p class="text-h6">
        {{ clock }}
      </p>
      <v-btn color="primary" @click="finnishSession" :loading="isLoading">
        Finnish
      </v-btn>
    </div>
    <div class="d-flex flex-column ga-5">
      <WorkoutExerciseCard
        v-for="exercise in processedExercises"
        :key="exercise.exerciseId"
        :exercise="exercise"
        :default-weight-and-reps="workoutSession?.workout.defaultWeightAndReps"
        :workout-sets="allWorkoutSets[exercise.exerciseId] || []"
        :rpe="exerciseMetadata[exercise.exerciseId]?.rpe"
        :notes="exerciseMetadata[exercise.exerciseId]?.notes"
        @update:set="handleSetUpdate(exercise.exerciseId, $event)"
        @delete:set="handleSetDelete(exercise.exerciseId, $event)"
        @add:set="handleSetAdd(exercise.exerciseId)"
        @update:rpe="handleMetadataUpdate(exercise.exerciseId, { rpe: $event })"
        @update:notes="
          handleMetadataUpdate(exercise.exerciseId, { notes: $event })
        "
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import type {
  FinishedExercisePayload,
  WorkoutSession,
} from '@/interfaces/workoutSession.interface';
import { fetchExerciseById } from '@/services/exercise.service';
import { finishWorkoutSession } from '@/services/workoutSession.service';
import { toast } from 'vuetify-sonner';
import router from '@/router';
import type { Exercise, WorkoutSet } from '@/interfaces/Workout.interface';
import { ref, computed, watchEffect, onMounted } from 'vue';

const workoutSessionStore = useWorkoutSessionStore();
const processedExercises = ref<Exercise[]>([]);
const workoutSession = computed<WorkoutSession | null>(
  () => workoutSessionStore.selectedWorkoutSession,
);

const allWorkoutSets = ref<Record<string, WorkoutSet[]>>({});
const isLoading = ref(false);
const exerciseMetadata = ref<Record<string, { rpe?: number; notes?: string }>>(
  {},
);

const clock = computed(() => workoutSessionStore.formattedClock);

watchEffect(async () => {
  if (!workoutSession.value) {
    processedExercises.value = [];
    allWorkoutSets.value = {};
    exerciseMetadata.value = {};
    return;
  }

  const baseExercises = workoutSession.value.workout.exercises;
  const newAllSets: Record<string, WorkoutSet[]> = {};

  const exercisesWithDetails = await Promise.all(
    baseExercises.map(async (baseExercise) => {
      const exerciseDetails = await fetchExerciseById(baseExercise.exerciseId);
      const setsArray: WorkoutSet[] = [];
      for (let i = 1; i <= baseExercise.sets; i++) {
        setsArray.push({
          set: i,
          previous: 'N/A',
          weight: baseExercise.weight,
          reps: baseExercise.reps,
          done: false,
        });
      }
      newAllSets[baseExercise.exerciseId] = setsArray;
      return {
        ...baseExercise,
        exercise: exerciseDetails,
      };
    }),
  );

  const newMetadata: Record<string, { rpe?: number; notes?: string }> = {};
  for (const exercise of exercisesWithDetails) {
    newMetadata[exercise.exerciseId] = { rpe: undefined, notes: '' };
  }
  exerciseMetadata.value = newMetadata;

  processedExercises.value = exercisesWithDetails;
  allWorkoutSets.value = newAllSets;
});

onMounted(() => {
  if (workoutSessionStore.formattedClock === '00:00') {
    workoutSessionStore.startClock();
  }
});

function handleMetadataUpdate(
  exerciseId: string,
  data: { rpe?: number; notes?: string },
) {
  if (exerciseMetadata.value[exerciseId]) {
    exerciseMetadata.value[exerciseId] = {
      ...exerciseMetadata.value[exerciseId],
      ...data,
    };
  }
}

function handleSetUpdate(exerciseId: string, updatedSet: WorkoutSet) {
  const sets = allWorkoutSets.value[exerciseId];
  const setIndex = sets.findIndex((s) => s.set === updatedSet.set);
  if (setIndex !== -1) {
    sets[setIndex] = updatedSet;
  }
}

function handleSetDelete(exerciseId: string, setToDelete: WorkoutSet) {
  const sets = allWorkoutSets.value[exerciseId];
  const setIndex = sets.findIndex((s) => s.set === setToDelete.set);
  if (setIndex !== -1) {
    sets.splice(setIndex, 1);
    sets.forEach((s, i) => (s.set = i + 1));
  }
}

function handleSetAdd(exerciseId: string) {
  const sets = allWorkoutSets.value[exerciseId];
  const lastSet =
    sets.length > 0 ? sets[sets.length - 1] : { weight: 0, reps: 0 };
  sets.push({
    set: sets.length + 1,
    previous: 'N/A',
    weight: lastSet.weight,
    reps: lastSet.reps,
    done: false,
  });
}

const finnishSession = async () => {
  if (isLoading.value) return;
  if (!workoutSession.value?._id) {
    toast.error('Active session not found.');
    return;
  }

  isLoading.value = true;
  const sessionId = workoutSession.value._id;

  const completedExercises: FinishedExercisePayload[] = [];

  for (const exercise of processedExercises.value) {
    const setsForExercise = allWorkoutSets.value[exercise.exerciseId];
    const performedSets = setsForExercise
      .filter((set) => set.done)
      .map((set) => ({
        setNumber: set.set,
        weight: set.weight,
        reps: set.reps,
      }));

    if (performedSets.length > 0) {
      const metadata = exerciseMetadata.value[exercise.exerciseId];
      completedExercises.push({
        exerciseId: exercise.exerciseId,
        sets: performedSets,
        rpe: metadata?.rpe,
        notes: metadata?.notes,
      });
    }
  }

  if (completedExercises.length === 0) {
    toast.info('No sets were marked as done.');
    isLoading.value = false;
    return;
  }

  try {
    const finalPayload = { completedExercises, notes: '' };

    await finishWorkoutSession(sessionId, finalPayload);

    toast.success('Workout session finished successfully!');
    workoutSessionStore.stopClock();
    workoutSessionStore.selectedWorkoutSession = null;
    workoutSessionStore.resetClock();
    router.push('/');
  } catch (error) {
    console.error('Failed to finish workout session:', error);
    toast.error('An error occurred while finishing the session.');
  } finally {
    isLoading.value = false;
  }
};
</script>
