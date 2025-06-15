<template>
  <div>
    <BackHeader
      :show-menu="true"
      title="Workout Session"
    >
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
      <v-btn
        color="primary"
        @click="finnishSession"
      >
        Finnish
      </v-btn>
    </div>
    <div
      v-if="!isExerciseStarted"
      class="ma-5"
    >
      <v-card
        v-for="(exercise, index) in workoutSession?.workout?.exercises"
        :key="index"
        class="mb-4 d-flex pa-2 align-center justify-space-between"
        style="border-radius: 5px"
      >
        <div class="d-flex ga-5 align-center">
          <img
            class="bg-grey"
            style="width: 65px; height: 65px"
          >
          <div class="d-flex flex-column ga-1">
            <h2 class="text-h6">
              {{ exercise.exercise?.name }}
            </h2>
            <div class="d-flex ga-2">
              <p class="text-body-2">
                {{ exercise.sets }} x {{ exercise.reps }} Reps
              </p>
              <p class="text-body-2">
                {{ exercise.pauseSeconds }} sec pauses
              </p>
              <v-btn
                color="primary"
                @click="startExercise(exercise.exerciseId)"
              >
                Start
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <div v-else>
      <h1>{{ selectedExercise.name }}</h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWorkoutSessionStore } from "@/stores/workoutSession.store";
import type { WorkoutSession } from "@/interfaces/workoutSession.interface";
import { fetchExerciseById } from "@/services/exercise.service";
import { finnishWorkoutSession } from "@/services/workoutSession.service";
import { toast } from "vuetify-sonner";
import router from "@/router";

const workoutSessionStore = useWorkoutSessionStore();

const workoutSession = computed<WorkoutSession | null>(
  () => workoutSessionStore.selectedWorkoutSession,
);

const clock = computed(() => workoutSessionStore.formattedClock);

const isExerciseStarted = ref(false);
const selectedExercise = ref(null);

onMounted(() => {
  if (workoutSessionStore.formattedClock === "00:00") {
    workoutSessionStore.startClock();
  }
});

const startExercise = async (exerciseId: string) => {
  console.log("Starting exercise with ID:", exerciseId);
  isExerciseStarted.value = true;
  const response = await fetchExerciseById(exerciseId);
  if (response && response._id) {
    selectedExercise.value = response;
  } else {
    console.error("Failed to fetch exercise:", response);
  }

  console.log("Selected exercise:", selectedExercise.value);
};

const finnishSession = async () => {
  const response = await finnishWorkoutSession;
  if (!response) {
    toast.error("Failed to finish workout session.");
    return;
  }
  workoutSessionStore.stopClock();
  workoutSessionStore.selectedWorkoutSession = null;
  workoutSessionStore.resetClock();
  toast.success("Workout session finished successfully!");
  router.push("/");
};
</script>
