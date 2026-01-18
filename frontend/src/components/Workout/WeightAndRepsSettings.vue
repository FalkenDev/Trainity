<template>
  <div class="bg-grey-darken-4 h-100 w-100">
    <ExitHeader
      :title="$t('weightAndReps.title')"
      show-menu
      @close="$emit('close')"
    />
    <v-list>
      <v-list-item
        v-for="option in options"
        :key="option.value"
        :disabled="defaultWeightAndReps !== option.value /* TODO: DISABLE until use latest and exercise functions is added*/"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="
          editWeightAndReps(option.value as 'default' | 'latest' | 'exercise')
        "
      >
        <div class="d-flex w-100 align-center ga-4">
          <div class="d-flex flex-column">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ $t(option.label) }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2 d-flex flex-wrap">
              {{ $t(option.description) }}
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
    label: "weightAndReps.options.default.label",
    description: "weightAndReps.options.default.description",
    value: "default",
  },
  {
    label: "weightAndReps.options.latest.label",
    description:
      "weightAndReps.options.latest.description",
    value: "latest",
  },
  {
    label: "weightAndReps.options.exercise.label",
    description: "weightAndReps.options.exercise.description",
    value: "exercise",
  },
];

const editWeightAndReps = async (value: "default" | "latest" | "exercise") => {
  try {
    if (!props.workoutId) {
      console.error("Workout ID is not defined");
      return;
    }
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
  workoutId: number | undefined;
  defaultWeightAndReps: string;
}>();
</script>
