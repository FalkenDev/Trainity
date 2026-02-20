<template>
  <div class="d-flex flex-column fill-height bg-background content-scroll">
    <BackHeader
      :title="$t('activity.createActivity')"
      :show-menu="false"
      :show-save="true"
      class="sticky-header"
      @close="emit('close')"
      @save="saveActivity"
    />

    <v-form ref="formRef" class="mx-5 mt-2 pb-10">
      <!-- Name -->
      <v-label class="text-body-2 font-weight-bold text-textPrimary mb-1">
        {{ $t('activity.activityName') }} <span class="text-error text-h6 ml-1">*</span>
      </v-label>
      <v-text-field
        v-model="form.name"
        variant="outlined"
        :rules="[v => !!v || $t('common.name')]"
      />

      <!-- Description -->
      <v-label class="text-body-2 font-weight-bold text-textPrimary mb-2">
        {{ $t('activity.activityDescription') }}
      </v-label>
      <v-textarea
        v-model="form.description"
        variant="outlined"
        rows="2"
        auto-grow
        class="small-textarea"
      />

      <!-- Icon picker -->
      <v-label class="text-body-2 font-weight-bold text-textPrimary mb-2">
        {{ $t('activity.selectIcon') }}
      </v-label>
      <div class="d-flex flex-wrap ga-2 mb-5">
        <v-btn
          v-for="opt in iconOptions"
          :key="opt.value"
          :color="form.icon === opt.value ? 'primary' : 'cardBg'"
          :variant="form.icon === opt.value ? 'flat' : 'outlined'"
          size="small"
          class="rounded-lg text-caption"
          style="border-color: #474747"
          @click="form.icon = opt.value"
        >
          <v-icon size="16" class="mr-1">mdi-{{ getIconName(opt.value) }}</v-icon>
          {{ opt.label }}
        </v-btn>
      </div>

      <!-- Equipment -->
      <v-label class="text-body-2 font-weight-bold text-textPrimary mb-2">
        {{ $t('activity.equipment') }}
      </v-label>
      <ChipTextInput
        v-model="form.equipment"
        :placeholder="$t('activity.equipmentPlaceholder')"
        class="mb-4"
      />

      <!-- Tracking flags -->
      <v-label class="text-body-2 font-weight-bold text-textPrimary mb-2">
        {{ $t('activity.trackedMetrics') }}
      </v-label>
      <div class="d-flex flex-column">
        <v-switch
          v-model="form.trackDistance"
          :label="$t('activity.trackDistance')"
          color="primary"
          hide-details
          density="compact"
          class="mb-1"
        />
        <v-switch
          v-model="form.trackPace"
          :label="$t('activity.trackPace')"
          color="primary"
          hide-details
          density="compact"
          class="mb-1"
        />
        <v-switch
          v-model="form.trackElevation"
          :label="$t('activity.trackElevation')"
          color="primary"
          hide-details
          density="compact"
          class="mb-1"
        />
        <v-switch
          v-model="form.trackCalories"
          :label="$t('activity.trackCalories')"
          color="primary"
          hide-details
          density="compact"
        />
      </div>

      <v-btn
        color="primary"
        class="w-100 mt-8"
        size="large"
        :loading="isSaving"
        @click="saveActivity"
      >
        {{ $t('activity.createActivity') }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useActivityStore } from '@/stores/activity.store'
import { createActivity } from '@/services/activity.service'
import type { ActivityIcon } from '@/interfaces/Activity.interface'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const activityStore = useActivityStore()
const formRef = ref()
const isSaving = ref(false)

const iconOptions = [
  { label: 'Running', value: 'running' as ActivityIcon },
  { label: 'Walking', value: 'walking' as ActivityIcon },
  { label: 'Cycling', value: 'cycling' as ActivityIcon },
  { label: 'Football', value: 'football' as ActivityIcon },
  { label: 'Swimming', value: 'swimming' as ActivityIcon },
  { label: 'Kayaking', value: 'kayaking' as ActivityIcon },
  { label: 'Hiking', value: 'hiking' as ActivityIcon },
  { label: 'Yoga', value: 'yoga' as ActivityIcon },
  { label: 'Boxing', value: 'boxing' as ActivityIcon },
  { label: 'Tennis', value: 'tennis' as ActivityIcon },
  { label: 'Basketball', value: 'basketball' as ActivityIcon },
  { label: 'Volleyball', value: 'volleyball' as ActivityIcon },
  { label: 'Skiing', value: 'skiing' as ActivityIcon },
  { label: 'Skating', value: 'skating' as ActivityIcon },
  { label: 'Rowing', value: 'rowing' as ActivityIcon },
  { label: 'Other', value: 'other' as ActivityIcon },
]

function getIconName(icon: ActivityIcon): string {
  const iconMap: Record<ActivityIcon, string> = {
    running: 'run',
    walking: 'walk',
    cycling: 'bike',
    football: 'soccer',
    swimming: 'swim',
    kayaking: 'kayaking',
    hiking: 'hiking',
    yoga: 'yoga',
    boxing: 'boxing',
    tennis: 'tennis',
    basketball: 'basketball',
    volleyball: 'volleyball',
    skiing: 'skiing',
    skating: 'skating',
    rowing: 'rowing',
    other: 'dots-horizontal',
  }
  return iconMap[icon] || 'dots-horizontal'
}

const form = ref({
  name: '',
  description: '',
  icon: 'other' as ActivityIcon,
  equipment: [] as string[],
  trackDistance: false,
  trackPace: false,
  trackElevation: false,
  trackCalories: false,
})

async function saveActivity() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    await createActivity({
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      icon: form.value.icon,
      equipment: form.value.equipment.length > 0 ? form.value.equipment : undefined,
      trackDistance: form.value.trackDistance,
      trackPace: form.value.trackPace,
      trackElevation: form.value.trackElevation,
      trackCalories: form.value.trackCalories,
    })
    toast.success(t('activity.created'), { progressBar: true, duration: 1000 })
    await activityStore.fetchActivities(true)
    emit('close')
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToCreate'), {
      progressBar: true,
      duration: 1000,
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgb(var(--v-theme-background));
}

.content-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.small-textarea :deep(textarea) {
  font-size: 0.9rem;
}

:deep(.v-field) {
  background-color: #15181e !important;
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>
