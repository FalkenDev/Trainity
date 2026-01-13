<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center pa-3">
      <h1 class="text-h5">
        {{ resolvedExercise?.name || 'Loading...' }}
      </h1>
      <div class="d-flex flex-row ga-5 align-center">
        <v-chip
          v-if="allSetsDone"
          color="green"
          prepend-icon="mdi-check-circle"
          size="small"
          variant="tonal"
        >
          Done
        </v-chip>
        <v-icon
          v-if="allSetsDone"
          @click="showDetails = !showDetails"
        >
          {{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <v-icon
          v-if="!allSetsDone"
          @click="isTimerVisible = true"
        >
          mdi-timer-play-outline
        </v-icon>
        <v-menu
          offset-y
          transition="slide-y-transition"
        >
          <template #activator="{ props: activatorProps }">
            <v-icon v-bind="activatorProps">
              mdi-dots-horizontal
            </v-icon>
          </template>
          <v-list>
            <v-list-item disabled>
              <v-list-item-title>Exercise details</v-list-item-title>
            </v-list-item>
            <v-list-item @click="addSet">
              <v-list-item-title>Add Set</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete:exercise', resolvedExercise)">
              <v-list-item-title>Delete Exercise</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="showDetails">
        <div
          class="d-flex flex-row ga-2 px-5 py-2 align-center bg-blue-darken-4"
        >
          <v-icon
            size="18"
            color="grey"
          >
            mdi-lightbulb-outline
          </v-icon>
          <p class="text-subtitle-2 text-grey">
            {{ resolvedExercise?.description || 'No description available.' }}
          </p>
        </div>

        <v-data-table
          :headers="headers"
          :items="workoutSets"
          class="elevation-1 bg-transparent border-b"
          hide-default-footer
          @click:row="handleRowClick"
        >
          <!-- eslint-disable-next-line -->
          <template #['item.done']="{ item }"> 
            <v-checkbox
              :model-value="item.done"
              color="primary"
              hide-details
              class="ma-0 pa-0"
              @update:model-value="onDoneChanged(item, $event ?? false)"
              @click.stop
            />
          </template>
        </v-data-table>
        <div
          v-if="props.showRpe"
          class="pa-4 pt-2 d-flex flex-column ga-3 bg-grey-darken-4"
        >
          <span class="text-body-2 text-grey">RPE (Rate of Perceived Exertion)</span>

          <v-chip-group
            :model-value="props.rpe ?? 8"
            mandatory
            class="d-flex flex-wrap justify-space-between "
            @update:model-value="$emit('update:rpe', $event)"
          >
            <v-chip
              v-for="value in [0, 4, 6, 8, 9, 10]"
              :key="value"
              :value="value"
              size="large"
              filter
              label
              class="flex-grow-1 text-center justify-center ma-0 mx-1"
              :color="(props.rpe ?? 8) === value ? 'primary' : 'grey-darken-2'"
              variant="tonal"
            >
              {{ value }}
            </v-chip>
          </v-chip-group>
          <!-- TODO: Disable for now (Not working yet, and still don't know how i want it)-->
          <!-- <v-text-field
            label="Exercise Notes"
            :model-value="props.notes"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="$emit('update:notes', $event)"
          /> -->
        </div>
      </div>
    </v-expand-transition>

    <EditSetDialog
      v-if="isEditDialogVisible"
      v-model="isEditDialogVisible"
      :set="selectedSet"
      @save="saveSet"
      @delete="selectedSet && deleteSet(selectedSet)"
    />

    <v-dialog
      v-model="showPropagateDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title>Update subsequent sets?</v-card-title>
        <v-card-text>
          Do you want to update sets {{ propagateSetsIndices }} with {{ propagateWeight }}kg and {{ propagateReps }} reps?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="confirmPropagate(false)"
          >
            No, just this one
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="confirmPropagate(true)"
          >
            Yes, update all
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <TimerDialog
      v-model="isTimerVisible"
      :duration="props.exercise.pauseSeconds"
    />
  </div>
</template>

<script lang="ts" setup>
// TODO: Add functionality to view exercise details
// TODO: Maybe have a info icon that shows exercise details in a dialog instead of a dropdown

import type {
  Exercise as ExerciseProp,
  WorkoutSet,
} from '@/interfaces/Workout.interface';

const props = defineProps({
  exercise: {
    type: Object as PropType<ExerciseProp>,
    required: true,
  },
  workoutSets: {
    type: Array as PropType<WorkoutSet[]>,
    required: true,
  },
  rpe: {
    type: Number,
    default: undefined,
  },
  notes: {
    type: String,
    default: '',
  },
  showRpe: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: 'update:set', payload: WorkoutSet): void;
  (e: 'delete:set', payload: WorkoutSet): void;
  (e: 'add:set'): void;
  (e: 'update:rpe', value: number): void;
  (e: 'update:notes', value: string): void;
  (e: 'delete:exercise', payload: ExerciseProp['exercise']): void;
}>();

const resolvedExercise = computed(() => props.exercise.exercise);
const showDetails = ref(true);

const isEditDialogVisible = ref(false);
const isTimerVisible = ref(false);
const selectedSet = ref<WorkoutSet | null>(null);

const showPropagateDialog = ref(false);
const pendingEditedSet = ref<WorkoutSet | null>(null);

const propagateWeight = computed(() => pendingEditedSet.value?.weight);
const propagateReps = computed(() => pendingEditedSet.value?.reps);

const propagateSetsIndices = computed(() => {
  if (!pendingEditedSet.value) return '';
  const indices = props.workoutSets
    .filter((s) => s.set > pendingEditedSet.value!.set && !s.done)
    .map((s) => s.set);

  if (indices.length === 0) return '';
  if (indices.length === 1) return indices[0].toString();
  const last = indices.pop();
  return indices.join(', ') + ' and ' + last;
});

const headers = [
  { title: 'Set', key: 'set', sortable: false, width: '20%' },
  { title: 'Previous', key: 'previous', sortable: false, width: '30%' },
  { title: 'Weight (kg)', key: 'weight', sortable: false, width: '25%' },
  { title: 'Reps', key: 'reps', sortable: false, width: '15%' },
  { title: 'Done', key: 'done', sortable: false, width: '10%' },
];

const allSetsDone = computed(() => {
  if (!props.workoutSets || props.workoutSets.length === 0) return false;
  return props.workoutSets.every((set) => set.done);
});

watch(allSetsDone, (isCompleted) => {
  if (isCompleted) {
    showDetails.value = false;
  }
});

function handleRowClick(event: Event, { item }: { item: WorkoutSet }) {
  selectedSet.value = { ...item };
  isEditDialogVisible.value = true;
}

function saveSet(editedSet: WorkoutSet) {
  const originalSet = props.workoutSets.find((s) => s.set === editedSet.set);
  const changed =
    originalSet &&
    (originalSet.weight !== editedSet.weight ||
      originalSet.reps !== editedSet.reps);

  const subsequentSets = props.workoutSets.filter(
    (s) => s.set > editedSet.set && !s.done
  );

  if (changed && subsequentSets.length > 0) {
    pendingEditedSet.value = editedSet;
    showPropagateDialog.value = true;
  } else {
    emit('update:set', editedSet);
  }
}

function confirmPropagate(shouldPropagate: boolean) {
  if (pendingEditedSet.value) {
    emit('update:set', pendingEditedSet.value);

    if (shouldPropagate) {
      const { weight, reps, set: currentSetNum } = pendingEditedSet.value;
      const subsequentSets = props.workoutSets.filter(
        (s) => s.set > currentSetNum && !s.done
      );

      subsequentSets.forEach((s) => {
        emit('update:set', {
          ...s,
          weight,
          reps,
        });
      });
    }
  }

  showPropagateDialog.value = false;
  pendingEditedSet.value = null;
}

function deleteSet(setToDelete: WorkoutSet) {
  emit('delete:set', setToDelete);
}

function addSet() {
  emit('add:set');
}

function onDoneChanged(set: WorkoutSet, isDone: boolean) {
  emit('update:set', { ...set, done: isDone });
}

watch(
  allSetsDone,
  (isCompleted) => {
    if (isCompleted) {
      showDetails.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.v-data-table :deep(tbody tr:hover) {
  cursor: pointer;
}
.v-data-table .v-checkbox {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
