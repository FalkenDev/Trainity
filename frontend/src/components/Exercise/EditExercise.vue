<template>
  <div class="d-flex flex-column fill-height bg-background content-scroll">
    <BackHeader :title="$t('exerciseForm.editTitle')" :show-menu="false" @close="emit('close')" />

    <v-form ref="formRef" class="mx-5 mt-2 pb-10">
      <!-- Exercise Name -->
      <v-text-field
        v-model="form.name"
        :label="$t('exerciseForm.nameLabel')"
        variant="outlined"
        required
        :rules="[v => !!v || $t('exerciseForm.nameRequired')]"
      />

      <!-- About / Description (optional) -->
      <v-textarea
        v-model="form.description"
        :label="$t('exerciseForm.aboutLabel')"
        variant="outlined"
        rows="2"
        auto-grow
        class="mt-1"
      />

      <!-- Exercise Type -->
      <v-select
        v-model="form.exerciseType"
        :label="$t('exerciseForm.exerciseTypeLabel')"
        :items="exerciseTypeItems"
        variant="outlined"
        clearable
        class="mt-1"
      />

      <!-- Target Muscles (multi-select chips) -->
      <v-select
        v-model="form.muscleGroupIds"
        :label="$t('exerciseForm.muscleGroupsLabel')"
        :items="muscleGroupItems"
        item-title="name"
        item-value="id"
        variant="outlined"
        multiple
        chips
        closable-chips
        class="mt-1"
        :menu-props="{ maxHeight: '250px' }"
      />

      <!-- Primary Muscle (from selected targets) -->
      <v-select
        v-model="form.primaryMuscleGroupId"
        :label="$t('exerciseForm.primaryMuscleLabel')"
        :items="selectedMuscleGroupItems"
        item-title="name"
        item-value="id"
        variant="outlined"
        clearable
        class="mt-1"
        :disabled="form.muscleGroupIds.length === 0"
      />

      <!-- Equipment (chip input) -->
      <div class="mt-1">
        <p class="text-body-2 text-textSecondary mb-2">{{ $t('exerciseForm.equipmentLabel') }}</p>
        <ChipTextInput
          v-model="form.equipment"
          :placeholder="$t('exerciseForm.equipmentPlaceholder')"
        />
      </div>

      <!-- Media Upload -->
      <div class="mt-2">
        <p class="text-body-2 text-textSecondary mb-2">{{ $t('exerciseForm.mediaLabel') }}</p>
        <MediaUpload
          v-model="newMediaItems"
          :existing-media="exercise?.media"
          @remove-existing="removeExistingMedia"
        />
      </div>

      <!-- How to Perform (draggable list) -->
      <div class="mt-6">
        <p class="text-body-2 text-textSecondary mb-2">
          {{ $t('exerciseForm.instructionsLabel') }}
        </p>
        <DraggableTextList
          v-model="form.instructions"
          :placeholder="$t('exerciseForm.instructionsPlaceholder')"
          icon="mdi-numeric"
          numbered
        />
      </div>

      <!-- Pro Tips (draggable list) -->
      <div class="mt-6">
        <p class="text-body-2 text-textSecondary mb-2">{{ $t('exerciseForm.proTipsLabel') }}</p>
        <DraggableTextList
          v-model="form.proTips"
          :placeholder="$t('exerciseForm.proTipsPlaceholder')"
          icon="mdi-lightbulb-on-outline"
          icon-color="primary"
        />
      </div>

      <!-- Avoid These Mistakes (draggable list) -->
      <div class="mt-6">
        <p class="text-body-2 text-textSecondary mb-2">{{ $t('exerciseForm.mistakesLabel') }}</p>
        <DraggableTextList
          v-model="form.mistakes"
          :placeholder="$t('exerciseForm.mistakesPlaceholder')"
          icon="mdi-close"
          icon-color="error"
        />
      </div>

      <!-- Save Button -->
      <v-btn
        color="primary"
        class="w-100 mt-8"
        size="large"
        :loading="isSaving"
        @click="saveExercise"
      >
        {{ $t('exerciseForm.saveButton') }}
      </v-btn>

      <!-- Delete Button -->
      <v-btn
        color="error"
        variant="outlined"
        class="w-100 mt-3"
        size="large"
        @click="isDeleteDialogOpen = true"
      >
        {{ $t('exerciseForm.deleteTitle') }}
      </v-btn>
    </v-form>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="360">
      <v-card class="bg-cardBg rounded-lg" style="border: 1px solid #474747">
        <v-card-title class="text-h6 pt-5 px-5">{{ $t('exerciseForm.deleteTitle') }}</v-card-title>
        <v-card-text class="text-textSecondary px-5">{{
          $t('exerciseForm.deleteConfirm')
        }}</v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-spacer />
          <v-btn variant="text" @click="isDeleteDialogOpen = false">{{
            $t('common.cancel')
          }}</v-btn>
          <v-btn color="error" variant="flat" :loading="isDeleting" @click="confirmDelete">
            {{ $t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Exercise, ExerciseType } from '@/interfaces/Exercise.interface'
import type { MediaItem } from '@/components/basicUI/MediaUpload.vue'
import {
  updateExercise,
  deleteExercise,
  uploadExerciseMedia,
  deleteExerciseMedia,
} from '@/services/exercise.service'
import { useMuscleGroupStore } from '@/stores/muscleGroup.store'
import { useExerciseStore } from '@/stores/exercise.store'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  exercise: Exercise
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const muscleGroupStore = useMuscleGroupStore()
const exerciseStore = useExerciseStore()
const { t } = useI18n({ useScope: 'global' })

const isSaving = ref(false)
const isDeleting = ref(false)
const isDeleteDialogOpen = ref(false)
const newMediaItems = ref<MediaItem[]>([])

const exerciseTypeItems = [
  { title: 'Compound', value: 'compound' as ExerciseType },
  { title: 'Isolation', value: 'isolation' as ExerciseType },
  { title: 'Bodyweight', value: 'bodyweight' as ExerciseType },
]

const form = ref({
  name: props.exercise.name || '',
  description: props.exercise.description || '',
  exerciseType: props.exercise.exerciseType || (null as ExerciseType | null),
  muscleGroupIds: props.exercise.muscleGroups?.map(mg => mg.id) || ([] as number[]),
  primaryMuscleGroupId: props.exercise.primaryMuscleGroup?.id || (null as number | null),
  equipment: props.exercise.equipment || ([] as string[]),
  instructions: props.exercise.instructions || ([] as string[]),
  proTips: props.exercise.proTips || ([] as string[]),
  mistakes: props.exercise.mistakes || ([] as string[]),
})

const muscleGroupItems = computed(() =>
  muscleGroupStore.muscleGroups.map(g => ({ name: g.name, id: g.id }))
)

const selectedMuscleGroupItems = computed(() =>
  muscleGroupItems.value.filter(g => form.value.muscleGroupIds.includes(g.id))
)

// Clear primary muscle group if it's no longer in the selected muscle groups
watch(
  () => form.value.muscleGroupIds,
  ids => {
    if (form.value.primaryMuscleGroupId && !ids.includes(form.value.primaryMuscleGroupId)) {
      form.value.primaryMuscleGroupId = null
    }
  }
)

const removeExistingMedia = async (mediaId: number) => {
  try {
    await deleteExerciseMedia(props.exercise.id, mediaId)
    await exerciseStore.setExercises(true)
    toast.success(t('exerciseForm.mediaRemoved'), { progressBar: true, duration: 1000 })
  } catch {
    toast.error(t('exerciseForm.mediaRemoveError'), { progressBar: true, duration: 1000 })
  }
}

const saveExercise = async () => {
  if (!form.value.name.trim()) {
    toast.error(t('exerciseForm.nameRequired'), { progressBar: true, duration: 1000 })
    return
  }

  isSaving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      exerciseType: form.value.exerciseType || undefined,
      muscleGroupIds: form.value.muscleGroupIds,
      primaryMuscleGroupId: form.value.primaryMuscleGroupId || undefined,
      equipment: form.value.equipment.length > 0 ? form.value.equipment : undefined,
      instructions: form.value.instructions.length > 0 ? form.value.instructions : undefined,
      proTips: form.value.proTips.length > 0 ? form.value.proTips : undefined,
      mistakes: form.value.mistakes.length > 0 ? form.value.mistakes : undefined,
    }

    const response = await updateExercise(props.exercise.id, payload)

    if (response) {
      // Upload new media items
      for (const item of newMediaItems.value) {
        if (item.file) {
          try {
            await uploadExerciseMedia(props.exercise.id, item.file)
          } catch {
            toast.warning(t('exerciseForm.mediaUploadFailed'), {
              progressBar: true,
              duration: 1500,
            })
          }
        }
      }

      toast.success(t('exercise.updated'), { progressBar: true, duration: 1000 })
      await exerciseStore.setExercises(true)
      newMediaItems.value = []
      emit('saved')
      emit('close')
    } else {
      toast.error(t('exercise.failedToUpdate'), { progressBar: true, duration: 1000 })
    }
  } catch {
    toast.error(t('exercise.updateError'), { progressBar: true, duration: 1000 })
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    const response = await deleteExercise(props.exercise.id)
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
.content-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
