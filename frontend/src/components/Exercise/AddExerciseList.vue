<template>
  <div class="d-flex flex-column fill-height bg-background">
    <BackHeader :title="$t('exercise.addExercises')" show-menu @close="saveAndClose">
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isCreateExerciseOpen = true">
            <v-list-item-title>{{ $t('exercise.createExercise') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div class="mx-5 mt-2 mb-3">
      <v-text-field
        v-model="searchQuery"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        :label="$t('exercise.searchExercises')"
        clearable
        hide-details
        density="compact"
      >
        <template #append-inner>
          <v-badge
            :model-value="activeFilterCount > 0"
            color="error"
            :content="activeFilterCount"
            floating
            offset-x="-2"
            offset-y="-2"
          >
            <v-icon class="cursor-pointer" @click.stop="isFilterMenuOpen = !isFilterMenuOpen">
              mdi-filter-variant
            </v-icon>
          </v-badge>
          <v-menu
            v-model="isFilterMenuOpen"
            :close-on-content-click="false"
            location="bottom end"
            activator="parent"
          >
            <v-card class="bg-cardBg pa-3" style="border: 1px solid #474747; min-width: 220px">
              <div class="d-flex justify-space-between align-center mb-2">
                <p class="text-body-2 font-weight-bold">{{ $t('common.filter') }}</p>
                <v-btn variant="text" size="small" color="textSecondary" @click="resetFilters">
                  {{ $t('common.reset') }}
                </v-btn>
              </div>

              <p class="text-caption text-textSecondary mb-1">
                {{ $t('exerciseForm.muscleGroupsLabel') }}
              </p>
              <v-chip-group
                v-model="selectedMuscleGroups"
                multiple
                column
                selected-class="text-primary"
              >
                <v-chip
                  v-for="mg in muscleGroups"
                  :key="mg.id"
                  :value="mg.id"
                  variant="outlined"
                  size="small"
                  filter
                >
                  {{ mg.name }}
                </v-chip>
              </v-chip-group>

              <p class="text-caption text-textSecondary mt-3 mb-1">
                {{ $t('exerciseForm.exerciseTypeLabel') }}
              </p>
              <v-chip-group v-model="selectedTypes" multiple column selected-class="text-primary">
                <v-chip value="compound" variant="outlined" size="small" filter>Compound</v-chip>
                <v-chip value="isolation" variant="outlined" size="small" filter>Isolation</v-chip>
                <v-chip value="bodyweight" variant="outlined" size="small" filter
                  >Bodyweight</v-chip
                >
              </v-chip-group>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </div>

    <v-list
      v-if="exercises && exercises.length > 0"
      class="flex-grow-1 overflow-y-auto pa-0 pb-5 bg-background"
    >
      <v-list-item
        v-for="exercise in exercises"
        :key="exercise.id"
        class="border-t-sm border-b-sm py-2"
        two-line
      >
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-3">
            <v-checkbox
              v-model="selectedIds"
              :value="exercise.id"
              color="primary"
              hide-details
              density="compact"
            />
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ displayName(exercise) }}
            </v-list-item-title>
          </div>
          <v-icon color="grey-lighten-1" @click.stop="openViewExercise(exercise)">
            mdi-information-outline
          </v-icon>
        </div>
      </v-list-item>
    </v-list>

    <div v-else class="flex-grow-1 d-flex flex-column align-center mt-10 text-center px-6">
      <v-icon size="48" color="grey-lighten-1">mdi-dumbbell</v-icon>
      <h2 class="text-h6 mt-3 mb-1">{{ $t('exerciseCatalog.noExercisesFound') }}</h2>
      <p class="text-body-2 text-grey-lighten-1">{{ $t('exerciseCatalog.adjustSearch') }}</p>
      <v-btn class="mt-4" color="primary" @click="isCreateExerciseOpen = true">
        {{ $t('exercise.createExercise') }}
      </v-btn>
    </div>
  </div>

  <v-dialog v-model="isViewExerciseOpen" fullscreen>
    <ExerciseDetails
      :selected-exercise="viewExercise"
      :is-view-exercise="true"
      hide-menu
      @close="isViewExerciseOpen = false"
    />
  </v-dialog>
  <v-dialog v-model="isCreateExerciseOpen" fullscreen>
    <CreateExercise @close="onCreateExerciseClose" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Exercise } from '@/interfaces/Exercise.interface'
import type { MuscleGroup } from '@/interfaces/MuscleGroup.interface'
import { useExerciseStore } from '@/stores/exercise.store'
import { useMuscleGroupStore } from '@/stores/muscleGroup.store'
import { useI18n } from 'vue-i18n'
import { displayExerciseName } from '@/utils/exerciseDisplay'

const props = defineProps<{
  initialSelectedIds: number[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', selectedIds: number[]): void
}>()

const muscleGroupStore = useMuscleGroupStore()
const exerciseStore = useExerciseStore()
const { t } = useI18n({ useScope: 'global' })

const searchQuery = ref('')
const selectedIds = ref<number[]>([...props.initialSelectedIds])
const viewExercise = ref<Exercise | null>(null)
const isViewExerciseOpen = ref(false)
const isCreateExerciseOpen = ref(false)
const isFilterMenuOpen = ref(false)
const selectedMuscleGroups = ref<number[]>([])
const selectedTypes = ref<string[]>([])

const displayName = (exercise: Exercise) => displayExerciseName({ t }, exercise)

const activeFilterCount = computed(
  () => selectedMuscleGroups.value.length + selectedTypes.value.length
)

const resetFilters = () => {
  selectedMuscleGroups.value = []
  selectedTypes.value = []
}

const openViewExercise = (exercise: Exercise) => {
  viewExercise.value = exercise
  isViewExerciseOpen.value = true
}

const muscleGroups = computed(() =>
  muscleGroupStore.muscleGroups.map(g => ({ name: g.name, id: g.id }))
)

const exercises = computed<Exercise[]>(() =>
  exerciseStore.exercises.filter((exercise: Exercise) => {
    const name = displayName(exercise).toLowerCase()
    const desc = (exercise.description ?? '').toLowerCase()
    const query = (searchQuery.value || '').toLowerCase()
    const matchesSearch = name.includes(query) || desc.includes(query)

    const matchesMuscleGroup =
      selectedMuscleGroups.value.length === 0 ||
      exercise.muscleGroups?.some((mg: MuscleGroup) => selectedMuscleGroups.value.includes(mg.id))

    const matchesType =
      selectedTypes.value.length === 0 ||
      (exercise.exerciseType && selectedTypes.value.includes(exercise.exerciseType))

    return matchesSearch && matchesMuscleGroup && matchesType
  })
)

const onCreateExerciseClose = async () => {
  isCreateExerciseOpen.value = false
  await exerciseStore.setExercises(true)
}

const saveAndClose = () => {
  emit('save', selectedIds.value)
  emit('close')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
