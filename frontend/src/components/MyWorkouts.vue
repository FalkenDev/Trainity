<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">My workouts</h1>
      <v-btn
        id="menu-activator"
        color="grey-darken-3"
        density="compact"
        variant="flat"
      >
        Lägg till
      </v-btn>
    </div>
    <div>
      <v-card
        v-for="(workout, index) in workouts"
        :key="index"
        class="mb-4 d-flex pa-2 align-center justify-space-between"
        style="border-radius: 5px;"
        @click="routeTo(workout._id)"
      >
        <div class="d-flex ga-5 align-center">
          <img class="bg-grey" style="width: 65px; height: 65px;"></img>
          <div class="d-flex flex-column ga-1">
            <h2 class="text-h6">{{ workout.title }}</h2>
            <div class="text-body-2 d-flex align-center ga-1" style="line-height: 1.1rem !important;">
              <v-icon>mdi-clock-outline</v-icon>
              <p>{{ workout.time }} minutes</p>
            </div>
          </div>
        </div>
        <v-btn
          class="d-flex justify-center align-center mx-2"
          color="orange-darken-2"
          icon
          size="35"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { Workout } from '@/interfaces/Workout.interface';
  import router from '@/router';
  import { useWorkoutStore } from '@/stores/workout.store';
  const workoutStore = useWorkoutStore();

  const workouts = computed<Workout[]>(() => workoutStore.workouts);

  const routeTo = (id: string) => {
    console.log('Navigating to workout with ID:', id);
    workoutStore.setCurrentWorkout(id);
    router.push(`/workout/${id}`);
  };
</script>
