<template>
  <div class="d-flex flex-column fill-height bg-background content-scroll">
    <BackHeader :title="$t('exerciseForm.createTitle')" :show-menu="false" @close="emit('close')" />

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
        <MediaUpload v-model="newMediaItems" />
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

      <!-- Create Button -->
      <v-btn
        color="primary"
        class="w-100 mt-8"
        size="large"
        :loading="isCreating"
        @click="createNewExercise"
      >
        {{ $t('exerciseForm.createButton') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseType } from '@/interfaces/Exercise.interface'
import type { MediaItem } from '@/components/basicUI/MediaUpload.vue'
import { createExercise, uploadExerciseMedia } from '@/services/exercise.service'
import { useMuscleGroupStore } from '@/stores/muscleGroup.store'
import { useExerciseStore } from '@/stores/exercise.store'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const exerciseStore = useExerciseStore()
const muscleGroupStore = useMuscleGroupStore()
const isCreating = ref(false)
const newMediaItems = ref<MediaItem[]>([])
const { t } = useI18n({ useScope: 'global' })

const exerciseTypeItems = [
  { title: 'Compound', value: 'compound' as ExerciseType },
  { title: 'Isolation', value: 'isolation' as ExerciseType },
  { title: 'Bodyweight', value: 'bodyweight' as ExerciseType },
]

const form = ref({
  name: '',
  description: '',
  exerciseType: null as ExerciseType | null,
  muscleGroupIds: [] as number[],
  primaryMuscleGroupId: null as number | null,
  equipment: [] as string[],
  instructions: [] as string[],
  proTips: [] as string[],
  mistakes: [] as string[],
})

const muscleGroupItems = computed(() =>
  muscleGroupStore.muscleGroups.map(g => ({ name: g.name, id: g.id }))
)

const selectedMuscleGroupItems = computed(() =>
  muscleGroupItems.value.filter(g => form.value.muscleGroupIds.includes(g.id))
)

watch(
  () => form.value.muscleGroupIds,
  ids => {
    if (form.value.primaryMuscleGroupId && !ids.includes(form.value.primaryMuscleGroupId)) {
      form.value.primaryMuscleGroupId = null
    }
  }
)

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    exerciseType: null,
    muscleGroupIds: [],
    primaryMuscleGroupId: null,
    equipment: [],
    instructions: [],
    proTips: [],
    mistakes: [],
  }
  newMediaItems.value = []
}

const createNewExercise = async () => {
  if (!form.value.name.trim()) {
    toast.error(t('exerciseForm.nameRequired'), { progressBar: true, duration: 1000 })
    return
  }

  isCreating.value = true
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

    const response = await createExercise(payload)

    if (response) {
      // Upload media items
      for (const item of newMediaItems.value) {
        if (item.file) {
          try {
            await uploadExerciseMedia(response.id, item.file)
          } catch {
            toast.warning(t('exerciseForm.mediaUploadFailed'), {
              progressBar: true,
              duration: 1500,
            })
          }
        }
      }

      toast.success(t('exercise.created'), { progressBar: true, duration: 1000 })
      resetForm()
      exerciseStore.setExercises(true)
      emit('close')
    } else {
      toast.error(t('exercise.failedToCreate'), { progressBar: true, duration: 1000 })
    }
  } catch {
    toast.error(t('exercise.createGenericError'), { progressBar: true, duration: 1000 })
  } finally {
    isCreating.value = false
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
