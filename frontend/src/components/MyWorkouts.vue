<template>
  <div
    fluid
    class="pa-0"
  >
    <div class="header pt-4 pb-2">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-overline text-secondary">
            Workouts
          </div>
          <h1 class="text-h6 font-weight-bold mb-0">
            My Workouts
          </h1>
          <div class="text-caption text-medium-emphasis mt-1">
            {{ workouts.length }} total
          </div>
        </div>
        <v-btn
          :loading="loading"
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-refresh"
          @click="refresh"
        >
          Refresh
        </v-btn>
      </div>
    </div>

    <!-- Skeletons -->
    <div
      v-if="!workouts.length && loading"
      class="px-4"
    >
      <v-skeleton-loader
        v-for="n in 4"
        :key="n"
        type="image, list-item-two-line, list-item"
        class="mb-4 rounded-xl"
      />
    </div>

    <!-- List -->
    <!-- TODO: FEAT: Show latest 3 workouts done -->
    <div
      v-else-if="workouts.length"
      class="pb-6"
    >
      <v-row dense>
        <v-col
          v-for="workout in workouts.slice(0, 3)"
          :key="workout.id"
          cols="12"
        >
          <v-card
            class="workout-card my-2"
            variant="flat"
            rounded="sm"
            @click="routeTo(workout.id)"
          >
            <div class="card-gradient" />

            <div class="d-flex align-center w-100">
              <div class="icon-wrap mr-3">
                <v-icon
                  color="primary"
                  size="28"
                >
                  mdi-dumbbell
                </v-icon>
              </div>

              <div class="w-100">
                <div class="d-flex align-center justify-space-between">
                  <div class="text-subtitle-1 font-weight-bold ellipsis">
                    {{ workout.title }}
                  </div>
                  <v-icon
                    class="ml-2"
                    color="grey"
                    size="22"
                  >
                    mdi-chevron-right
                  </v-icon>
                </div>

                <div class="text-caption text-medium-emphasis mt-1 d-flex align-center ga-3">
                  <span>{{ workout.exercises.length }} exercises</span>
                  <span class="dot" />
                  <span>{{ workout.time }} min</span>
                </div>

                <!-- Muscle groups -->
                <div class="d-flex align-center flex-wrap mt-2 chips-wrap">
                  <template
                    v-for="(group, idx) in getMuscleGroupsForWorkout(workout).slice(0, 3)"
                    :key="group"
                  >
                    <v-chip
                      :color="chipColorAt(idx)"
                      variant="flat"
                      size="x-small"
                      class="mr-2 mb-2 font-weight-medium"
                    >
                      {{ group }}
                    </v-chip>
                  </template>
                  <v-chip
                    v-if="getMuscleGroupsForWorkout(workout).length > 3"
                    size="x-small"
                    variant="text"
                    class="mr-2 mb-2"
                  >
                    +{{ getMuscleGroupsForWorkout(workout).length - 3 }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Footer row -->
            <div class="d-flex align-center justify-space-between mt-3">
              <div class="text-caption text-medium-emphasis">
                <!-- TODO: FEAT: Maybe have Latest Update instead -->
                Created
                {{
                  new Date(workout.createdAt as any).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              </div>
              <div class="d-flex ga-2">
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-play"
                >
                  Start
                </v-btn>
                <v-btn
                  size="small"
                  variant="text"
                  color="secondary"
                  prepend-icon="mdi-content-duplicate"
                  @click.stop="$router.push(`/workouts/${workout.id}/duplicate`)"
                >
                  Duplicate
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Empty state -->
    <div
      v-else
      class="px-4 mt-6"
    >
      <v-card
        class="empty rounded-xl pa-6"
        variant="outlined"
      >
        <div class="d-flex flex-column align-center text-center">
          <v-icon
            color="primary"
            size="48"
          >
            mdi-dumbbell
          </v-icon>
          <div class="text-subtitle-1 font-weight-medium mt-2">
            No workouts yet
          </div>
          <div class="text-body-2 text-medium-emphasis mt-1">
            Create your first workout and start training.
          </div>
          <v-btn
            class="mt-4"
            color="primary"
            @click="$router.push('/workouts/new')"
          >
            Create Workout
          </v-btn>
        </div>
      </v-card>
    </div>
    <v-btn
      class="w-100"
      size="large"
      @click="isWorkoutListOpen = true"
    >
      Show all workouts
    </v-btn>
    <v-dialog
      v-model="isWorkoutListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <WorkoutList @close="isWorkoutListOpen = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkoutStore } from '@/stores/workout.store';
import type { Workout } from '@/interfaces/Workout.interface';

const router = useRouter();
const workoutStore = useWorkoutStore();

const loading = ref(false);
const isWorkoutListOpen = ref(false);

const workouts = computed<Workout[]>(() => {
  const list = workoutStore.workouts || [];
  return [...list].sort(
    (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime(),
  );
});

function getMuscleGroupsForWorkout(workout: Workout): string[] {
  if (!workout.exercises?.length) return [];
  const names = workout.exercises
    .flatMap((x) => x.exercise?.muscleGroups || [])
    .map((mg: { name: string } | string) => (typeof mg === 'object' && mg?.name ? mg.name : null))
    .filter((x: string | null): x is string => !!x);
  return Array.from(new Set(names));
}

function routeTo(id: number) {
  workoutStore.setCurrentWorkout(id);
  router.push(`/workout/${id}`);
}

async function refresh() {
  try {
    loading.value = true;
    await workoutStore.setWorkouts(true);
  } finally {
    loading.value = false;
  }
}

const chipColors = ['orange-lighten-2', 'deep-purple-lighten-2', 'cyan-lighten-2', 'green-lighten-2'];
function chipColorAt(i: number) {
  return chipColors[i % chipColors.length];
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  backdrop-filter: blur(8px);
  background: linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.6));
}

.workout-card {
  position: relative;
  padding: 14px 16px;
  background: #1e1e1e; /* slightly lighter than page */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.15s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.workout-card:active {
  transform: translateY(1px) scale(0.998);
}

.workout-card:hover {
  border-color: rgba(124, 77, 255, 0.35); /* primary accent glow */
  box-shadow: 0 8px 28px rgba(124, 77, 255, 0.08);
}

.workout-card .card-gradient {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      120px 60px at 90% 0%,
      rgba(124, 77, 255, 0.12),
      transparent 70%
    ),
    radial-gradient(
      120px 60px at 0% 100%,
      rgba(38, 166, 154, 0.08),
      transparent 70%
    );
  pointer-events: none;
}

.icon-wrap {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Text tones for dark background */
:deep(.text-secondary),
.text-secondary {
  color: rgba(255, 255, 255, 0.64) !important;
}

:deep(.text-medium-emphasis),
.text-medium-emphasis {
  color: rgba(255, 255, 255, 0.64) !important;
}

:deep(.text-high-emphasis),
.text-high-emphasis {
  color: rgba(255, 255, 255, 0.92) !important;
}

.ellipsis {
  max-width: 70vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.92);
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
}

.chips-wrap {
  margin-left: -4px;
}

/* Buttons on dark */
:deep(.v-btn--variant-text) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.v-btn--variant-text:hover) {
  background: rgba(255, 255, 255, 0.06);
}

/* Optional: adjust skeleton to blend with dark */
:deep(.v-skeleton-loader) {
  --v-theme-surface: #222;
  --v-theme-on-surface: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
}

/* Empty card surface */
.empty {
  background: #1e1e1e;
  border: 1px dashed rgba(255, 255, 255, 0.12);
}
</style>