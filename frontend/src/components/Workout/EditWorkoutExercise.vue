<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      :show-menu="true"
      :title="
        isViewExercise
          ? 'Exercise'
          : 'Edit Exercise in workout'
      "
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="removeExercise">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div v-if="selectedExercise">
      <v-card
        height="200"
        class="bg-white"
      />
      <div class="mx-5">
        <div class="py-4">
          <h1 class="text-h5 font-weight-bold">
            {{
              selectedExercise.exercise.name
            }}
          </h1>
          <p>
            {{
              selectedExercise.exercise.description
            }}
          </p>
          <div class="d-flex ga-2 align-center mt-2 flex-wrap">
            <v-chip
              v-for="group in (props.selectedExercise?.exercise?.muscleGroups || [])"
              :key="group.id"
              color="green-lighten-1"
              label
            >
              {{ group.name }}
            </v-chip>
          </div>
        </div>
        <v-divider />
        <div v-if="isViewExercise">
          <v-list lines="one">
            <v-list-item>
              <template #prepend>
                <v-icon color="primary">
                  mdi-numeric
                </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">Default Sets:</span>
                <span class="ml-2">
                  {{
                    selectedExercise.sets
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary">
                  mdi-repeat
                </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">Default Reps:</span>
                <span class="ml-2">
                  {{
                    selectedExercise.reps
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary">
                  mdi-timer-outline
                </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">Default Pause:</span>
                <span class="ml-2">
                  {{
                    selectedExercise.pauseSeconds
                  }}
                  seconds
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item>
              <template #prepend>
                <v-icon color="grey">
                  mdi-calendar-plus
                </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">Created at:</span>
                <span class="ml-2">
                  {{
                    new Date(
                      selectedExercise.exercise.createdAt,
                    ).toLocaleDateString()
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="grey">
                  mdi-calendar-edit
                </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">Updated at:</span>
                <span class="ml-2">
                  {{
                    new Date(
                      selectedExercise.exercise.updatedAt,
                    ).toLocaleDateString()
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>
          <v-btn
            class="w-100 my-4"
            color="primary"
            :loading="isLoading"
            @click="updateExercise"
          >
            Save Changes
          </v-btn>
          <v-form
            v-if="editExercise"
            class="pt-2 d-flex ga-5 flex-column"
          >
            <v-text-field
              v-model="editExercise.sets"
              label="Sets"
              type="number"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-model="editExercise.reps"
              label="Reps"
              type="number"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-if="isViewWorkoutExercise"
              v-model="editExercise.weight"
              label="Weight (kg)"
              type="number"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-model="editExercise.pauseSeconds"
              label="Pause (seconds)"
              type="number"
              variant="outlined"
              hide-details
            />
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Exercise as workoutExercise } from '@/interfaces/Workout.interface';
import type { AddExerciseToWorkout } from '@/interfaces/Workout.interface';
import { useExerciseStore } from '@/stores/exercise.store';
import {
  updateExerciseInWorkout,
  removeExercisesFromWorkout,
} from '@/services/workout.service';
import { useWorkoutStore } from '@/stores/workout.store';
import { toast } from 'vuetify-sonner';

const props = defineProps<{
  workoutId?: number;
  selectedExercise: workoutExercise ;
  isViewExercise: boolean;
  isViewWorkoutExercise: boolean;
}>();

const isViewExercise = ref(props.isViewExercise);

const exerciseStore = useExerciseStore();
const workoutStore = useWorkoutStore();
const isLoading = ref<boolean>(false);

const editExercise = ref<AddExerciseToWorkout | null>({
  exerciseId: Number(props.selectedExercise.exercise.id),
  sets: props.selectedExercise.sets,
  reps: props.selectedExercise.reps,
  pauseSeconds: props.selectedExercise?.pauseSeconds,
  order: props.selectedExercise?.order || 0,
  weight: props.selectedExercise?.weight || 0,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const removeExercise = async () => {
  try {
    if (!props.selectedExercise || !props.workoutId) {
      console.error('No exercise or workout ID provided.');
      return;
    }

    let response = null;

    if (!props.workoutId) {
      console.error('No workout ID provided for removing exercise from workout.');
      return;
    }
    response = await removeExercisesFromWorkout(
      props.workoutId,
      [props.selectedExercise.exercise.id]
    );

    if (response) {
      toast.success('Exercise removed successfully!', { progressBar: true, duration: 1000 });
      if (props.isViewWorkoutExercise) {
        await workoutStore.setWorkouts(true);
      } else {
        await exerciseStore.setExercises(true);
      }
      emit('close');
    } else {
      console.error('Failed to remove exercise.');
    }
  } catch (error) {
    toast.error('Error in removeExerciseFromWorkout.', { progressBar: true, duration: 1000 });
    console.error('Error in removeExerciseFromWorkout:', error);
  }
};

const getSanitizedExerciseDataForWorkout = () => {
  if (!props.selectedExercise || !editExercise.value) return {};

  const original = {
        sets: props.selectedExercise.sets,
        reps: props.selectedExercise.reps,
        pauseSeconds: props.selectedExercise.pauseSeconds,
        order: props.selectedExercise.order,
        weight: props.selectedExercise.weight,
        exerciseId: Number(props.selectedExercise.exercise.id),
      }

  const edited = {
    sets: Number(editExercise.value.sets || 0),
    reps: Number(editExercise.value.reps || 0),
    pauseSeconds: Number(editExercise.value.pauseSeconds || 0),
    order: Number(editExercise.value.order || 0),
    weight: Number(editExercise.value.weight || 0),
    exerciseId: Number(editExercise.value.exerciseId || 0),
  };

  return Object.fromEntries(
    (Object.entries(edited) as [keyof typeof edited, number][]).filter(
      ([key, value]) => (original as Record<string, number>)[key as string] !== value
    )
  );
};

const updateExercise = async () => {
  try {
    isLoading.value = true;
    if (!editExercise.value) {
      toast.error('No exercise data to update.', { progressBar: true, duration: 1000 });
      return;
    }
    if (!props.workoutId) {
      toast.error('No workout ID provided.', { progressBar: true, duration: 1000 });
      return;
    }

    const workoutExercise = workoutStore.currentWorkout?.exercises.find(
      (ex) => ex.id === props.selectedExercise.id
    );

    if (!workoutExercise) {
      toast.error('Could not find the exercise in the workout.', { progressBar: true, duration: 1000 });
      return;
    }

    const response = await updateExerciseInWorkout(
      props.workoutId,
      workoutExercise.id,
      getSanitizedExerciseDataForWorkout() || {},
    );
    if (response) {
      toast.success('Exercise updated successfully!', { progressBar: true, duration: 1000 });
      await workoutStore.setWorkouts(true);
      emit('close');
    } else {
      toast.error('Failed to update exercise.', { progressBar: true, duration: 1000 });
    }
  } catch (error) {
    toast.error('Error in updateExercise.', { progressBar: true, duration: 1000 });
    console.error('Error in updateExercise:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
