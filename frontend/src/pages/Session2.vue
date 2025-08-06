<template>
  <div class="session-page">
    <!-- App header -->
    <BackHeader
      :show-menu="true"
      title="Workout Session"
    >
      <template #menuAppend>
        <v-list density="compact">
          <v-list-item @click="$emit('addNotes')">
            <v-list-item-title>Add Notes</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isAddExerciseOpen = true">
            <v-list-item-title>Add Exercise</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <!-- Sticky top bar with clock and primary action -->
    <div class="topbar">
      <div class="clock-wrap">
        <v-icon
          size="18"
          class="mr-1 text-secondary"
        >
          mdi-timer-outline
        </v-icon>
        <span class="clock-text">{{ clock }}</span>
      </div>

      <div class="actions">
        <v-btn
          color="secondary"
          variant="tonal"
          size="small"
          class="mr-2"
          @click="isAddExerciseOpen = true"
        >
          Add Exercise
        </v-btn>

        <v-btn
          color="primary"
          :loading="isLoading"
          size="small"
          prepend-icon="mdi-check"
          class="finish-btn"
          @click="finnishSession"
        >
          Finish
        </v-btn>
      </div>
    </div>

    <!-- Meta strip -->
    <div class="meta-strip">
      <div class="chip">
        <v-icon
          size="16"
          class="mr-1 text-secondary"
        >
          mdi-dumbbell
        </v-icon>
        <span>{{ processedExercises.length }} exercises</span>
      </div>
      <div class="chip">
        <v-icon
          size="16"
          class="mr-1 text-secondary"
        >
          mdi-clipboard-text-outline
        </v-icon>
        <span>{{ totalPlannedSets }} planned sets</span>
      </div>
    </div>

    <!-- Exercises list -->
    <div class="content">
      <div
        v-if="!processedExercises.length"
        class="px-4"
      >
        <v-skeleton-loader
          v-for="n in 3"
          :key="n"
          type="image, list-item-two-line, list-item"
          class="mb-4 rounded-xl"
        />
      </div>

      <div
        v-else
        class="d-flex flex-column ga-4 px-3 pb-8"
      >
        <v-card
          v-for="exercise in processedExercises"
          :key="exercise.exerciseId"
          class="exercise-card"
          variant="flat"
          rounded="xl"
        >
          <div
            class="ex-header"
            @click="toggleExercise(exercise.exerciseId)"
          >
            <div class="ex-title">
              <div class="icon-wrap mr-3">
                <v-icon
                  color="primary"
                  size="22"
                >
                  mdi-dumbbell
                </v-icon>
              </div>
              <div class="title-block">
                <div class="text-subtitle-2 font-weight-bold ellipsis">
                  {{ exercise.exercise?.name || 'Exercise' }}
                </div>
                <div class="text-caption text-secondary ellipsis-2">
                  {{ exercise.exercise?.description || '—' }}
                </div>
              </div>
            </div>

            <div class="ex-meta">
              <v-chip
                size="x-small"
                variant="tonal"
                class="mr-2"
              >
                {{ (allWorkoutSets[exercise.exerciseId] || []).length }} sets
              </v-chip>
              <v-btn
                icon
                size="small"
                variant="text"
                class="text-secondary"
                @click.stop="handleExerciseDelete(exercise.exerciseId)"
              >
                <v-icon size="18">
                  mdi-delete-outline
                </v-icon>
              </v-btn>
              <v-icon
                size="20"
                class="ml-1 text-secondary"
                :class="{ rotated: expanded[exercise.exerciseId] }"
              >
                mdi-chevron-down
              </v-icon>
            </div>
          </div>

          <v-expand-transition>
            <div
              v-show="expanded[exercise.exerciseId]"
              class="ex-body"
            >
              <!-- RPE + Notes -->
              <div class="ex-controls">
                <div class="control">
                  <div class="text-caption mb-1 text-secondary">
                    RPE
                  </div>
                  <v-slider
                    :model-value="exerciseMetadata[exercise.exerciseId]?.rpe ?? 7"
                    min="1"
                    max="10"
                    step="1"
                    color="primary"
                    thumb-label
                    @update:model-value="
                      (val) => handleMetadataUpdate(exercise.exerciseId, { rpe: val as number })
                    "
                  />
                </div>
                <div class="control">
                  <div class="text-caption mb-1 text-secondary">
                    Notes
                  </div>
                  <v-textarea
                    :model-value="exerciseMetadata[exercise.exerciseId]?.notes || ''"
                    variant="solo"
                    density="comfortable"
                    rows="2"
                    auto-grow
                    placeholder="Add notes..."
                    @update:model-value="
                      (val) => handleMetadataUpdate(exercise.exerciseId, { notes: val as string })
                    "
                  />
                </div>
              </div>

              <!-- Sets -->
              <v-table
                density="compact"
                class="sets-table mt-2"
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      Set
                    </th>
                    <th class="text-left">
                      Weight
                    </th>
                    <th class="text-left">
                      Reps
                    </th>
                    <th class="text-left">
                      Done
                    </th>
                    <th class="text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="s in allWorkoutSets[exercise.exerciseId] || []"
                    :key="s.set"
                  >
                    <td>#{{ s.set }}</td>
                    <td>
                      <v-text-field
                        type="number"
                        variant="solo"
                        density="compact"
                        hide-details
                        :model-value="s.weight"
                        @update:model-value="
                          (val) =>
                            handleSetUpdate(exercise.exerciseId, {
                              ...s,
                              weight: Number(val),
                            })
                        "
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="number"
                        variant="solo"
                        density="compact"
                        hide-details
                        :model-value="s.reps"
                        @update:model-value="
                          (val) =>
                            handleSetUpdate(exercise.exerciseId, {
                              ...s,
                              reps: Number(val),
                            })
                        "
                      />
                    </td>
                    <td>
                      <v-switch
                        density="compact"
                        inset
                        color="primary"
                        :model-value="s.done"
                        @update:model-value="
                          (val) =>
                            handleSetUpdate(exercise.exerciseId, {
                              ...s,
                              done: Boolean(val),
                            })
                        "
                      />
                    </td>
                    <td class="text-right">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        class="text-secondary"
                        @click="handleSetDelete(exercise.exerciseId, s)"
                      >
                        <v-icon size="18">
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>

                  <tr v-if="!(allWorkoutSets[exercise.exerciseId] || []).length">
                    <td
                      colspan="5"
                      class="text-secondary"
                    >
                      No sets yet
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <div class="d-flex justify-end mt-2">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="handleSetAdd(exercise.exerciseId)"
                >
                  Add Set
                </v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </div>
    </div>

    <!-- Bottom sticky action bar -->
    <div class="bottombar">
      <v-btn
        block
        color="primary"
        :loading="isLoading"
        size="large"
        prepend-icon="mdi-check"
        @click="finnishSession"
      >
        Finish Session
      </v-btn>
    </div>

    <!-- Fullscreen Add Exercise Dialog -->
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

