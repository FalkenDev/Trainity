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
      <v-list-item
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="isCreateExerciseOpen = true"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-list-item-title class="text-body-1 font-weight-bold text-grey-lighten-1">
              Create new exercise
            </v-list-item-title>
          </div>
          <div>
            <v-icon
              color="grey-lighten-1"
            >
              mdi-plus
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
      :is-view-workout-exercise="false"
      @close="isViewExerciseOpen = false"
    />
  </v-dialog>
</template>
<script lang="ts" setup>
import type { Exercise } from "@/interfaces/Exercise.interface";
import { useExerciseStore } from "@/stores/exercise.store";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";

const muscleGroupStore = useMuscleGroupStore();
const searchQuery = ref<string>("");
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);
const isCreateExerciseOpen = ref<boolean>(false);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    _id: group._id,
  }));
});

const selectedMuscleGroups = ref<string[]>([]);

const openViewExercise = (exercise: Exercise) => {
  console.log("Opening view exercise:", exercise);
  viewExercise.value = exercise;
  isViewExerciseOpen.value = true;
};

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
</script>
