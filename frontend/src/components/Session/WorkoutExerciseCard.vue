<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center pa-3">
      <h1 class="text-h5">{{ resolvedExercise?.name || 'Loading...' }}</h1>
      <div class="d-flex flex-row ga-3 align-center">
        <v-chip
          v-if="allSetsDone"
          color="green"
          prepend-icon="mdi-check-circle"
          size="small"
          variant="tonal"
        >
          Done
        </v-chip>
        <v-icon v-if="allSetsDone" @click="showDetails = !showDetails">
          {{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <v-icon v-if="!allSetsDone" @click="isTimerVisible = true"
          >mdi-timer-play-outline</v-icon
        >
        <v-icon v-if="!allSetsDone">mdi-dots-horizontal</v-icon>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="showDetails">
        <div
          class="d-flex flex-row ga-2 px-5 py-2 align-center bg-blue-darken-4"
        >
          <v-icon size="18" color="grey">mdi-lightbulb-outline</v-icon>
          <p class="text-subtitle-2 text-grey">
            {{ resolvedExercise?.description || 'No description available.' }}
          </p>
        </div>

        <v-data-table
          :headers="headers"
          :items="workoutSets"
          class="elevation-1 bg-transparent"
          hide-default-footer
          @click:row="handleRowClick"
        >
          <template v-slot:item.done="{ item }">
            <v-checkbox
              :model-value="item.done"
              @update:model-value="onDoneChanged(item, $event ?? false)"
              color="primary"
              hide-details
              class="ma-0 pa-0"
              @click.stop
            />
          </template>
        </v-data-table>
      </div>
    </v-expand-transition>

    <div class="px-5 py-2 d-flex" v-if="showDetails">
      <v-btn
        icon="mdi-plus"
        size="small"
        color="orange-darken-4"
        @click="addSet"
      ></v-btn>
    </div>

    <EditSetDialog
      v-if="isEditDialogVisible"
      v-model="isEditDialogVisible"
      :set="selectedSet"
      @save="saveSet"
      @delete="selectedSet && deleteSet(selectedSet)"
    />
    <TimerDialog
      v-model="isTimerVisible"
      :duration="props.exercise.pauseSeconds"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue';
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
});

const emit = defineEmits<{
  (e: 'update:set', payload: WorkoutSet): void;
  (e: 'delete:set', payload: WorkoutSet): void;
  (e: 'add:set'): void;
}>();

const resolvedExercise = computed(() => props.exercise.exercise);
const showDetails = ref(true);

const isEditDialogVisible = ref(false);
const isTimerVisible = ref(false);
const selectedSet = ref<WorkoutSet | null>(null);

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
  emit('update:set', editedSet);
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