<<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { toast } from 'vuetify-sonner';
import router from '@/router';

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
const processedExercises = ref<Exercise[]>([]);
const workoutSession = computed<WorkoutSession | null>(
  () => workoutSessionStore.selectedWorkoutSession,
);
const allWorkoutSets = ref<Record<number, WorkoutSet[]>>({});
const isLoading = ref(false);
const exerciseMetadata = ref<Record<number, { rpe?: number; notes?: string }>>(
  {},
);
const expanded = ref<Record<number, boolean>>({});

const clock = computed(() => workoutSessionStore.formattedClock);
const totalPlannedSets = computed(() =>
  Object.values(allWorkoutSets.value).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0,
  ),
);

function toggleExercise(id: number) {
  expanded.value[id] = !expanded.value[id];
}

watchEffect(async () => {
  if (!workoutSession.value) {
    processedExercises.value = [];
    allWorkoutSets.value = {};
    exerciseMetadata.value = {};
    expanded.value = {};
    return;
  }

  const baseExercises = workoutSession.value.workoutSnapshot.exercises;
  const newAllSets: Record<number, WorkoutSet[]> = {};

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
        id: baseExercise.exerciseId,
        exercise: exerciseDetails,
        pauseSeconds: baseExercise.pauseSeconds ?? 0,
      };
    }),
  );

  const newMetadata: Record<number, { rpe?: number; notes?: string }> = {};
  const newExpanded: Record<number, boolean> = {};
  for (const exercise of exercisesWithDetails) {
    newMetadata[exercise.exerciseId] = { rpe: undefined, notes: '' };
    newExpanded[exercise.exerciseId] = true; // default expanded for active session
  }

  exerciseMetadata.value = newMetadata;
  processedExercises.value = exercisesWithDetails;
  allWorkoutSets.value = newAllSets;
  expanded.value = newExpanded;
});

onMounted(() => {
  if (workoutSessionStore.formattedClock === '00:00') {
    workoutSessionStore.startClock();
  }
});

