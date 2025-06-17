<template>
  <div>
    <BackHeader
      :show-menu="true"
      title="Workout"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isWeightAndRepsOpen = true">
            <v-list-item-title>Weight and reps</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isAddExerciseOpen = true">
            <v-list-item-title>Add exercise</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isEditWorkoutOpen = true">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dublicate">
            <v-list-item-title>Duplicate</v-list-item-title>
          </v-list-item>
          <v-list-item @click="() => (isDeleteDialogOpen = true)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>
    <v-card height="300" />
    <div class="px-5">
      <div class="py-4">
        <h1 class="text-h5 font-weight-bold">
          {{ workout?.title }}
        </h1>
        <p>{{ workout?.description }}</p>
        <div class="d-flex ga-2 align-center mt-2 flex-wrap">
          <v-chip
            label
            color="orange-lighten-1"
          >
            {{ workout?.time }} min
          </v-chip>
          <v-chip
            v-for="group in getMuscleGroupsForWorkout()"
            :key="group"
            color="green-lighten-1"
            label
          >
            {{ group }}
          </v-chip>
        </div>
      </div>
      <v-divider />
      <v-btn
        class="w-100"
        color="primary"
        @click="startSession"
      >
        Start Session
      </v-btn>
      <div class="mt-4">
        <v-card
          v-for="(exercise, index) in workout?.exercises"
          :key="index"
          class="mb-4 d-flex pa-2 align-center justify-space-between"
          style="border-radius: 5px"
          @click="selectExercise(exercise)"
        >
          <div class="d-flex ga-5 align-center">
            <img
              class="bg-grey"
              style="width: 65px; height: 65px"
            >
            <div class="d-flex flex-column ga-1">
              <h2 class="text-h6">
                {{ exercise.exercise?.name }}
              </h2>
              <div class="d-flex ga-2">
                <p class="text-body-2">
                  {{ exercise.sets }} x {{ exercise.reps }} Reps
                </p>
                <p class="text-body-2">
                  {{ exercise.pauseSeconds }} sec pauses
                </p>
                <p class="text-body-2">
                  {{ exercise.weight }}kg
                </p>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
  <v-dialog
    v-model="isAddExerciseOpen"
    fullscreen
  >
    <AddExerciseList
      :selected-exercises="workout?.exercises"
      :workout-id="workout?._id || ''"
      @close="isAddExerciseOpen = false"
    />
  </v-dialog>
  <v-dialog
    v-model="isEditExerciseOpen"
    fullscreen
  >
    <EditExercise
      :selected-exercise="selectedExercise"
      :workout-id="workout?._id || ''"
      :is-view-exercise="false"
      @close="isEditExerciseOpen = false"
    />
  </v-dialog>
  <v-dialog
    v-model="isEditWorkoutOpen"
    fullscreen
  >
    <EditWorkout
      :workout="workout"
      @close="isEditWorkoutOpen = false"
      @save="workoutStore.setWorkouts(true)"
    />
  </v-dialog>
  <v-dialog
    v-model="isWeightAndRepsOpen"
    fullscreen
  >
    <WeightAndRepsSettings
      :workout-id="workout?._id || ''"
      :default-weight-and-reps="workout?.defaultWeightAndReps ?? ''"
      @close="isWeightAndRepsOpen = false"
    />
  </v-dialog>
  <AcceptDialog
    v-model="isDeleteDialogOpen"
    title="Delete Exercise"
    description="Are you sure you want to delete this exercise?"
    @accept="deleteExercise"
    @cancel="isDeleteDialogOpen = false"
  />
</template>
<script lang="ts" setup>
import BackHeader from "@/components/BackHeader.vue";
import router from "@/router";
import { useWorkoutStore } from "@/stores/workout.store";
import { startWorkoutSession } from "@/services/workoutSession.service";
import { useWorkoutSessionStore } from "@/stores/workoutSession.store";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";
import type { MuscleGroup } from "@/interfaces/MuscleGroup.interface";
import type { Workout, Exercise } from "@/interfaces/Workout.interface";
import { deleteWorkout, dublicateWorkout } from "@/services/workout.sevice";
import { toast } from "vuetify-sonner";

const isAddExerciseOpen = ref<boolean>(false);
const isEditExerciseOpen = ref<boolean>(false);
const isDeleteDialogOpen = ref<boolean>(false);
const isEditWorkoutOpen = ref<boolean>(false);
const isWeightAndRepsOpen = ref<boolean>(false);
const muscleGroupStore = useMuscleGroupStore();
const workoutStore = useWorkoutStore();
const workoutSessionStore = useWorkoutSessionStore();
const workout = computed<Workout | null>(() => workoutStore.currentWorkout);
const selectedExercise = ref<Exercise | null>(null);

const dublicate = async () => {
  if (workout.value) {
    const response = await dublicateWorkout(workout.value._id);
    console.log("Duplicating workout:", response);
    if (response && response._id) {
      await workoutStore.setWorkouts(true);
      workoutStore.setCurrentWorkout(response._id);
      toast.success("Workout duplicated successfully", { progressBar: true });
      router.push(`/workout/${response._id}`);
    } else {
      console.error("Failed to duplicate workout");
    }
  }
};

// TODO: If a workout is already started, give a dialog to end the current session and start a new one

const deleteExercise = async () => {
  try {
    if (workout.value) {
      const response = await deleteWorkout(workout.value._id);
      if (response) {
        workoutStore.setWorkouts(true);
        workoutStore.currentWorkout = null;
        isDeleteDialogOpen.value = false;
        toast.success("Exercise deleted successfully", { progressBar: true });
        router.push("/");
      } else {
        console.error("Failed to delete exercise");
      }
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    toast.error("Failed to delete exercise", { progressBar: true });
    isDeleteDialogOpen.value = false;
  }
};

const selectExercise = (exercise: Exercise) => {
  selectedExercise.value = exercise;
  isEditExerciseOpen.value = true;
};

const getMuscleGroupsForWorkout = (): string[] => {
  if (!workout.value?.exercises || workout.value.exercises.length === 0) {
    return [];
  }

  const muscleGroup = muscleGroupStore.muscleGroups as MuscleGroup[];

  return workout.value?.exercises
    .flatMap((exercise) => exercise.exercise.muscleGroups || [])
    .map((muscleGroupId) => {
      const group = muscleGroup.find((group) => group._id === muscleGroupId);
      return group ? group.name : "Unknown";
    })
    .filter((value, index, self) => self.indexOf(value) === index);
};

const startSession = async () => {
  if (workout.value) {
    const response = await startWorkoutSession(workout.value._id);
    if (response && response._id) {
      await workoutSessionStore.fetchSelectedWorkoutSession(response._id);
      router.push(`/session/${response._id}`);
    } else {
      console.error("Failed to start session:", response);
    }
  }
};
</script>
