<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <ExitHeader
      title="Add Exercises"
      showMenu
      @close="close"
      :loading="isLoading"
    />
    <v-text-field
      v-model="searchQuery"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      label="Search exercises"
      clearable
      class="mx-2"
      hide-details
    />
    <v-list>
      <v-list-item
        v-for="exercise in exercises"
        :key="exercise._id"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="selectExercise(exercise._id)"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-checkbox
              v-model="newSelectedExercises"
              :value="exercise._id"
              color="primary"
              hide-details
              density="compact"
            />
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ exercise.name }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon
              @click.stop="openViewExercise(exercise)"
              color="grey-lighten-1"
              >mdi-information-outline</v-icon
            >
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
  <v-dialog v-model="isViewExerciseOpen" fullscreen>
    <EditExercise
      :selected-exercise="viewExercise"
      :workout-id="props.workoutId"
      @close="isViewExerciseOpen = false"
      :isViewExercise="true"
    />
  </v-dialog>
</template>
<script lang="ts" setup>
import type { Exercise } from "@/interfaces/Exercise.interface";
import { useExerciseStore } from "@/stores/exercise.store";
import ExitHeader from "../basicUI/ExitHeader.vue";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "@/services/workout.sevice";
import { useWorkoutStore } from "@/stores/workout.store";

// TODO: View exercise details in a modal

const props = defineProps<{
  selectedExercises?: Array<{
    exercise: Exercise;
    sets: number;
    reps: number;
    pauseSeconds: number;
  }>;
  workoutId: string;
}>();

const workoutStore = useWorkoutStore();
const searchQuery = ref<string>("");
const newSelectedExercises = ref<string[]>([]);
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);

const openViewExercise = (exercise: Exercise) => {
  viewExercise.value = exercise;
  isViewExerciseOpen.value = true;
};

const exercises = computed<Exercise[]>(() =>
  exerciseStore.exercises.filter((exercise: Exercise) => {
    return (
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exercise.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }),
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const selectExercise = (id: string) => {
  if (newSelectedExercises.value.includes(id)) {
    newSelectedExercises.value = newSelectedExercises.value.filter(
      (ex: string) => ex !== id,
    );
  } else {
    newSelectedExercises.value.push(id);
  }
};

const close = async () => {
  await addExercisesToWorkout();
  emit("close");
};

const addExercisesToWorkout = async () => {
  isLoading.value = true;
  let hasBeenUpdated = false;
  try {
    if (props.selectedExercises) {
      const existingExerciseIds = props.selectedExercises.map(
        (item) => item.exercise._id,
      );

      const newExercises = newSelectedExercises.value.filter(
        (id) => !existingExerciseIds.includes(id),
      );

      const removedExercises = existingExerciseIds.filter(
        (id) => !newSelectedExercises.value.includes(id),
      );

      for (const exerciseId of newExercises) {
        await addExerciseToWorkout(props.workoutId, exerciseId);
        hasBeenUpdated = true;
      }

      for (const exerciseId of removedExercises) {
        await removeExerciseFromWorkout(props.workoutId, exerciseId);
        hasBeenUpdated = true;
      }

      if (hasBeenUpdated) {
        await workoutStore.setWorkouts(true);
      }
    }
  } catch (error) {
    console.error("Error adding exercises to workout:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.selectedExercises) {
    newSelectedExercises.value = props.selectedExercises.map(
      (item) => item.exercise._id,
    );
  }
});
</script>
