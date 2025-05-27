<template>
  <div>
    <v-card height="300"></v-card>
    <div class="px-5">
      <div class="py-4">
        <h1 class="text-h5 font-weight-bold">{{ workout?.title }}</h1>
        <p>{{ workout?.description }}</p>
      </div>
      <v-divider />
      <div class="mt-4">
        <v-card
          v-for="(exercise, index) in workout?.exercises"
          :key="index"
          class="mb-4 d-flex pa-2 align-center justify-space-between"
          style="border-radius: 5px"
          @click="routeTo(exercise.exercise._id)"
        >
          <div class="d-flex ga-5 align-center">
            <img style="width: 65px; height: 65px" class="bg-grey" />
            <div class="d-flex flex-column ga-1">
              <h2 class="text-h6">{{ exercise.exercise.name }}</h2>
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
      <v-btn class="w-100" color="primary">Start Session</v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import router from "@/router";
import { useWorkoutStore } from "@/stores/workout.store";

const workoutStore = useWorkoutStore();

const workout = computed(() => workoutStore.currentWorkout);

const routeTo = (exerciseId: string) => {
  console.log("Navigating to exercise with ID:", exerciseId);
  router.push(`/exercise/${exerciseId}`);
};
</script>
