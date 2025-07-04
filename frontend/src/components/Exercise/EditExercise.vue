<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      :show-menu="true"
      :title="
        isViewExercise
          ? 'Exercise'
          : isViewWorkoutExercise
            ? 'Edit Exercise in workout'
            : 'Edit Exercise'
      "
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isViewExercise = false">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
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
              isWorkoutExercise(selectedExercise)
                ? selectedExercise.exercise.name
                : selectedExercise.name
            }}
          </h1>
          <p>
            {{
              isWorkoutExercise(selectedExercise)
                ? selectedExercise.exercise.description
                : selectedExercise.description
            }}
          </p>
          <div class="d-flex ga-2 align-center mt-2 flex-wrap">
            <v-chip
              v-for="group in getMuscleGroupsForExercise()"
              :key="group"
              color="green-lighten-1"
              label
            >
              {{ group }}
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
                    isWorkoutExercise(selectedExercise)
                      ? selectedExercise.sets
                      : selectedExercise.defaultSets || 0
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
                    isWorkoutExercise(selectedExercise)
                      ? selectedExercise.reps
                      : selectedExercise.defaultReps || 0
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
                    isWorkoutExercise(selectedExercise)
                      ? selectedExercise.pauseSeconds
                      : selectedExercise.defaultPauseSeconds || 0
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
                    isWorkoutExercise(selectedExercise)
                      ? new Date(
                        selectedExercise.exercise.createdAt,
                      ).toLocaleDateString()
                      : new Date(
                        selectedExercise.createdAt,
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
                    isWorkoutExercise(selectedExercise)
                      ? new Date(
                        selectedExercise.exercise.updatedAt,
                      ).toLocaleDateString()
                      : new Date(
                        selectedExercise.updatedAt,
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
import type { Exercise } from '@/interfaces/Exercise.interface';
import type { MuscleGroup } from '@/interfaces/MuscleGroup.interface';
import type { AddExerciseToWorkout } from '@/interfaces/Workout.interface';
import { useMuscleGroupStore } from '@/stores/muscleGroup.store';
import { useExerciseStore } from '@/stores/exercise.store';
import {
  updateExerciseInWorkout,
  removeExerciseFromWorkout,
} from '@/services/workout.service';
import {
  updateExercise as updateExerciseInExercise,
  deleteExercise,
} from '@/services/exercise.service';
import { useWorkoutStore } from '@/stores/workout.store';
import { toast } from 'vuetify-sonner';

const props = defineProps<{
  workoutId?: string;
  selectedExercise: workoutExercise | Exercise | null;
  isViewExercise: boolean;
  isViewWorkoutExercise: boolean;
}>();

const isViewExercise = ref(props.isViewExercise);

const exerciseStore = useExerciseStore();
const workoutStore = useWorkoutStore();
const muscleGroupStore = useMuscleGroupStore();
const isLoading = ref<boolean>(false);

const editExercise = ref<AddExerciseToWorkout | null>({
  exerciseId: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise.exercise._id
    : props.selectedExercise?._id || '',
  sets: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise.sets
    : props.selectedExercise?.defaultSets || 0,
  reps: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise.reps
    : props.selectedExercise?.defaultReps || 0,
  pauseSeconds: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise?.pauseSeconds
    : props.selectedExercise?.defaultPauseSeconds || 0,
  order: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise?.order
    : 0,
  weight: isWorkoutExercise(props.selectedExercise)
    ? props.selectedExercise?.weight
    : 0,
});

function isWorkoutExercise(
  exercise: workoutExercise | Exercise | null,
): exercise is workoutExercise {
  return !!exercise && 'exercise' in exercise;
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const getMuscleGroupsForExercise = (): string[] => {
  if (!props.selectedExercise) {
    return [];
  }

  const muscleGroup = muscleGroupStore.muscleGroups as MuscleGroup[];
  if (isWorkoutExercise(props.selectedExercise)) {
    return props.selectedExercise.exercise.muscleGroups
      .map(
        (groupId) => muscleGroup.find((group) => group._id === groupId)?.name,
      )
      .filter((name): name is string => !!name);
  }
  return [];
};

const removeExercise = async () => {
  try {
    if (!props.selectedExercise || props.isViewWorkoutExercise && !props.workoutId) {
      console.error('No exercise or workout ID provided.');
      return;
    }

    let response = null;
    if (props.isViewWorkoutExercise) {
      response = await removeExerciseFromWorkout(
        props.workoutId || '',
        isWorkoutExercise(props.selectedExercise)
          ? props.selectedExercise.exercise._id
          : '',
      );
    } else {
      response = await deleteExercise(
        isWorkoutExercise(props.selectedExercise)
          ? props.selectedExercise.exercise._id
          : props.selectedExercise?._id || '',
      );
    }

    if (response) {
      toast.success('Exercise removed successfully!', { progressBar: true });
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
    console.error('Error in removeExerciseFromWorkout:', error);
  }
};

const getSanitizedExerciseDataForWorkout = () => {
  return {
    ...editExercise.value,
    sets: Number(editExercise.value?.sets || 0),
    reps: Number(editExercise.value?.reps || 0),
    pauseSeconds: Number(editExercise.value?.pauseSeconds || 0),
    order: Number(editExercise.value?.order || 0),
    weight: Number(editExercise.value?.weight || 0),
    exerciseId: editExercise.value?.exerciseId || '',
  };
};

const getSanitizedExerciseData = () => {
  return {
    ...editExercise.value,
    name: isWorkoutExercise(props.selectedExercise)
      ? props.selectedExercise.exercise.name
      : props.selectedExercise?.name || '',
    description: isWorkoutExercise(props.selectedExercise)
      ? props.selectedExercise.exercise.description
      : props.selectedExercise?.description || '',
    defaultSets: Number(editExercise.value?.sets || 0),
    defaultReps: Number(editExercise.value?.reps || 0),
    defaultPauseSeconds: Number(editExercise.value?.pauseSeconds || 0),
    muscleGroups: isWorkoutExercise(props.selectedExercise)
      ? props.selectedExercise.exercise.muscleGroups
      : props.selectedExercise?.muscleGroups || [],
  };
};

const updateExercise = async () => {
  if (props.isViewWorkoutExercise) {
    try {
      isLoading.value = true;
      if (!editExercise.value) {
        toast.error('No exercise data to update.');
        return;
      }
      if (!props.workoutId) {
        toast.error('No workout ID provided.');
        return;
      }
      const response = await updateExerciseInWorkout(
        props.workoutId,
        isWorkoutExercise(props.selectedExercise)
          ? props.selectedExercise.exercise._id
          : '',
        getSanitizedExerciseDataForWorkout() || {},
      );
      if (response) {
        toast.success('Exercise updated successfully!', { progressBar: true });
        await workoutStore.setWorkouts(true);
        emit('close');
      } else {
        toast.error('Failed to update exercise.');
      }
    } catch (error) {
      toast.error('Error in updateExercise.');
      console.error('Error in updateExercise:', error);
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      isLoading.value = true;
      if (!editExercise.value) {
        toast.error('No exercise data to update.');
        return;
      }
      const response = await updateExerciseInExercise(
        isWorkoutExercise(props.selectedExercise)
          ? props.selectedExercise.exercise._id
          : props.selectedExercise?._id || '',
        getSanitizedExerciseData() || {},
      );
      if (response) {
        toast.success('Exercise updated successfully!', { progressBar: true });
        await exerciseStore.setExercises(true);
        isViewExercise.value = true;
      } else {
        toast.error('Failed to update exercise.');
      }
    } catch (error) {
      toast.error('Error in updateExercise.');
      console.error('Error in updateExercise:', error);
    } finally {
      isLoading.value = false;
    }
  }
};
</script>
