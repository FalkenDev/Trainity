<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      :show-menu="true"
      title="Exercise in workout"
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div v-if="selectedExercise">
      <v-card height="200" class="bg-white" />
      <div class="mx-5">
        <div class="py-4">
          <h1 class="text-h5 font-weight-bold">
            {{ selectedExercise.exercise.name }}
          </h1>
          <p>{{ selectedExercise.exercise.description }}</p>
          <div class="d-flex ga-2 align-center mt-2 flex-wrap">
            <v-chip
              color="green-lighten-1"
              label
              v-for="group in getMuscleGroupsForExercise()"
              :key="group"
            >
              {{ group }}
            </v-chip>
          </div>
        </div>
        <v-divider />
        <v-form v-if="editExercise" class="py-4">
          <v-text-field
            v-model="editExercise.sets"
            label="Sets"
            type="number"
            variant="outlined"
            class="mb-4"
          />
          <v-text-field
            v-model="editExercise.reps"
            label="Reps"
            type="number"
            variant="outlined"
            class="mb-4"
          />
          <v-text-field
            v-model="editExercise.pauseSeconds"
            label="Pause (seconds)"
            type="number"
            variant="outlined"
          />
          <v-text-field
            v-model="editExercise.weight"
            label="Weight (kg)"
            type="number"
            variant="outlined"
            class="mt-4"
          />
        </v-form>
        <v-btn class="w-100" color="primary" @click="updateExercise">
          Save Changes
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Exercise } from "@/interfaces/Workout.interface";
import type { MuscleGroup } from "@/interfaces/MuscleGroup.interface";
import type { AddExerciseToWorkout } from "@/interfaces/Workout.interface";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";
import { updateExerciseInWorkout } from "@/services/workout.sevice";

const muscleGroupStore = useMuscleGroupStore();
const props = defineProps<{
  workoutId: string;
  selectedExercise: Exercise | null;
}>();

const editExercise = ref<AddExerciseToWorkout | null>({
  exerciseId: props.selectedExercise?.exercise._id || "",
  sets: props.selectedExercise?.sets || 0,
  reps: props.selectedExercise?.reps || 0,
  pauseSeconds: props.selectedExercise?.pauseSeconds || 0,
  order: props.selectedExercise?.order || 0,
  weight: props.selectedExercise?.weight || 0,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const getMuscleGroupsForExercise = (): string[] => {
  if (!props.selectedExercise) {
    return [];
  }

  const muscleGroup = muscleGroupStore.muscleGroups as MuscleGroup[];
  return props.selectedExercise.exercise.muscleGroups
    .map((groupId) => muscleGroup.find((group) => group._id === groupId)?.name)
    .filter((name): name is string => !!name);
};

const updateExercise = async () => {
  try {
    if (!editExercise.value) {
      console.error("No exercise data to update.");
      return;
    }
    if (!props.workoutId) {
      console.error("No workout ID provided.");
      return;
    }
    const repsponse = await updateExerciseInWorkout(
      props.workoutId,
      props.selectedExercise?.exercise._id || "",
      editExercise.value as AddExerciseToWorkout,
    );
    if (repsponse) {
      console.log("Exercise updated successfully:", repsponse);
      emit("close");
    } else {
      console.error("Failed to update exercise.");
    }
  } catch (error) {
    console.error("Error in updateExercise:", error);
  }
};
</script>
