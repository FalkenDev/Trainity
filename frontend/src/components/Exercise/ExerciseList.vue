<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      title="Exercises"
      show-menu
      :loading="isLoading"
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>Create exercise</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>Remove exercises</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>
    <div class="d-flex flex-row mx-2 ga-5 mb-3">
      <v-text-field
        v-model="searchQuery"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        label="Search exercises"
        clearable
        hide-details
        density="compact"
      />
      <v-btn
        height="40"
        variant="outlined"
      >
        Filtrera
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
    <v-list>
      <v-list-item
        v-for="exercise in exercises"
        :key="exercise._id"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click.stop="openViewExercise(exercise)"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ exercise.name }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon
              color="grey-lighten-1"
            >
              mdi-chevron-right
            </v-icon>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
  <v-dialog
    v-model="isCreateExerciseOpen"
    fullscreen
  >
    <CreateExercise @close="isCreateExerciseOpen = false" />
  </v-dialog>
  <v-dialog
    v-model="isViewExerciseOpen"
    fullscreen
  >
    <EditExercise
      :selected-exercise="viewExercise"
      :is-view-exercise="true"
      @close="isViewExerciseOpen = false"
    />
  </v-dialog>
</template>
<script lang="ts" setup>
import type { Exercise } from "@/interfaces/Exercise.interface";
import { useExerciseStore } from "@/stores/exercise.store";

const searchQuery = ref<string>("");
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);
const isCreateExerciseOpen = ref<boolean>(false);

const emit = defineEmits<{
  (e: "close"): void;
}>();

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
</script>
