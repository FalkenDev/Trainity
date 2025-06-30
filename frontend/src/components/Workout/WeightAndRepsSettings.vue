<template>
  <div class="bg-grey-darken-4 h-100 w-100">
    <ExitHeader
      title="Weight and Reps Settings"
      show-menu
      @close="$emit('close')"
    />
    <v-list>
      <v-list-item
        v-for="option in options"
        :key="option.value"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="
          editWeightAndReps(option.value as 'default' | 'latest' | 'exercise')
        "
      >
        <div class="d-flex w-100 align-center ga-4">
          <div class="d-flex flex-column">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ option.label }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2 d-flex flex-wrap">
              {{ option.description }}
            </v-list-item-subtitle>
          </div>
          <v-icon
            v-if="defaultWeightAndReps === option.value"
            color="primary"
          >
            mdi-check
          </v-icon>
          <div
            v-else
            style="width: 24px"
          />
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts" setup>
import { updateWorkout } from "@/services/workout.service";
import { useWorkoutStore } from "@/stores/workout.store";

defineEmits<{
  (e: "close"): void;
}>();

const workoutStore = useWorkoutStore();

const options = [
  {
    label: "Default",
    description: "Use the default weights and repetitions set from workout",
    value: "default",
  },
  {
    label: "Latest",
    description:
      "Use weights and repetitions from the last time you did this workout",
    value: "latest",
  },
  {
    label: "Exercise",
    description: "Use the weights and repetitions set from exercise",
    value: "exercise",
  },
];

const editWeightAndReps = async (value: "default" | "latest" | "exercise") => {
  try {
    const response = await updateWorkout(props.workoutId, {
      defaultWeightAndReps: value,
    });
    if (response) {
      workoutStore.setWorkouts(true);
    }
  } catch (error) {
    console.error("Error updating weight and reps:", error);
  }
};

const props = defineProps<{
  workoutId: string;
  defaultWeightAndReps: string;
}>();
</script>
