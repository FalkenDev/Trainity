<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      title="Add From Global Exercises"
      show-menu
      @close="saveAndClose"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>Create exercise</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div class="d-flex flex-row mx-2 ga-5 mb-3">
      <v-text-field
        v-model="searchQuery"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        label="Search exercises"
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
          Filter
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
                  Reset
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
                <v-list-item-title>{{ muscleGroup.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-badge>
    </div>

    <v-list
      v-if="filteredGlobalExercises.length > 0"
      class="flex-grow-1 overflow-y-auto pa-0 pb-5"
    >
      <v-list-item
        v-for="ex in filteredGlobalExercises"
        :key="ex.id"
        class="border-t-sm border-b-sm py-2"
        two-line
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-checkbox
              v-model="selectedGlobalIds"
              :value="ex.id"
              color="primary"
              hide-details
              density="compact"
            />
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ ex.defaultName }}
            </v-list-item-title>
          </div>
          <div>
            <v-icon
              color="grey-lighten-1"
              @click.stop="openInfo(ex)"
            >
              mdi-information-outline
            </v-icon>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <div
      v-else
      class="flex-grow-1 d-flex flex-column align-center mt-10 text-center px-6"
    >
      <v-icon
        size="48"
        color="grey-lighten-1"
      >
        mdi-dumbbell
      </v-icon>
      <h2 class="text-h6 mt-3 mb-1">
        No exercises found
      </h2>
      <p class="text-body-2 text-grey-lighten-1">
        Try adjusting your search or filter to find what you're looking for.
      </p>
      <v-btn
        class="mt-4"
        color="primary"
        @click="isCreateExerciseOpen = true"
      >
        Create Exercise
      </v-btn>
    </div>
  </div>

  <v-dialog
    v-model="isInfoOpen"
    max-width="600"
  >
    <v-card class="bg-grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">
        {{ infoExercise?.defaultName }}
      </v-card-title>
      <v-card-text class="text-body-2 text-grey-lighten-1">
        {{ infoExercise?.defaultDescription || 'No description' }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="isInfoOpen = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="isCreateExerciseOpen"
    fullscreen
  >
    <CreateExercise @close="isCreateExerciseOpen = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { GlobalExercise } from '@/interfaces/GlobalExercise.interface';
import { fetchAllGlobalExercises, importGlobalExercises } from '@/services/globalExercise.service';
import { useExerciseStore } from '@/stores/exercise.store';
import { useMuscleGroupStore } from '@/stores/muscleGroup.store';
import { toast } from 'vuetify-sonner';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', createdExerciseIds: number[]): void;
}>();

const muscleGroupStore = useMuscleGroupStore();
const exerciseStore = useExerciseStore();

const searchQuery = ref<string>('');
const selectedGlobalIds = ref<number[]>([]);
const selectedMuscleGroups = ref<number[]>([]);

const globalExercises = ref<GlobalExercise[]>([]);
const isCreateExerciseOpen = ref<boolean>(false);

const isInfoOpen = ref<boolean>(false);
const infoExercise = ref<GlobalExercise | null>(null);

const openInfo = (ex: GlobalExercise) => {
  infoExercise.value = ex;
  isInfoOpen.value = true;
};

onMounted(async () => {
  try {
    globalExercises.value = await fetchAllGlobalExercises();
  } catch (e) {
    toast.error('Failed to load global exercises', { progressBar: true, duration: 1000 });
    console.error(e);
  }
});

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    id: group.id,
  }));
});

const filteredGlobalExercises = computed<GlobalExercise[]>(() =>
  globalExercises.value.filter((ex) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      ex.defaultName.toLowerCase().includes(q) ||
      (ex.defaultDescription ?? '').toLowerCase().includes(q);

    const matchesMuscleGroup =
      selectedMuscleGroups.value.length === 0 ||
      ex.muscleGroups?.some((mg) => selectedMuscleGroups.value.includes(mg.id));

    return matchesSearch && matchesMuscleGroup;
  }),
);

const saveAndClose = async () => {
  try {
    if (selectedGlobalIds.value.length) {
      const created = await importGlobalExercises(selectedGlobalIds.value);
      await exerciseStore.setExercises(true);
      toast.success(
        created.length
          ? `${created.length} exercise(s) added to your account`
          : 'Nothing to add',
      );

      emit(
        'save',
        created
          .map((e) => e.id)
          .filter((id): id is number => typeof id === 'number'),
      );
    }
  } catch (e) {
    toast.error('Failed to add exercises', { progressBar: true, duration: 1000 });
    console.error(e);
  } finally {
    emit('close');
  }
};
</script>
