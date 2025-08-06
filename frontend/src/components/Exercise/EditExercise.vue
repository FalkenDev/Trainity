<template>
  <div
    class="w-100 bg-grey-darken-4"
    style="height: 150vh;"
  >
    <BackHeader
      :show-menu="true"
      :title="
        isViewExercise
          ? 'Exercise'
          : 'Edit Exercise'
      "
      @close="isViewExercise ? emit('close') : isViewExercise = true"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isViewExercise = false">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isDeleteExerciseOpen = true">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div
      v-if="selectedExercise"
    >
      <v-card
        height="200"
        class="bg-white"
      />
      <div class="mx-5">
        <div class="py-4">
          <h1 class="text-h5 font-weight-bold">
            {{ selectedExercise.name }}
          </h1>
          <p>
            {{ selectedExercise.description }}
          </p>
          <div
            v-if="props.selectedExercise?.muscleGroups"
            class="d-flex ga-2 align-center mt-2 flex-wrap"
          >
            <v-chip
              v-for="group in props.selectedExercise.muscleGroups"
              :key="group.id"
              color="green-lighten-1"
              label
            >
              {{ group.name }}
            </v-chip>
          </div>
        </div>
        <v-divider />
        <div
          v-if="isViewExercise"
        >
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
                  {{ selectedExercise.defaultSets || 0 }}
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
                  {{ selectedExercise.defaultReps || 0 }}
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
                  {{ selectedExercise.defaultPauseSeconds || 0 }}
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
                      selectedExercise.createdAt,
                    ).toLocaleDateString()
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <div
          v-else
        >
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
            class="py-4 d-flex ga-5 flex-column"
          >
            <v-text-field
              v-model="editExercise.name"
              label="Name"
              type="string"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-model="editExercise.description"
              label="Description"
              type="string"
              variant="outlined"
              hide-details
            />
            <v-select
              v-model="editExercise.muscleGroups"
              :items="muscleGroupStore.muscleGroups"
              label="Muscle Groups"
              multiple
              variant="outlined"
              hide-details
              item-title="name"
              item-value="id"
            />
            <v-text-field
              v-model="editExercise.defaultSets"
              label="Sets"
              type="number"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-model="editExercise.defaultReps"
              label="Reps"
              type="number"
              variant="outlined"
              hide-details
            />
            <v-text-field
              v-model="editExercise.defaultPauseSeconds"
              label="Pause (seconds)"
              type="number"
              variant="outlined"
              hide-details
            />
          </v-form>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="isDeleteExerciseOpen"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6">
          Delete Exercise
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this exercise?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            @click="isDeleteExerciseOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            @click="removeExercise"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import type { Exercise, UpdateExercise } from '@/interfaces/Exercise.interface';
import { useExerciseStore } from '@/stores/exercise.store';
import {
  updateExercise as updateExerciseInExercise,
  deleteExercise,
} from '@/services/exercise.service';
import { useMuscleGroupStore } from '@/stores/muscleGroup.store';
import { toast } from 'vuetify-sonner';

const props = defineProps<{
  workoutId?: number;
  selectedExercise: Exercise | null;
  isViewExercise: boolean;
}>();

const isViewExercise = ref(props.isViewExercise);
const muscleGroupStore = useMuscleGroupStore();
const exerciseStore = useExerciseStore();
const isLoading = ref<boolean>(false);
const isDeleteExerciseOpen = ref<boolean>(false);

const editExercise = ref<UpdateExercise | null>({
  id:  Number(props.selectedExercise?.id || 0),
  name: props.selectedExercise?.name || '',
  description: props.selectedExercise?.description || '',
  image: props.selectedExercise?.image || null,
  muscleGroups: props.selectedExercise?.muscleGroups?.map((group) => group.id) || [],
  defaultSets: props.selectedExercise?.defaultSets || 0,
  defaultReps:props.selectedExercise?.defaultReps || 0,
  defaultPauseSeconds:  props.selectedExercise?.defaultPauseSeconds || 0,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const removeExercise = async () => {
  try {
    if (!props.selectedExercise && !props.workoutId) {
      console.error('No exercise or workout ID provided.');
      return;
    }

    let response = null;

    response = await deleteExercise(props.selectedExercise?.id ?? 0);
    
    if (response) {
      toast.success('Exercise removed successfully!', { progressBar: true });
        await exerciseStore.setExercises(true);
      emit('close');
    } else {
      console.error('Failed to remove exercise.');
    }
  } catch (error) {
    console.error('Error in removeExerciseFromWorkout:', error);
  }
};

const getSanitizedExerciseData = () => {
  return {
    name: String(editExercise.value?.name || '').trim(),
    description: String(editExercise.value?.description || '').trim(),
    defaultSets: Number(editExercise.value?.defaultSets || 0),
    defaultReps: Number(editExercise.value?.defaultReps || 0),
    defaultPauseSeconds: Number(editExercise.value?.defaultPauseSeconds || 0),
    muscleGroupIds: editExercise.value?.muscleGroups?.map((id) => Number(id)) || [],
  };
};

const updateExercise = async () => {
    try {
      isLoading.value = true;
      if (!editExercise.value) {
        toast.error('No exercise data to update.');
        return;
      }
      if (!props.selectedExercise) {
        toast.error('No selected exercise to update.');
        return;
      }
      const response = await updateExerciseInExercise(
        props.selectedExercise?.id,
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
</script>
