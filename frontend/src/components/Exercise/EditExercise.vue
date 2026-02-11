<template>
  <div class="w-100 bg-grey-darken-4" style="height: 150vh">
    <BackHeader
      :show-menu="!props.hideMenu"
      :title="isViewExercise ? $t('exerciseForm.viewTitle') : $t('exerciseForm.editTitle')"
      @close="isViewExercise ? emit('close') : (isViewExercise = true)"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isViewExercise = false">
            <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isDeleteExerciseOpen = true">
            <v-list-item-title>{{ $t('common.delete') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div v-if="selectedExercise">
      <div v-if="selectedExercise?.image" class="exercise-image-container">
        <v-img :src="getImageUrl(selectedExercise.image)" height="200" cover />
      </div>
      <v-card v-else height="200" class="bg-white" />
      <div class="mx-5">
        <div class="py-4">
          <h1 class="text-h5 font-weight-bold">
            {{ selectedExercise?.name }}
          </h1>
          <p>
            {{ selectedExercise?.description }}
          </p>
          <div
            v-if="selectedExercise?.muscleGroups"
            class="d-flex ga-2 align-center mt-2 flex-wrap"
          >
            <v-chip
              v-for="group in selectedExercise.muscleGroups"
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
                <v-icon color="primary"> mdi-numeric </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultSets') }}:</span>
                <span class="ml-2">
                  {{ selectedExercise?.defaultSets || 0 }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary"> mdi-repeat </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultReps') }}:</span>
                <span class="ml-2">
                  {{ selectedExercise?.defaultReps || 0 }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon color="primary"> mdi-timer-outline </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">{{ $t('exerciseForm.defaultPause') }}:</span>
                <span class="ml-2">
                  {{ selectedExercise?.defaultPauseSeconds || 0 }}
                  {{ $t('units.sec') }}
                </span>
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item>
              <template #prepend>
                <v-icon color="grey"> mdi-calendar-plus </v-icon>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">{{ $t('common.createdAt') }}:</span>
                <span class="ml-2">
                  {{
                    selectedExercise?.createdAt
                      ? new Date(selectedExercise.createdAt).toLocaleDateString()
                      : ''
                  }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Compact Exercise History -->
          <div v-if="quickStats" class="mt-3">
            <v-divider class="mb-3" />
            <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
              {{ $t('statistics.personalRecords') }}
            </p>
            <div class="d-flex flex-wrap ga-2 mb-3">
              <v-chip
                v-if="quickStats.records.maxWeight"
                size="small"
                variant="tonal"
                color="amber"
              >
                <v-icon start size="12">mdi-trophy</v-icon>
                {{ quickStats.records.maxWeight.value }} kg
                {{ $t('statistics.records.maxWeight').toLowerCase() }}
              </v-chip>
              <v-chip
                v-if="quickStats.records.estimatedOneRepMax"
                size="small"
                variant="tonal"
                color="amber"
              >
                <v-icon start size="12">mdi-trophy</v-icon>
                {{ quickStats.records.estimatedOneRepMax.value }} kg
                {{ $t('statistics.records.estimated1RM') }}
              </v-chip>
              <v-chip v-if="quickStats.records.maxReps" size="small" variant="tonal" color="amber">
                <v-icon start size="12">mdi-trophy</v-icon>
                {{ quickStats.records.maxReps.value }}
                {{ $t('statistics.records.maxReps').toLowerCase() }}
              </v-chip>
            </div>

            <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
              {{ $t('statistics.recentSessions') }}
            </p>
            <div
              v-if="quickStats.recentHistory.length === 0"
              class="text-caption text-textSecondary mb-2"
            >
              {{ $t('statistics.noHistory') }}
            </div>
            <v-card
              v-for="(session, idx) in quickStats.recentHistory"
              :key="idx"
              class="bg-cardBg pa-2 px-3 rounded-lg mb-1"
              style="border: 1px solid #474747; box-shadow: none"
              density="compact"
            >
              <div class="d-flex align-center justify-space-between">
                <span class="text-caption">{{ formatDate(session.date) }}</span>
                <span class="text-caption text-textSecondary">
                  {{ session.sets.length }} {{ $t('statistics.sets') }} ·
                  {{ session.totalVolume }} kg
                </span>
              </div>
            </v-card>

            <v-btn
              variant="text"
              color="primary"
              size="small"
              class="mt-1 px-0"
              @click="navigateToStatistics"
            >
              {{ $t('statistics.viewFullHistory') }}
              <v-icon end size="14">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
        <div v-else>
          <v-btn class="w-100 my-4" color="primary" :loading="isLoading" @click="updateExercise">
            {{ $t('common.saveChanges') }}
          </v-btn>
          <v-form v-if="editExercise" class="py-4 d-flex ga-5 flex-column">
            <ImageUpload
              v-model="imageFile"
              :existing-image-url="
                selectedExercise?.image ? getImageUrl(selectedExercise.image) : null
              "
              :placeholder="$t('exerciseForm.changeImagePlaceholder')"
              :helper-text="$t('exerciseForm.changeImageHelper')"
            />

            <v-text-field
              v-model="editExercise.name"
              :label="$t('common.name')"
              type="string"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-model="editExercise.description"
              :label="$t('common.description')"
              type="string"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-select
              v-model="editExercise.muscleGroups"
              :items="muscleGroupStore.muscleGroups"
              :label="$t('exerciseForm.muscleGroupsLabel')"
              multiple
              variant="outlined"
              hide-details
              item-title="name"
              item-value="id"
              density="compact"
            />
            <v-text-field
              v-model="editExercise.defaultSets"
              :label="$t('exerciseForm.setsLabel')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-model="editExercise.defaultReps"
              :label="$t('exerciseForm.repsLabel')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
            <v-text-field
              v-model="editExercise.defaultPauseSeconds"
              :label="$t('exerciseForm.pauseSecondsLabel')"
              type="number"
              variant="outlined"
              hide-details
              density="compact"
            />
          </v-form>
        </div>
      </div>
    </div>
    <v-dialog v-model="isDeleteExerciseOpen" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('exerciseForm.deleteTitle') }}
        </v-card-title>
        <v-card-text>
          {{ $t('exerciseForm.deleteConfirm') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="isDeleteExerciseOpen = false">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn color="red" @click="removeExercise">
            {{ $t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import type { Exercise, UpdateExercise } from '@/interfaces/Exercise.interface'
import { useExerciseStore } from '@/stores/exercise.store'
import {
  updateExercise as updateExerciseInExercise,
  deleteExercise,
  uploadExerciseImage,
} from '@/services/exercise.service'
import { useMuscleGroupStore } from '@/stores/muscleGroup.store'
import { useStatisticsStore } from '@/stores/statistics.store'
import { toast } from 'vuetify-sonner'
import ImageUpload from '@/components/basicUI/ImageUpload.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{
  workoutId?: number
  selectedExercise: Exercise | null
  isViewExercise: boolean
  hideMenu?: boolean
}>()

const isViewExercise = ref(props.isViewExercise)
const muscleGroupStore = useMuscleGroupStore()
const exerciseStore = useExerciseStore()
const statisticsStore = useStatisticsStore()
const router = useRouter()
const isLoading = ref<boolean>(false)
const isDeleteExerciseOpen = ref<boolean>(false)
const imageFile = ref<File | null>(null)
const { t } = useI18n({ useScope: 'global' })

// Use a computed property that updates from the store after changes
const selectedExercise = computed(() => {
  // Find the exercise in the store to get the latest data
  const exerciseInStore = exerciseStore.exercises.find(ex => ex.id === props.selectedExercise?.id)
  return exerciseInStore || props.selectedExercise
})

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // Remove /v1 from API URL for static assets
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${imagePath}`
}

const editExercise = ref<UpdateExercise | null>(null)

// Watch for changes in selectedExercise and update editExercise
watch(
  () => selectedExercise.value,
  newExercise => {
    if (newExercise) {
      editExercise.value = {
        id: Number(newExercise.id || 0),
        name: newExercise.name || '',
        description: newExercise.description || '',
        image: newExercise.image || null,
        muscleGroups: newExercise.muscleGroups?.map(group => group.id) || [],
        defaultSets: newExercise.defaultSets || 0,
        defaultReps: newExercise.defaultReps || 0,
        defaultPauseSeconds: newExercise.defaultPauseSeconds || 0,
      }
    }
  },
  { immediate: true }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const removeExercise = async () => {
  try {
    if (!selectedExercise.value && !props.workoutId) {
      console.error('No exercise or workout ID provided.')
      return
    }

    let response = null

    response = await deleteExercise(selectedExercise.value?.id ?? 0)

    if (response) {
      toast.success(t('exercise.deleted'), { progressBar: true, duration: 1000 })
      await exerciseStore.setExercises(true)
      emit('close')
    } else {
      console.error('Failed to remove exercise.')
    }
  } catch (error) {
    console.error('Error in removeExerciseFromWorkout:', error)
    toast.error(t('exercise.removeError'), { progressBar: true, duration: 1000 })
  }
}

const getSanitizedExerciseData = () => {
  return {
    name: String(editExercise.value?.name || '').trim(),
    description: String(editExercise.value?.description || '').trim(),
    defaultSets: Number(editExercise.value?.defaultSets || 0),
    defaultReps: Number(editExercise.value?.defaultReps || 0),
    defaultPauseSeconds: Number(editExercise.value?.defaultPauseSeconds || 0),
    muscleGroupIds: editExercise.value?.muscleGroups?.map(id => Number(id)) || [],
  }
}

const updateExercise = async () => {
  try {
    isLoading.value = true
    if (!editExercise.value) {
      toast.error(t('exercise.updateNoData'))
      return
    }
    if (!selectedExercise.value) {
      toast.error(t('exercise.updateNoSelected'))
      return
    }
    const response = await updateExerciseInExercise(
      selectedExercise.value?.id,
      getSanitizedExerciseData() || {}
    )
    if (response) {
      // If there's a new image, upload it
      if (imageFile.value) {
        try {
          await uploadExerciseImage(selectedExercise.value.id, imageFile.value)
          imageFile.value = null
        } catch (imageError) {
          console.error('Error uploading image:', imageError)
          toast.warning(t('exercise.updatedImageUploadFailed'), {
            progressBar: true,
            duration: 1000,
          })
        }
      }

      toast.success(t('exercise.updated'), { progressBar: true, duration: 1000 })
      await exerciseStore.setExercises(true)
      isViewExercise.value = true
    } else {
      toast.error(t('exercise.failedToUpdate'), { progressBar: true, duration: 1000 })
    }
  } catch (error) {
    toast.error(t('exercise.updateError'), { progressBar: true, duration: 1000 })
    console.error('Error in updateExercise:', error)
  } finally {
    isLoading.value = false
  }
}

// Quick stats for compact history
const quickStats = computed(() => statisticsStore.exerciseQuickStats)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function navigateToStatistics() {
  router.push('/statistics')
}

// Load quick stats when exercise changes
watch(
  selectedExercise,
  ex => {
    if (ex?.id) {
      statisticsStore.fetchExerciseQuickStats(ex.id)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.exercise-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}
</style>
