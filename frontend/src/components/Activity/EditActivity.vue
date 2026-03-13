<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <div class="d-flex flex-column fill-height bg-background content-scroll">
    <BackHeader
      :title="$t('activity.editActivity')"
      show-menu
      :show-save="true"
      class="sticky-header"
      @close="emit('close')"
      @save="saveActivity"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isDeleteDialogOpen = true">
            <v-list-item-title class="text-error">{{
              $t('activity.deleteActivity')
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

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
          style="border-color: rgb(var(--v-theme-borderColor))"
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
    </v-form>

    <!-- Delete Confirmation -->
    <AcceptDialog
      v-model="isDeleteDialogOpen"
      :title="$t('activity.deleteActivity')"
      :description="`${$t('activity.deleteActivity')} &quot;${activity.name}&quot;?`"
      @accept="deleteActivity"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useActivityStore } from '@/stores/activity.store'
import {
  updateActivity,
  deleteActivity as deleteActivityService,
} from '@/services/activity.service'
import type { Activity, ActivityIcon } from '@/interfaces/Activity.interface'
import AcceptDialog from '@/components/basicUI/AcceptDialog.vue'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ activity: Activity }>()
const emit = defineEmits<{ close: []; deleted: [] }>()
const { t } = useI18n()
const activityStore = useActivityStore()
const formRef = ref()
const isSaving = ref(false)
const isDeleting = ref(false)
const isDeleteDialogOpen = ref(false)

const iconOptions = computed(() => [
  { label: t('activity.icons.running'), value: 'running' as ActivityIcon },
  { label: t('activity.icons.walking'), value: 'walking' as ActivityIcon },
  { label: t('activity.icons.cycling'), value: 'cycling' as ActivityIcon },
  { label: t('activity.icons.football'), value: 'football' as ActivityIcon },
  { label: t('activity.icons.swimming'), value: 'swimming' as ActivityIcon },
  { label: t('activity.icons.kayaking'), value: 'kayaking' as ActivityIcon },
  { label: t('activity.icons.hiking'), value: 'hiking' as ActivityIcon },
  { label: t('activity.icons.yoga'), value: 'yoga' as ActivityIcon },
  { label: t('activity.icons.boxing'), value: 'boxing' as ActivityIcon },
  { label: t('activity.icons.tennis'), value: 'tennis' as ActivityIcon },
  { label: t('activity.icons.basketball'), value: 'basketball' as ActivityIcon },
  { label: t('activity.icons.volleyball'), value: 'volleyball' as ActivityIcon },
  { label: t('activity.icons.skiing'), value: 'skiing' as ActivityIcon },
  { label: t('activity.icons.skating'), value: 'skating' as ActivityIcon },
  { label: t('activity.icons.rowing'), value: 'rowing' as ActivityIcon },
  { label: t('activity.icons.other'), value: 'other' as ActivityIcon },
])

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
  name: props.activity.name,
  description: props.activity.description ?? '',
  icon: props.activity.icon,
  equipment: props.activity.equipment ? [...props.activity.equipment] : ([] as string[]),
  trackDistance: props.activity.trackDistance,
  trackPace: props.activity.trackPace,
  trackElevation: props.activity.trackElevation,
  trackCalories: props.activity.trackCalories,
})

async function saveActivity() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    await updateActivity(props.activity.id, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      icon: form.value.icon,
      equipment: form.value.equipment.length > 0 ? form.value.equipment : undefined,
      trackDistance: form.value.trackDistance,
      trackPace: form.value.trackPace,
      trackElevation: form.value.trackElevation,
      trackCalories: form.value.trackCalories,
    })
    toast.success(t('activity.updated'), { progressBar: true, duration: 1000 })
    await activityStore.fetchActivities(true)
    emit('close')
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToUpdate'), {
      progressBar: true,
      duration: 1000,
    })
  } finally {
    isSaving.value = false
  }
}

async function deleteActivity() {
  isDeleting.value = true
  try {
    await deleteActivityService(props.activity.id)
    toast.success(t('activity.deleted'), { progressBar: true, duration: 1000 })
    await activityStore.fetchActivities(true)
    emit('deleted')
    emit('close')
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToDelete'), {
      progressBar: true,
      duration: 1000,
    })
  } finally {
    isDeleting.value = false
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
  background-color: rgb(var(--v-theme-cardBg)) !important;
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>
