<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      title="Add Exercises"
      show-menu
      :loading="isLoading"
      @close="close"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>Create exercise</v-list-item-title>
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
      <v-badge
        color="error"
        :content="selectedMuscleGroups.length"
        offset-x="0"
        offset-y="0"
      >
        <v-btn
          height="40"
          variant="outlined"
        >
          Filter
          <v-menu
            activator="parent"
            :close-on-content-click="false"
          >
            <v-list
              v-model:selected="selectedMuscleGroups"
              select-strategy="classic"
            >
              <v-list-item @click="selectedMuscleGroups = []">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                    color="grey-lighten-1"
                  >
                    mdi-close
                  </v-icon>
                  Reset
                </v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item
                v-for="muscleGroup in muscleGroups"
                :key="muscleGroup._id"
                :value="muscleGroup._id"
              >
                <template #prepend="{ isActive }">
                  <v-list-item-action start>
                    <v-checkbox-btn :model-value="isActive" />
                  </v-list-item-action>
                </template>
                <v-list-item-title>
                  {{ muscleGroup.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-badge>
    </div>
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
              color="grey-lighten-1"
              @click.stop="openViewExercise(exercise)"
            >
              mdi-information-outline
            </v-icon>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
  <v-dialog
    v-model="isViewExerciseOpen"
    fullscreen
  >
    <EditExercise
      :selected-exercise="viewExercise"
      :workout-id="props.workoutId"
      :is-view-exercise="true"
      :is-view-workout-exercise="true"
      @close="isViewExerciseOpen = false"
    />
  </v-dialog>
  <v-dialog
    v-model="isCreateExerciseOpen"
    fullscreen
  >
    <CreateExercise @close="isCreateExerciseOpen = false" />
  </v-dialog>
</template>
<script lang="ts" setup>
import type { Exercise } from "@/interfaces/Exercise.interface";
import { useExerciseStore } from "@/stores/exercise.store";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "@/services/workout.service";
import { useWorkoutStore } from "@/stores/workout.store";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";

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

const muscleGroupStore = useMuscleGroupStore();
const workoutStore = useWorkoutStore();
const searchQuery = ref<string>("");
const newSelectedExercises = ref<string[]>([]);
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);
const isCreateExerciseOpen = ref<boolean>(false);
const selectedMuscleGroups = ref<string[]>([]);

const openViewExercise = (exercise: Exercise) => {
  viewExercise.value = exercise;
  isViewExerciseOpen.value = true;
};

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    _id: group._id,
  }));
});

const exercises = computed<Exercise[]>(() =>
  exerciseStore.exercises.filter((exercise: Exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (exercise.description ?? "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesMuscleGroup =
      selectedMuscleGroups.value.length === 0 ||
      exercise.muscleGroups?.some((mg: string) =>
        selectedMuscleGroups.value.includes(mg)
      );

    return matchesSearch && matchesMuscleGroup;
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
