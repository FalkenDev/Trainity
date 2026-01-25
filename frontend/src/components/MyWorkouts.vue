<template>
  <div class="pa-0">
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <h1 class="text-h6 font-weight-bold mb-0">
          {{ $t('myWorkouts.title') }}
        </h1>
        <div class="text-caption text-textSecondary mt-1">
          {{ workouts.length }} {{ $t('common.total') }}
        </div>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="!workouts.length && loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-two-line, list-item"
        class="mb-3 bg-cardBg rounded-lg"
        style="border: 1px solid #474747"
      />
    </div>

    <!-- List -->
    <div v-else-if="workouts.length" class="d-flex flex-column ga-3">
      <v-card
        v-for="workout in workouts.slice(0, 3)"
        :key="workout.id"
        class="bg-cardBg pa-4 rounded-lg"
        style="border: 1px solid #474747; box-shadow: none"
        @click="routeTo(workout.id)"
      >
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="d-flex align-center ga-2">
            <v-icon color="primary" size="20">mdi-dumbbell</v-icon>
            <h3 class="text-subtitle-1 font-weight-bold text-textPrimary">
              {{ workout.title }}
            </h3>
          </div>
          <v-icon color="grey" size="20">mdi-chevron-right</v-icon>
        </div>

        <div class="d-flex align-center ga-3 mb-2">
          <span class="text-caption text-textSecondary">
            {{ workout.exercises.length }} {{ $t('myWorkouts.exercisesUnit') }}
          </span>
          <span class="text-caption text-textSecondary">•</span>
          <span class="text-caption text-textSecondary">
            {{ workout.time }} {{ $t('units.minShort') }}
          </span>
        </div>

        <!-- Muscle groups -->
        <div class="d-flex align-center flex-wrap ga-2 mb-3">
          <v-chip
            v-for="(group, idx) in getMuscleGroupsForWorkout(workout).slice(0, 3)"
            :key="group"
            :color="chipColorAt(idx)"
            variant="flat"
            size="x-small"
            class="font-weight-medium"
          >
            {{ group }}
          </v-chip>
          <v-chip
            v-if="getMuscleGroupsForWorkout(workout).length > 3"
            size="x-small"
            variant="text"
            class="text-textSecondary"
          >
            +{{ getMuscleGroupsForWorkout(workout).length - 3 }}
          </v-chip>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-caption text-textSecondary">
            {{ $t('myWorkouts.created') }}
            {{
              new Date(workout.createdAt as any).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            }}
          </span>
          <v-btn
            size="small"
            variant="text"
            color="primary"
            prepend-icon="mdi-play"
            @click.stop="startSession(workout.id)"
          >
            {{ $t('common.start') }}
          </v-btn>
        </div>
      </v-card>
    </div>

    <!-- Empty state -->
    <v-card
      v-else
      class="bg-cardBg pa-6 rounded-lg"
      style="border: 1px solid #474747; box-shadow: none"
    >
      <div class="d-flex flex-column align-center text-center">
        <v-icon color="primary" size="48">mdi-dumbbell</v-icon>
        <div class="text-subtitle-1 font-weight-medium text-textPrimary mt-2">
          {{ $t('myWorkouts.emptyTitle') }}
        </div>
        <div class="text-body-2 text-textSecondary mt-1">
          {{ $t('myWorkouts.emptyDescription') }}
        </div>
        <v-btn class="mt-4" color="primary" @click="isCreateWorkoutOpen = true">
          {{ $t('myWorkouts.createWorkout') }}
        </v-btn>
      </div>
    </v-card>

    <v-btn
      class="w-100 mt-3 bg-cardBg rounded-lg"
      style="border: 1px solid #474747; box-shadow: none"
      size="large"
      @click="isWorkoutListOpen = true"
    >
      {{ $t('myWorkouts.showAllWorkouts') }}
    </v-btn>

    <v-dialog v-model="isWorkoutListOpen" fullscreen transition="slide-y-transition" persistent>
      <WorkoutList @close="isWorkoutListOpen = false" />
    </v-dialog>
    <v-dialog v-model="isCreateWorkoutOpen" fullscreen>
      <CreateWorkout @close="isCreateWorkoutOpen = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useWorkoutStore } from '@/stores/workout.store'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { startWorkoutSession } from '@/services/workoutSession.service'
import type { Workout } from '@/interfaces/Workout.interface'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const workoutStore = useWorkoutStore()
const workoutSessionStore = useWorkoutSessionStore()
const { t } = useI18n()

const loading = ref(false)
const isWorkoutListOpen = ref(false)
const isCreateWorkoutOpen = ref(false)

const workouts = computed<Workout[]>(() => {
  const list = workoutStore.workouts || []
  return [...list].sort(
    (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
  )
})

function getMuscleGroupsForWorkout(workout: Workout): string[] {
  if (!workout.exercises?.length) return []
  const names = workout.exercises
    .flatMap(x => x.exercise?.muscleGroups || [])
    .map((mg: { name: string } | string) => (typeof mg === 'object' && mg?.name ? mg.name : null))
    .filter((x: string | null): x is string => !!x)
  return Array.from(new Set(names))
}

function routeTo(id: number) {
  workoutStore.setCurrentWorkout(id)
  router.push(`/workout/${id}`)
}

async function startSession(workoutId: number) {
  if (workoutId) {
    const response = await startWorkoutSession(workoutId)
    if (response && response.id) {
      await workoutSessionStore.fetchSelectedWorkoutSession(response.id)
      router.push(`/session/${response.id}`)
    } else {
      console.error('Failed to start session:', response)
      toast.error(t('workout.failedToStartSession'), { progressBar: true, duration: 1000 })
    }
  }
}

const chipColors = [
  'orange-lighten-2',
  'deep-purple-lighten-2',
  'cyan-lighten-2',
  'green-lighten-2',
]
function chipColorAt(i: number) {
  return chipColors[i % chipColors.length]
}
</script>

<style scoped>
/* Removed all unused complex styles */
</style>