function updateWorkoutSessionExercises(newExerciseIds: number[]) {
  if (!workoutSession.value) return;
  isLoading.value = true;
  try {
    const existing = processedExercises.value.map((e) => e.exerciseId);
    const toAdd = newExerciseIds.filter((id) => !existing.includes(id));
    const toRemove = existing.filter((id) => !newExerciseIds.includes(id));
    if (toRemove.length) console.log('Exercises to remove:', toRemove);
    if (toAdd.length) console.log('Exercises to add:', toAdd);
    // Implement actual backend calls as needed
  } catch (e) {
    console.error('Error updating workout session exercises:', e);
    toast.error('Failed to update workout session exercises.');
  } finally {
    isLoading.value = false;
    isAddExerciseOpen.value = false;
  }
}

function handleExerciseDelete(exerciseId: number) {
  const i = processedExercises.value.findIndex((e) => e.exerciseId === exerciseId);
  if (i !== -1) {
    processedExercises.value.splice(i, 1);
    delete allWorkoutSets.value[exerciseId];
    delete exerciseMetadata.value[exerciseId];
    delete expanded.value[exerciseId];
  }
}

function handleMetadataUpdate(
  exerciseId: number,
  data: { rpe?: number; notes?: string },
) {
  exerciseMetadata.value[exerciseId] = {
    ...(exerciseMetadata.value[exerciseId] || {}),
    ...data,
  };
}

function handleSetUpdate(exerciseId: number, updatedSet: WorkoutSet) {
  const sets = allWorkoutSets.value[exerciseId];
  const idx = sets.findIndex((s) => s.set === updatedSet.set);
  if (idx !== -1) sets[idx] = updatedSet;
}

function handleSetDelete(exerciseId: number, setToDelete: WorkoutSet) {
  const sets = allWorkoutSets.value[exerciseId];
  const idx = sets.findIndex((s) => s.set === setToDelete.set);
  if (idx !== -1) {
    sets.splice(idx, 1);
    sets.forEach((s, i) => (s.set = i + 1));
  }
}

function handleSetAdd(exerciseId: number) {
  const sets = allWorkoutSets.value[exerciseId] || (allWorkoutSets.value[exerciseId] = []);
  const last = sets.length > 0 ? sets[sets.length - 1] : { weight: 0, reps: 0 };
  sets.push({
    set: sets.length + 1,
    previous: 'N/A',
    weight: last.weight,
    reps: last.reps,
    done: false,
  });
}

const finnishSession = async () => {
  if (isLoading.value) return;
  if (!workoutSession.value?.id) {
    toast.error('Active session not found.');
    return;
  }

  isLoading.value = true;
  const sessionId = workoutSession.value.id;

  const completedExercises: FinishedExercisePayload[] = [];
  for (const exercise of processedExercises.value) {
    const setsForExercise = allWorkoutSets.value[exercise.exerciseId] || [];
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

  try {
    if (completedExercises.length === 0) {
      await abandonWorkoutSession(sessionId);
      toast.info('No exercises completed. Session abandoned.');
    } else {
      const finalPayload = { completedExercises, notes: '' };
      await finishWorkoutSession(sessionId, finalPayload);
      toast.success('Workout session finished successfully!');
    }
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
<style scoped>
.session-page {
  background: #1a1a1a;
  min-height: 100%;
}

/* Sticky top action bar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(26, 26, 26, 0.96), rgba(26, 26, 26, 0.72));
  backdrop-filter: blur(8px);
}

.clock-wrap {
  display: inline-flex;
  align-items: center;
}

.clock-text {
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.92);
}

.text-secondary {
  color: rgba(255, 255, 255, 0.64);
}

/* Meta strip below bar */
.meta-strip {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px 6px 16px;
}
.meta-strip .chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #1f1f1f;
}

/* Content area */
.content {
  margin-top: 6px;
}

/* Exercise cards */
.exercise-card {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px;
  overflow: hidden;
}
.ex-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ex-title {
  display: flex;
  align-items: center;
  min-width: 0;
}
.title-block {
  min-width: 0;
}
.ellipsis {
  max-width: 70vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 75vw;
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.ex-meta {
  display: inline-flex;
  align-items: center;
}
.ex-meta .rotated {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

/* Controls */
.ex-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 12px;
}
@media (min-width: 520px) {
  .ex-controls {
    grid-template-columns: 240px 1fr;
  }
}

.control :deep(.v-field) {
  background: #252525 !important;
}

/* Sets table */
.sets-table {
  --table-border: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--table-border);
  border-radius: 12px;
  overflow: hidden;
  background: #1c1c1c;
}
.sets-table thead th {
  background: #202020;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}
.sets-table td,
.sets-table th {
  border-bottom: 1px solid var(--table-border) !important;
}
.sets-table td:last-child,
.sets-table th:last-child {
  padding-right: 12px;
}

/* Bottom sticky bar */
.bottombar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 10px 16px 16px 16px;
  background: linear-gradient(0deg, rgba(26, 26, 26, 0.96), rgba(26, 26, 26, 0.72));
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
