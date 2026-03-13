<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <div class="pa-0">
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <h1 class="text-h6 font-weight-bold text-textPrimary mb-0">
          {{ $t('myWorkouts.title') }}
        </h1>
      </div>
    </div>

    <div v-if="!workouts.length && loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-two-line, list-item"
        class="mb-3 bg-cardBg rounded-lg"
        :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
      />
    </div>

    <div v-else-if="workouts.length" class="d-flex flex-column ga-3">
      <v-card
        v-for="workout in workouts.slice(0, 3)"
        :key="workout.id"
        class="bg-cardBg pa-4 rounded-lg d-flex justify-space-between align-center"
        :style="{ border: '1px solid rgb(var(--v-theme-borderColor))', boxShadow: 'none' }"
        @click="routeTo(workout.id)"
      >
        <div>
          <h1 class="text-caption text-primary">{{ $t('myWorkouts.workoutType.strength') }}</h1>
          <h1 class="text-h6 font-weight-bold text-textPrimary">
            {{ workout.title }}
          </h1>

          <div class="d-flex align-center ga-3">
            <span class="text-caption text-textSecondary align-center d-flex ga-1">
              <v-icon size="16" color="grey">mdi-timer-outline</v-icon>
              {{ workout.time }} {{ $t('units.minShort') }}
            </span>
            <span class="text-caption text-textSecondary align-center d-flex ga-1">
              <v-icon size="16" color="grey">mdi-dumbbell</v-icon>
              {{ workout.exercises.length }} {{ $t('myWorkouts.exercisesUnit') }}
            </span>
          </div>
        </div>
        <v-icon color="primary" size="30">mdi-chevron-right</v-icon>
      </v-card>
    </div>

    <v-card
      v-else
      class="bg-cardBg pa-6 rounded-lg"
      :style="{ border: '1px solid rgb(var(--v-theme-borderColor))', boxShadow: 'none' }"
    >
      <div class="d-flex flex-column align-center text-center">
        <v-icon color="primary" size="48">mdi-dumbbell</v-icon>
        <div class="text-subtitle-1 font-weight-medium text-textPrimary mt-2">
          {{ $t('myWorkouts.emptyTitle') }}
        </div>
        <div class="text-body-2 text-textSecondary mt-1">
          {{ $t('myWorkouts.emptyDescription') }}
        </div>
      </div>
    </v-card>

    <div class="d-flex justify-center mt-4">
      <v-btn
        outlined
        block
        color="cardBg"
        style="
          border: 1px solid rgb(var(--v-theme-borderColor));
          box-shadow: none;
          border-style: dashed;
        "
        class="text-primary rounded-lg"
        height="50"
        @click="isCreateWorkoutOpen = true"
      >
        {{ $t('myWorkouts.addNewWorkout') }}
      </v-btn>
    </div>

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
import type { Workout } from '@/interfaces/Workout.interface'

const router = useRouter()
const workoutStore = useWorkoutStore()

const loading = ref(false)
const isWorkoutListOpen = ref(false)
const isCreateWorkoutOpen = ref(false)

const workouts = computed<Workout[]>(() => {
  const list = workoutStore.workouts || []
  return [...list].sort(
    (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
  )
})

function routeTo(id: number) {
  workoutStore.setCurrentWorkout(id)
  router.push(`/workout/${id}`)
}
</script>
