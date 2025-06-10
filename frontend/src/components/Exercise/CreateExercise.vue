<template>
  <div class="w-100 h-100 bg-grey-darken-4">
    <BackHeader title="Add Exercises" />
    <v-form class="mx-5">
      <h1 class="text-h4 mb-4">Create Exercise</h1>
      <v-text-field
        label="Exercise Name"
        required
        variant="outlined"
        v-model="newExercise.name"
      />
      <v-textarea
        label="Description"
        rows="2"
        variant="outlined"
        v-model="newExercise.description"
      />
      <v-select
        label="Muscle Group"
        :items="muscleGroupItems"
        required
        class="mt-3"
        multiple
        item-title="name"
        item-value="_id"
        variant="outlined"
        v-model="newExercise.muscleGroups"
        :menu-props="{ maxHeight: '200px' }"
      />
      <v-text-field
        label="Sets"
        type="number"
        min="1"
        required
        class="mt-3"
        variant="outlined"
        v-model="newExercise.defaultSets"
      />
      <v-text-field
        label="Reps"
        type="number"
        min="1"
        required
        class="mt-3"
        variant="outlined"
        v-model="newExercise.defaultReps"
      />
      <v-text-field
        label="Pause Seconds"
        type="number"
        min="0"
        required
        class="mt-3"
        variant="outlined"
        v-model="newExercise.defaultPauseSeconds"
      />
      <v-btn color="primary" class="mt-4" @click="createNewExercise">
        Create Exercise
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { createExercise } from "@/services/exercise.service";
import type { CreateExercise } from "@/interfaces/Exercise.interface";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";
import { useExerciseStore } from "@/stores/exercise.store";
import { toast } from "vuetify-sonner";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const exerciseStore = useExerciseStore();
const muscleGroupStore = useMuscleGroupStore();
const newExercise = ref<CreateExercise>({
  name: "",
  description: "",
  muscleGroups: [],
  defaultSets: 1,
  defaultReps: 1,
  defaultPauseSeconds: 0,
});

const muscleGroupItems = computed(() => muscleGroupStore.muscleGroups);

const createNewExercise = async () => {
  try {
    const response = await createExercise(newExercise.value);
    if (response) {
      toast.success("Exercise created successfully!");
      newExercise.value = {
        name: "",
        description: "",
        muscleGroups: [],
        defaultSets: 1,
        defaultReps: 1,
        defaultPauseSeconds: 0,
      };
      exerciseStore.setExercises(true);
      emit("close");
    } else {
      toast.error("Failed to create exercise.");
    }
  } catch (error) {
    console.error("Error creating exercise:", error);
    toast.error("An error occurred while creating the exercise.");
  }
};
</script>
