<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      :title="$t('exerciseCatalog.addFromGlobal')"
      show-menu
      @close="saveAndClose"
    >
      <template #menuAppend>
        <v-list>
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
              {{ displayName(ex) }}
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
        {{ $t('exerciseCatalog.noExercisesFound') }}
      </h2>
      <p class="text-body-2 text-grey-lighten-1">
        {{ $t('exerciseCatalog.adjustSearch') }}
      </p>
      <v-btn
        class="mt-4"
        color="primary"
        @click="isCreateExerciseOpen = true"
      >
        {{ $t('exercise.createExercise') }}
      </v-btn>
    </div>
  </div>

  <v-dialog
    v-model="isInfoOpen"
    max-width="600"
  >
    <v-card class="bg-grey-darken-4">
      <v-card-title class="text-body-1 font-weight-bold">
        {{ infoExercise ? displayName(infoExercise) : '' }}
      </v-card-title>
      <v-card-text class="text-body-2 text-grey-lighten-1">
        {{ infoExercise ? displayDescription(infoExercise) : '' }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="isInfoOpen = false"
        >
          {{ $t('common.close') }}
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
import { useI18n } from 'vue-i18n';
import { displayGlobalExerciseDescription, displayGlobalExerciseName } from '@/utils/exerciseDisplay';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', createdExerciseIds: number[]): void;
}>();

const muscleGroupStore = useMuscleGroupStore();
const exerciseStore = useExerciseStore();
const { t } = useI18n({ useScope: 'global' });

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
    toast.error(t('exercise.failedToLoadGlobal'), { progressBar: true, duration: 1000 });
    console.error(e);
  }
});

const displayName = (ex: GlobalExercise) => displayGlobalExerciseName({ t }, ex);
const displayDescription = (ex: GlobalExercise) =>
  displayGlobalExerciseDescription({ t }, ex, t('exerciseCatalog.noDescription'));

const muscleGroups = computed(() => {
  return muscleGroupStore.muscleGroups.map((group) => ({
    name: group.name,
    id: group.id,
  }));
});

const filteredGlobalExercises = computed<GlobalExercise[]>(() =>
  globalExercises.value.filter((ex) => {
    const q = searchQuery.value.toLowerCase();
    const name = displayName(ex).toLowerCase();
    const desc = displayDescription(ex).toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q);

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
          ? t('exerciseCatalog.addedToAccount', { count: created.length })
          : t('exerciseCatalog.nothingToAdd'),
      );

      emit(
        'save',
        created
          .map((e) => e.id)
          .filter((id): id is number => typeof id === 'number'),
      );
    }
  } catch (e) {
    toast.error(t('exercise.failedToAdd'), { progressBar: true, duration: 1000 });
    console.error(e);
  } finally {
    emit('close');
  }
};
</script>
