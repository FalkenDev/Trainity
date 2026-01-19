<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      :title="$t('settings.exercises')"
      show-menu
      :loading="isLoading"
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isAddGlobalExercisesOpen = true">
            <v-list-item-title>{{ $t('exerciseCatalog.addFromGlobalShort') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>{{ $t('exercise.createExercise') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>
    <div class="d-flex flex-row mx-2 ga-5 mb-3">
      <v-text-field
        v-model="searchQuery"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        :label="$t('exercise.searchExercises')"
        clearable
        hide-details
        density="compact"
      />
      <v-badge
        color="error"
        :content="selectedMuscleGroups.length"
        offset-x="0"
        offset-y="0"
      >
        <v-btn
          height="40"
          variant="outlined"
        >
          {{ $t('common.filter') }}
          <v-menu
            activator="parent"
            :close-on-content-click="false"
          >
            <v-list
              v-model:selected="selectedMuscleGroups"
              select-strategy="classic"
            >
              <v-list-item @click="selectedMuscleGroups = []">
                <v-list-item-title>
                  <v-icon
                    class="mr-2"
                    color="grey-lighten-1"
                  >
                    mdi-close
                  </v-icon>
                  {{ $t('common.reset') }}
                </v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item
                v-for="muscleGroup in muscleGroups"
                :key="muscleGroup.id"
                :value="muscleGroup.id"
              >
                <template #prepend="{ isActive }">
                  <v-list-item-action start>
                    <v-checkbox-btn :model-value="isActive" />
                  </v-list-item-action>
                </template>
                <v-list-item-title>
                  {{ muscleGroup.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-badge>
    </div>
    <v-list class="flex-grow-1 overflow-y-auto pa-0 pb-5">
      <v-list-item
        v-for="exercise in exercises"
        :key="exercise.id"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click.stop="openViewExercise(exercise)"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ displayName(exercise) }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon color="grey-lighten-1">
              mdi-chevron-right
            </v-icon>
          </div>
        </div>
      </v-list-item>
      <v-list-item
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="isCreateExerciseOpen = true"
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-list-item-title
              class="text-body-1 font-weight-bold text-grey-lighten-1"
            >
              {{ $t('exercise.createNewExercise') }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon color="grey-lighten-1">
              mdi-plus
            </v-icon>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </div>
  <v-dialog
    v-model="isCreateExerciseOpen"
    fullscreen
  >
    <CreateExercise @close="onCreateExerciseClose" />
  </v-dialog>
  <v-dialog
    v-model="isAddGlobalExercisesOpen"
    fullscreen
  >
    <AddGlobalExerciseList @close="isAddGlobalExercisesOpen = false" />
  </v-dialog>
  <v-dialog
    v-model="isViewExerciseOpen"
    fullscreen
  >
    <EditExercise
      :selected-exercise="viewExercise"
      :is-view-exercise="true"
      :is-view-workout-exercise="false"
      @close="onEditExerciseClose"
    />
  </v-dialog>
</template>
<script lang="ts" setup>
import type { Exercise } from '@/interfaces/Exercise.interface';
import type { MuscleGroup } from '@/interfaces/MuscleGroup.interface';
import { useExerciseStore } from '@/stores/exercise.store';
import { useMuscleGroupStore } from '@/stores/muscleGroup.store';
import { useI18n } from 'vue-i18n';
import { displayExerciseName } from '@/utils/exerciseDisplay';

const muscleGroupStore = useMuscleGroupStore();
const searchQuery = ref<string>('');
const exerciseStore = useExerciseStore();
const { t } = useI18n({ useScope: 'global' });
const isLoading = ref<boolean>(false);
const viewExercise = ref<Exercise | null>(null);
const isViewExerciseOpen = ref<boolean>(false);
const isCreateExerciseOpen = ref<boolean>(false);
const isAddGlobalExercisesOpen = ref<boolean>(false);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    id: group.id,
  }));
});

const selectedMuscleGroups = ref<number[]>([]);

const displayName = (exercise: Exercise) => displayExerciseName({ t }, exercise);

const openViewExercise = (exercise: Exercise) => {
  viewExercise.value = exercise;
  isViewExerciseOpen.value = true;
};

const onEditExerciseClose = async () => {
  isViewExerciseOpen.value = false;
  // Refresh exercises to get updated exercise details
  await exerciseStore.setExercises(true);
};

const onCreateExerciseClose = async () => {
  isCreateExerciseOpen.value = false;
  // Refresh exercises after creating new one
  await exerciseStore.setExercises(true);
};

const exercises = computed<Exercise[]>(() =>
  exerciseStore.exercises.filter((exercise: Exercise) => {
    const name = displayName(exercise).toLowerCase();
    const desc = (exercise.description ?? '').toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.value.toLowerCase()) ||
      desc.includes(searchQuery.value.toLowerCase());

    const matchesMuscleGroup =
      selectedMuscleGroups.value.length === 0 ||
      exercise.muscleGroups?.some((mg: MuscleGroup) =>
        selectedMuscleGroups.value.includes(mg.id),
      );

    return matchesSearch && matchesMuscleGroup;
  }),
);
</script>
