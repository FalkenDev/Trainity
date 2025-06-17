<template>
  <div class="d-flex justify-space-between align-center">
    <h1 class="text-h5 font-weight-bold">
      My Workouts
    </h1>
  </div>
  <div v-if="!workouts.length">
    <v-skeleton-loader
      v-for="n in 3"
      :key="n"
      type="list-item-two-line"
      class="mb-4"
    />
  </div>
  <div v-else>
    <v-card
      v-for="workout in workouts"
      :key="workout._id"
      class="mb-4 pa-4"
      variant="flat"
      style="
        border-radius: 16px;
        background: linear-gradient(135deg, #1a1a1a 50%, #0f0f0f 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
      "
      @click="routeTo(workout._id)"
    >
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex flex-column ga-2">
          <h2 class="text-h6 font-weight-bold">
            {{ workout.title }}
          </h2>
          <div class="d-flex flex-wrap align-center ga-2">
            <v-chip
              v-for="group in getMuscleGroupsForWorkout(workout)"
              :key="group"
              size="small"
              color="orange-darken-2"
              variant="flat"
              class="font-weight-bold"
            >
              {{ group }}
            </v-chip>
          </div>
          <div class="text-body-2 d-flex align-center ga-2 text-grey-lighten-1">
            <span>{{ workout.exercises.length }} exercises</span>
            <v-icon size="4">
              mdi-circle
            </v-icon>
            <span>{{ workout.time }} min</span>
          </div>
        </div>
        <v-icon
          color="grey-darken-1"
          size="32"
        >
          mdi-chevron-right
        </v-icon>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Workout } from "@/interfaces/Workout.interface";
import router from "@/router";
import { useWorkoutStore } from "@/stores/workout.store";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";
import type { MuscleGroup } from "@/interfaces/MuscleGroup.interface";

const muscleGroupStore = useMuscleGroupStore();
const workoutStore = useWorkoutStore();

const workouts = computed<Workout[]>(() => workoutStore.workouts);

const getMuscleGroupsForWorkout = (workout: Workout): string[] => {
  if (!workout.exercises || workout.exercises.length === 0) {
    return [];
  }

  const muscleGroup = muscleGroupStore.muscleGroups as MuscleGroup[];

  return workout.exercises
    .flatMap((exercise) => exercise.exercise.muscleGroups || [])
    .map((muscleGroupId) => {
      const group = muscleGroup.find((group) => group._id === muscleGroupId);
      return group ? group.name : "Unknown";
    })
    .filter((value, index, self) => self.indexOf(value) === index);
};

const routeTo = (id: string) => {
  workoutStore.setCurrentWorkout(id);
  router.push(`/workout/${id}`);
};
</script>

<style scoped>
.v-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>
