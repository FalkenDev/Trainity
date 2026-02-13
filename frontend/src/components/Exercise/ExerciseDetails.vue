<template>
  <div
    class="w-100 fill-height bg-background overflow-y-auto pb-5"
    style="
      background: linear-gradient(135deg, rgba(171, 255, 26, 0.15) 0%, rgba(12, 14, 18, 0) 35%);
      min-height: 100vh;
    "
  >
    <div class="d-flex justify-space-between mx-5 py-5">
      <v-icon class="cursor-pointer" @click="emit('close')">mdi-arrow-left</v-icon>
      <div v-if="!hideMenu" class="d-flex ga-4">
        <v-menu>
          <template #activator="{ props: menuProps }">
            <v-icon v-bind="menuProps">mdi-menu</v-icon>
          </template>
          <v-list class="bg-cardBg mt-2 mr-2" width="100" style="border: 1px solid #474747">
            <v-list-item @click="isEditOpen = true">
              <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="isDeleteDialogOpen = true">
              <v-list-item-title>{{ $t('common.delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-avatar size="70" tile color="avatarBg" class="mx-5 mb-3 rounded-lg">
      <v-icon color="primary" size="35">mdi-dumbbell</v-icon>
    </v-avatar>

    <div class="mx-5 d-flex flex-column ga-4">
      <!-- Title & Type -->
      <div class="pt-4">
        <p v-if="exercise.exerciseType" class="text-primary text-body-1 text-capitalize">
          {{ exercise.exerciseType }}
        </p>
        <h1 class="text-h5 font-weight-bold">{{ exercise.name }}</h1>
      </div>

      <!-- Primary Muscle Card -->
      <div v-if="primaryMuscleName" class="d-flex ga-3">
        <v-card
          class="w-100 text-center pa-4 rounded-lg bg-cardBg"
          style="border: 1px solid #474747; box-shadow: none"
        >
          <v-icon color="primary" size="24">mdi-target</v-icon>
          <h1 class="text-body-1 text-textPrimary mt-2">{{ primaryMuscleName }}</h1>
          <p class="text-textSecondary text-body-2">{{ $t('exerciseDetails.primary') }}</p>
        </v-card>
      </div>

      <!-- About -->
      <div v-if="exercise.description">
        <h1 class="text-h6">{{ $t('exerciseDetails.about') }}</h1>
        <p class="text-body-1 text-textSecondary mt-1">{{ exercise.description }}</p>
      </div>

      <!-- Target Muscles -->
      <div v-if="exercise.muscleGroups && exercise.muscleGroups.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.targetMuscles') }}</h1>
        <div class="d-flex ga-3 mt-2 flex-wrap">
          <v-chip
            v-for="mg in exercise.muscleGroups"
            :key="mg.id"
            :color="mg.id === exercise.primaryMuscleGroup?.id ? 'primary' : 'textSecondary'"
            :style="
              mg.id === exercise.primaryMuscleGroup?.id
                ? 'border: 1px solid #abff1a'
                : 'border: 1px solid #474747'
            "
          >
            {{ mg.name }}
          </v-chip>
        </div>
      </div>

      <!-- Equipment -->
      <div v-if="exercise.equipment && exercise.equipment.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.equipment') }}</h1>
        <p class="text-body-1 text-textSecondary mt-1">{{ exercise.equipment.join(', ') }}</p>
      </div>

      <!-- Media -->
      <div v-if="exercise.media && exercise.media.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.media') }}</h1>
        <div class="d-flex ga-2 mt-2 overflow-x-auto">
          <v-card
            v-for="m in sortedMedia"
            :key="m.id"
            class="rounded-lg flex-shrink-0"
            style="
              border: 1px solid #474747;
              box-shadow: none;
              width: 120px;
              height: 160px;
              overflow: hidden;
            "
          >
            <img
              v-if="m.type === 'image'"
              :src="getMediaUrl(m.url)"
              class="w-100 h-100"
              style="object-fit: cover"
              alt=""
            />
            <div v-else class="w-100 h-100 d-flex align-center justify-center bg-cardBg">
              <v-icon size="32" color="primary">mdi-play-circle-outline</v-icon>
            </div>
          </v-card>
        </div>
      </div>

      <!-- How to Perform -->
      <div v-if="exercise.instructions && exercise.instructions.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.howToPerform') }}</h1>
        <div class="my-2 d-flex ga-4 flex-column">
          <div v-for="(step, i) in exercise.instructions" :key="i" class="d-flex ga-2 align-center">
            <v-avatar color="avatarBg" size="24" class="text-primary text-caption">{{
              i + 1
            }}</v-avatar>
            <p class="text-body-2 text-textSecondary">{{ step }}</p>
          </div>
        </div>
      </div>

      <!-- Pro Tips -->
      <div v-if="exercise.proTips && exercise.proTips.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.proTips') }}</h1>
        <v-card
          class="bg-cardBg pa-3 rounded-lg my-2 py-4 d-flex flex-column ga-4"
          style="border: 1px solid #474747; box-shadow: none"
        >
          <div v-for="(tip, i) in exercise.proTips" :key="i" class="d-flex align-center ga-3">
            <v-icon color="primary" size="20">mdi-lightbulb-on-outline</v-icon>
            <p class="text-body-2 text-textSecondary">{{ tip }}</p>
          </div>
        </v-card>
      </div>

      <!-- Avoid These Mistakes -->
      <div v-if="exercise.mistakes && exercise.mistakes.length > 0">
        <h1 class="text-h6">{{ $t('exerciseDetails.mistakes') }}</h1>
        <v-card
          class="bg-cardBg pa-3 rounded-lg my-2 py-4 d-flex flex-column ga-4"
          style="border: 1px solid #474747; box-shadow: none"
        >
          <div v-for="(mistake, i) in exercise.mistakes" :key="i" class="d-flex align-center ga-3">
            <v-icon color="error" size="20">mdi-close</v-icon>
            <p class="text-body-2 text-textSecondary">{{ mistake }}</p>
          </div>
        </v-card>
      </div>
    </div>
  </div>

  <!-- Edit Dialog -->
  <v-dialog v-model="isEditOpen" fullscreen>
    <EditExercise :exercise="exercise" @close="onEditClose" @saved="onEditClose" />
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="isDeleteDialogOpen" max-width="360">
    <v-card class="bg-cardBg rounded-lg" style="border: 1px solid #474747">
      <v-card-title class="text-h6 pt-5 px-5">{{ $t('exerciseForm.deleteTitle') }}</v-card-title>
      <v-card-text class="text-textSecondary px-5">{{
        $t('exerciseForm.deleteConfirm')
      }}</v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="isDeleteDialogOpen = false">{{ $t('common.cancel') }}</v-btn>
        <v-btn color="error" variant="flat" :loading="isDeleting" @click="confirmDelete">
          {{ $t('common.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Exercise } from '@/interfaces/Exercise.interface'
import { useExerciseStore } from '@/stores/exercise.store'
import { deleteExercise } from '@/services/exercise.service'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  selectedExercise: Exercise | null
  isViewExercise: boolean
  hideMenu?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const exerciseStore = useExerciseStore()
const { t } = useI18n({ useScope: 'global' })

const isEditOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getMediaUrl = (url: string) => {
  if (url.startsWith('http')) return url
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${url}`
}

// Keep exercise reactive from store
const exercise = computed(() => {
  const fromStore = exerciseStore.exercises.find(ex => ex.id === props.selectedExercise?.id)
  return fromStore || props.selectedExercise!
})

const primaryMuscleName = computed(() => {
  if (exercise.value?.primaryMuscleGroup) return exercise.value.primaryMuscleGroup.name
  if (exercise.value?.muscleGroups?.length) return exercise.value.muscleGroups[0].name
  return null
})

const sortedMedia = computed(() =>
  [...(exercise.value?.media || [])].sort((a, b) => a.order - b.order)
)

const onEditClose = async () => {
  isEditOpen.value = false
  await exerciseStore.setExercises(true)
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    const response = await deleteExercise(exercise.value.id)
    if (response) {
      toast.success(t('exercise.deleted'), { progressBar: true, duration: 1000 })
      await exerciseStore.setExercises(true)
      isDeleteDialogOpen.value = false
      emit('close')
    }
  } catch {
    toast.error(t('exercise.failedToDelete'), { progressBar: true, duration: 1000 })
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
