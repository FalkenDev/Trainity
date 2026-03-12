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
  <div
    class="w-100 fill-height bg-background overflow-y-auto pb-10"
    style="
      background: linear-gradient(135deg, rgba(171, 255, 26, 0.15) 0%, rgba(12, 14, 18, 0) 35%);
      min-height: 100vh;
    "
  >
    <!-- Header -->
    <div class="d-flex justify-space-between mx-5 py-5">
      <v-icon class="cursor-pointer" @click="emit('close')">mdi-arrow-left</v-icon>
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-icon v-bind="menuProps">mdi-dots-vertical</v-icon>
        </template>
        <v-list class="bg-cardBg mt-2 mr-2" width="140" style="border: 1px solid rgb(var(--v-theme-borderColor))">
          <v-list-item @click="isEditOpen = true">
            <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isDeleteDialogOpen = true">
            <v-list-item-title class="text-error">{{
              $t('activity.deleteActivity')
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Avatar -->
    <v-avatar size="70" tile color="avatarBg" class="mx-5 mb-3 rounded-lg">
      <v-icon color="primary" size="35">mdi-{{ iconName }}</v-icon>
    </v-avatar>

    <div class="mx-5 d-flex flex-column ga-4">
      <!-- Label + Title -->
      <div class="pt-2">
        <p class="text-primary text-body-1 text-capitalize">{{ $t('settings.activities') }}</p>
        <h1 class="text-h5 font-weight-bold">{{ activity.name }}</h1>
      </div>

      <!-- Stat Cards -->
      <div class="d-flex w-100 ga-3" style="align-items: stretch">
        <v-card
          class="text-center pa-3 rounded-lg bg-cardBg"
          style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none; flex: 1 1 0; min-width: 0"
        >
          <p class="text-h6 font-weight-bold text-primary">{{ sessionCount }}</p>
          <p class="text-caption text-textSecondary">{{ $t('activity.sessionsCount') }}</p>
        </v-card>

        <v-card
          class="text-center pa-3 rounded-lg bg-cardBg"
          style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none; flex: 1 1 0; min-width: 0"
        >
          <p class="text-h6 font-weight-bold text-primary">{{ avgDurationLabel }}</p>
          <p class="text-caption text-textSecondary">{{ $t('activity.avgDuration') }}</p>
        </v-card>

        <v-card
          v-if="activity.trackCalories"
          class="text-center pa-3 rounded-lg bg-cardBg"
          style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none; flex: 1 1 0; min-width: 0"
        >
          <p class="text-h6 font-weight-bold text-primary">{{ totalCaloriesLabel }}</p>
          <p class="text-caption text-textSecondary">{{ $t('activity.totalCalories') }}</p>
        </v-card>
      </div>

      <!-- About -->
      <div v-if="activity.description">
        <h2 class="text-h6">{{ $t('exerciseDetails.about') }}</h2>
        <p class="text-body-1 text-textSecondary mt-1">{{ activity.description }}</p>
      </div>

      <!-- Tracked Metrics -->
      <div v-if="trackedMetrics.length > 0">
        <h2 class="text-h6">{{ $t('activity.trackedMetrics') }}</h2>
        <div class="d-flex ga-2 mt-2 flex-wrap">
          <v-chip
            v-for="metric in trackedMetrics"
            :key="metric"
            color="primary"
            variant="tonal"
            size="small"
          >
            {{ metric }}
          </v-chip>
        </div>
      </div>

      <!-- Equipment -->
      <div v-if="activity.equipment && activity.equipment.length > 0">
        <h2 class="text-h6">{{ $t('activity.equipment') }}</h2>
        <div class="d-flex ga-2 mt-2 flex-wrap">
          <v-chip
            v-for="item in activity.equipment"
            :key="item"
            variant="outlined"
            size="small"
            style="border-color: rgb(var(--v-theme-borderColor))"
          >
            {{ item }}
          </v-chip>
        </div>
      </div>

      <!-- Your Stats -->
      <div>
        <h2 class="text-h6">{{ $t('activity.yourStats') }}</h2>
        <v-card
          class="bg-cardBg rounded-lg mt-2"
          style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
        >
          <v-list class="bg-transparent pa-0">
            <v-list-item class="px-4 py-3">
              <div class="d-flex justify-space-between align-center w-100">
                <span class="text-body-2 text-textSecondary">{{ $t('activity.totalTime') }}</span>
                <span class="text-body-1 font-weight-bold">{{ totalTimeLabel }}</span>
              </div>
            </v-list-item>
            <v-divider style="border-color: rgb(var(--v-theme-borderColor))" />
            <v-list-item v-if="activity.trackDistance" class="px-4 py-3">
              <div class="d-flex justify-space-between align-center w-100">
                <span class="text-body-2 text-textSecondary">{{
                  $t('activity.totalDistance')
                }}</span>
                <span class="text-body-1 font-weight-bold">{{ totalDistanceLabel }}</span>
              </div>
            </v-list-item>
            <v-divider v-if="activity.trackDistance" style="border-color: rgb(var(--v-theme-borderColor))" />
            <v-list-item v-if="activity.trackCalories" class="px-4 py-3">
              <div class="d-flex justify-space-between align-center w-100">
                <span class="text-body-2 text-textSecondary">{{
                  $t('activity.totalCalories')
                }}</span>
                <span class="text-body-1 font-weight-bold">{{ totalCaloriesLabel }} kcal</span>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- Recent Sessions -->
      <div>
        <h2 class="text-h6">{{ $t('activity.recentSessions') }}</h2>
        <div v-if="recentLogs.length === 0" class="text-center py-6">
          <p class="text-body-2 text-textSecondary">{{ $t('activity.noSessions') }}</p>
        </div>
        <div v-else class="d-flex flex-column ga-2 mt-2">
          <v-card
            v-for="log in recentLogs"
            :key="log.id"
            class="bg-cardBg rounded-lg cursor-pointer"
            style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
            @click="openEditLog(log)"
          >
            <div class="px-4 py-3 d-flex justify-space-between align-center">
              <div class="d-flex flex-column ga-1">
                <span class="text-body-2 font-weight-bold">{{ formatDate(log.date) }}</span>
                <div class="d-flex ga-3 align-center">
                  <span class="text-caption text-textSecondary">
                    <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                    {{ log.duration }} min
                  </span>
                  <span
                    v-if="activity.trackDistance && log.distance"
                    class="text-caption text-textSecondary"
                  >
                    <v-icon size="12" class="mr-1">mdi-map-marker-distance</v-icon>
                    {{ Number(log.distance).toFixed(1) }} km
                  </span>
                  <span
                    v-if="activity.trackCalories && log.calories"
                    class="text-caption text-textSecondary"
                  >
                    <v-icon size="12" class="mr-1">mdi-fire</v-icon>
                    {{ log.calories }} kcal
                  </span>
                </div>
              </div>
              <v-icon color="grey-lighten-1" size="18">mdi-chevron-right</v-icon>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Activity Dialog -->
  <v-dialog v-model="isEditOpen" fullscreen>
    <EditActivity :activity="activity" @close="onEditClose" @deleted="emit('close')" />
  </v-dialog>

  <!-- Edit Log Dialog -->
  <v-dialog v-model="isEditLogOpen" fullscreen>
    <EditActivityLog
      v-if="selectedLog"
      :log="selectedLog"
      @close="isEditLogOpen = false"
      @saved="isEditLogOpen = false"
    />
  </v-dialog>

  <!-- Delete Confirmation -->
  <AcceptDialog
    v-model="isDeleteDialogOpen"
    :title="$t('activity.deleteActivity')"
    :description="`${$t('activity.deleteActivity')} &quot;${activity.name}&quot;?`"
    @accept="deleteThisActivity"
    @cancel="isDeleteDialogOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useActivityStore } from '@/stores/activity.store'
import { deleteActivity as deleteActivityService } from '@/services/activity.service'
import type { Activity, ActivityLog } from '@/interfaces/Activity.interface'
import EditActivity from './EditActivity.vue'
import EditActivityLog from './EditActivityLog.vue'
import AcceptDialog from '@/components/basicUI/AcceptDialog.vue'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ activity: Activity }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const activityStore = useActivityStore()

const isEditOpen = ref(false)
const isEditLogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const selectedLog = ref<ActivityLog | null>(null)

// Icon mapping
function getIconName(icon: string): string {
  const iconMap: Record<string, string> = {
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

const iconName = computed(() => getIconName(props.activity.icon))

// Logs for this activity
const activityLogs = computed(() =>
  activityStore.activityLogs.filter(l => l.activity?.id === props.activity.id)
)

const recentLogs = computed(() =>
  [...activityLogs.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
)

// Stat computations
const sessionCount = computed(() => activityLogs.value.length)

const avgDurationLabel = computed(() => {
  if (sessionCount.value === 0) return '—'
  const avg = activityLogs.value.reduce((s, l) => s + l.duration, 0) / sessionCount.value
  return `${Math.round(avg)} min`
})

const totalCaloriesLabel = computed(() => {
  const total = activityLogs.value.reduce((s, l) => s + (l.calories ?? 0), 0)
  return total > 0 ? total.toString() : '—'
})

const totalTimeLabel = computed(() => {
  const totalMin = activityLogs.value.reduce((s, l) => s + l.duration, 0)
  if (totalMin === 0) return '—'
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m} min`
})

const totalDistanceLabel = computed(() => {
  const total = activityLogs.value.reduce((s, l) => s + (Number(l.distance) || 0), 0)
  return total > 0 ? `${total.toFixed(1)} km` : '—'
})

// Tracked metrics chips
const trackedMetrics = computed(() => {
  const metrics: string[] = []
  if (props.activity.trackDistance) metrics.push(t('activity.trackDistance'))
  if (props.activity.trackPace) metrics.push(t('activity.trackPace'))
  if (props.activity.trackElevation) metrics.push(t('activity.trackElevation'))
  if (props.activity.trackCalories) metrics.push(t('activity.trackCalories'))
  return metrics
})

// Date formatting
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function openEditLog(log: ActivityLog) {
  selectedLog.value = log
  isEditLogOpen.value = true
}

async function onEditClose() {
  isEditOpen.value = false
  await activityStore.fetchActivities(true)
}

async function deleteThisActivity() {
  try {
    await deleteActivityService(props.activity.id)
    toast.success(t('activity.deleted'), { progressBar: true, duration: 1000 })
    await activityStore.fetchActivities(true)
    emit('close')
  } catch (error: unknown) {
    toast.error((error as Error).message || t('activity.failedToDelete'), {
      progressBar: true,
      duration: 1000,
    })
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
