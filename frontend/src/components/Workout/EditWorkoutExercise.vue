<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      :show-menu="true"
      :title="
        isViewExercise
          ? $t('exerciseForm.viewTitle')
          : $t('workoutExerciseForm.editInWorkoutTitle')
      "
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="removeExercise">
            <v-list-item-title>{{ $t('common.delete') }}</v-list-item-title>
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
              displayName
            }}
          </h1>
          <p>
            {{
              displayDescription
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
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultSets') }}:</span>
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
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultReps') }}:</span>
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
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultPause') }}:</span>
                <span class="ml-2">
                  {{
                    selectedExercise.pauseSeconds
                  }}
                  {{ $t('units.sec') }}
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
                <span class="font-weight-medium">{{ $t('common.createdAt') }}:</span>
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
                <span class="font-weight-medium">{{ $t('common.updatedAt') }}:</span>
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
            {{ $t('common.saveChanges') }}
          </v-btn>
          <v-form
            v-if="editExercise"
            class="pt-2 d-flex ga-5 flex-column"
          >
            <v-text-field
              v-model="editExercise.sets"
              :label="$t('exerciseForm.setsLabel')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-model="editExercise.reps"
              :label="$t('exerciseForm.repsLabel')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-if="isViewWorkoutExercise"
              v-model="editExercise.weight"
              :label="$t('workoutList.weightKg')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-model="editExercise.pauseSeconds"
              :label="$t('workoutList.pauseSeconds')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
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
import { useI18n } from 'vue-i18n';
import { displayExerciseName, displayExerciseDescription } from '@/utils/exerciseDisplay';

const props = defineProps<{
  workoutId?: number;
  selectedExercise: workoutExercise ;
  isViewExercise: boolean;
  isViewWorkoutExercise: boolean;
}>();

const isViewExercise = ref(props.isViewExercise);

const { t } = useI18n({ useScope: 'global' });

const displayName = computed(() =>
  displayExerciseName({ t }, {
    name: props.selectedExercise.exercise.name,
    i18nKey: props.selectedExercise.exercise.i18nKey,
    isNameCustom: props.selectedExercise.exercise.isNameCustom,
  }),
);

const displayDescription = computed(() =>
  displayExerciseDescription(
    { t },
    {
      description: props.selectedExercise.exercise.description,
      i18nKey: props.selectedExercise.exercise.i18nKey,
    },
    t('common.noDescription'),
  ),
);

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
      toast.success(t('exercise.removed'), { progressBar: true, duration: 1000 });
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
    toast.error(t('exercise.removeError'), { progressBar: true, duration: 1000 });
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
      toast.error(t('exercise.updateNoData'), { progressBar: true, duration: 1000 });
      return;
    }
    if (!props.workoutId) {
      toast.error(t('exercise.updateNoWorkoutId'), { progressBar: true, duration: 1000 });
      return;
    }

    const workoutExercise = workoutStore.currentWorkout?.exercises.find(
      (ex) => ex.id === props.selectedExercise.id
    );

    if (!workoutExercise) {
      toast.error(t('exercise.updateNotFoundInWorkout'), { progressBar: true, duration: 1000 });
      return;
    }

    const response = await updateExerciseInWorkout(
      props.workoutId,
      workoutExercise.id,
      getSanitizedExerciseDataForWorkout() || {},
    );
    if (response) {
      toast.success(t('exercise.updated'), { progressBar: true, duration: 1000 });
      await workoutStore.setWorkouts(true);
      emit('close');
    } else {
      toast.error(t('exercise.failedToUpdate'), { progressBar: true, duration: 1000 });
    }
  } catch (error) {
    toast.error(t('exercise.updateError'), { progressBar: true, duration: 1000 });
    console.error('Error in updateExercise:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
