<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      title="Add Exercises"
      show-menu
      @close="saveAndClose"
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
                :key="muscleGroup.id"
                :value="muscleGroup.id"
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
    <v-list
      v-if="exercises && exercises.length > 0"
      class="flex-grow-1 overflow-y-auto pa-0 pb-5"
    >
      <v-list-item
        v-for="exercise in exercises"
        :key="exercise.id"
        class="border-t-sm border-b-sm py-2"
        two-line
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-checkbox
              v-model="selectedIds"
              :value="exercise.id"
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
    <div
      v-else
      class="flex-grow-1 d-flex flex-column align-center mt-10 text-center px-6"
    >
      <v-icon
        size="48"
        color="grey-lighten-1"
      >
        mdi-dumbbell
      </v-icon>
      <h2 class="text-h6 mt-3 mb-1">
        No exercises found
      </h2>
      <p class="text-body-2 text-grey-lighten-1">
        Try adjusting your search or filter to find what you're looking for.
      </p> 
      <v-btn
        class="mt-4"
        color="primary"
        @click="isCreateExerciseOpen = true"
      >
        Create Exercise
      </v-btn>
    </div>
  </div>
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
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";

const props = defineProps<{
  initialSelectedIds: number[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", selectedIds: number[]): void;
}>();

const muscleGroupStore = useMuscleGroupStore();
const exerciseStore = useExerciseStore();

const searchQuery = ref<string>("");
const selectedIds = ref<number[]>([...props.initialSelectedIds]);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);
const isCreateExerciseOpen = ref<boolean>(false);
const selectedMuscleGroups = ref<number[]>([]);

const openViewExercise = (exercise: Exercise) => {
  viewExercise.value = exercise;
  isViewExerciseOpen.value = true;
};

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    id: group.id,
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
      (Array.isArray(exercise.muscleGroups) &&
        exercise.muscleGroups
          .map((mg: number | { id: number }) => typeof mg === "object" ? mg.id : mg)
          .some((mgId: number) => selectedMuscleGroups.value.includes(mgId))
      );

    return matchesSearch && matchesMuscleGroup;
  }),
);

const saveAndClose = () => {
  emit("save", selectedIds.value);
  emit("close");
};

</script>