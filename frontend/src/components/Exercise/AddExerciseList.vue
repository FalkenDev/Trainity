<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <ExitHeader
      title="Add Exercises"
      showMenu
      @close="emit('close')"
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
          <div class="d-flex align-center">
            <v-checkbox
              v-model="newSelectedExercises"
              :value="exercise._id"
              color="primary"
              hide-details
            />
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ exercise.name }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon @click.stop="" color="grey-lighten-1">mdi-information-outline</v-icon>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts" setup>
import type { Exercise } from "@/interfaces/Exercise.interface";
import { useExerciseStore } from "@/stores/exercise.store";
import ExitHeader from "../basicUI/ExitHeader.vue";

// TODO: View exercise details in a modal

// TODO: When go back, the selected exercises should be kept / added to the workout (if any)
// TODO: If a selected exercise is de-selected, it should be removed from the workout

const props = defineProps<{
  selectedExercises?: Array<{
    exercise: Exercise;
    sets: number;
    reps: number;
    pauseSeconds: number;
  }>;
}>();

const searchQuery = ref<string>("");
const newSelectedExercises = ref<string[]>([]);
const exerciseStore = useExerciseStore();

const exercises = computed<Exercise[]>(() => exerciseStore.exercises.filter((exercise: Exercise) => {
  return (
    exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}));

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const selectExercise = (id: string) => {
if (newSelectedExercises.value.includes(id)) {
    newSelectedExercises.value = newSelectedExercises.value.filter((ex: string) => ex !== id);
  } else {
    newSelectedExercises.value.push(id);
  }
}

const addExercisesToWorkout = () => {
  // Todo: Implement logic to add selected exercises to the workout
}

onMounted(() => {
  if (props.selectedExercises) {
    newSelectedExercises.value = props.selectedExercises.map(
      (item) => item.exercise._id,
    );
  }
});
</script>
