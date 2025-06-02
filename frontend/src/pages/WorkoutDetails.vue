<template>
  <div>
    <BackHeader :show-menu="true" title="Workout">
      <template #menuAppend>
        <v-list>
          <v-list-item @click="workoutStore.clearCurrentWorkout">
            <v-list-item-title>Weight and reps</v-list-item-title>
          </v-list-item>
          <v-list-item @click="workoutStore.clearCurrentWorkout">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="workoutStore.clearCurrentWorkout">
            <v-list-item-title>Dublicate</v-list-item-title>
          </v-list-item>
          <v-list-item @click="workoutStore.clearCurrentWorkout">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>
    <v-card height="300" />
    <div class="px-5">
      <div class="py-4">
        <h1 class="text-h5 font-weight-bold">{{ workout?.title }}</h1>
        <p>{{ workout?.description }}</p>
        <div class="d-flex ga-2 align-center mt-2">
          <v-chip label>{{ workout?.time }} min</v-chip>
          <v-chip label>Upper body</v-chip>
        </div>
      </div>
      <v-divider />
      <v-btn class="w-100" color="primary">Start Session</v-btn>
      <div class="mt-4">
        <v-card
          v-for="(exercise, index) in workout?.exercises"
          :key="index"
          class="mb-4 d-flex pa-2 align-center justify-space-between"
          style="border-radius: 5px"
          @click="routeTo(exercise.exercise._id)"
        >
          <div class="d-flex ga-5 align-center">
            <img class="bg-grey" style="width: 65px; height: 65px">
            <div class="d-flex flex-column ga-1">
              <h2 class="text-h6">{{ exercise.exercise?.name }}</h2>
              <div class="d-flex ga-2">
                <p class="text-body-2">
                  {{ exercise.sets }} x {{ exercise.reps }} Reps
                </p>
                <p class="text-body-2">
                  {{ exercise.pauseSeconds }} sec pauses
                </p>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BackHeader from '@/components/BackHeader.vue';
  import router from '@/router';
  import { useWorkoutStore } from '@/stores/workout.store';

  const workoutStore = useWorkoutStore();

  const workout = computed(() => workoutStore.currentWorkout);

  console.log('Current workout:', workout.value);

  const routeTo = (exerciseId: string) => {
    console.log('Navigating to exercise with ID:', exerciseId);
    router.push(`/exercise/${exerciseId}`);
  };
</script>
