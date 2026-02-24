<template>
  <div>
    <BackHeader :title="$t('activity.logActivity')" route-to="/" />

    <div class="px-5 py-4">
      <!-- Activity cards grid -->
      <div v-if="activityStore.isLoadingActivities" class="d-flex justify-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="activityStore.activities.length === 0" class="text-center py-10">
        <v-icon size="64" color="textSecondary" class="mb-4">mdi-run-fast</v-icon>
        <p class="text-body-1 text-textSecondary">{{ $t('activity.noActivities') }}</p>
      </div>

      <div v-else class="activity-grid">
        <v-card
          v-for="activity in activityStore.activities"
          :key="activity.id"
          class="activity-card pa-4 d-flex flex-column align-center rounded-lg bg-cardBg"
          style="
            border: 1px solid rgb(var(--v-theme-borderColor));
            box-shadow: none;
            min-height: 120px;
            cursor: pointer;
          "
          @click="openLogDialog(activity)"
        >
          <v-avatar size="48" color="avatarBg" class="rounded-lg mb-2">
            <v-icon color="primary" size="28">mdi-{{ getIconName(activity.icon) }}</v-icon>
          </v-avatar>
          <span class="text-body-2 font-weight-medium text-center">{{ activity.name }}</span>
          <span
            v-if="activity.description"
            class="text-caption text-textSecondary text-center mt-1 activity-desc"
          >
            {{ activity.description }}
          </span>
        </v-card>
      </div>

      <!-- Create new activity button -->
      <v-btn
        color="primary"
        variant="outlined"
        size="large"
        block
        class="mt-8 rounded-lg"
        prepend-icon="mdi-plus"
        @click="isCreateOpen = true"
      >
        {{ $t('activity.createActivity') }}
      </v-btn>
    </div>

    <!-- Log Activity Dialog -->
    <v-dialog v-model="isLogDialogOpen" max-width="500" :fullscreen="$vuetify.display.smAndDown">
      <v-card class="bg-background">
        <div class="d-flex justify-space-between align-center px-5 py-3 border-b-sm">
          <v-btn icon density="compact" variant="flat" color="transparent" @click="closeLogDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <h2 class="text-h6">{{ selectedActivity?.name }}</h2>
          <div style="width: 40px" />
        </div>

        <div class="px-5 py-4">
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <!-- Date Picker -->
            <v-text-field
              v-model="formData.date"
              :label="$t('activity.date')"
              :rules="[rules.required]"
              type="date"
              variant="outlined"
              class="mb-4"
            />

            <!-- Duration (required) -->
            <v-text-field
              v-model.number="formData.duration"
              :label="$t('activity.duration')"
              :rules="[rules.required, rules.positive]"
              type="number"
              suffix="min"
              variant="outlined"
              class="mb-4"
            />

            <!-- Conditional fields based on selected activity -->
            <template v-if="selectedActivity">
              <!-- Distance -->
              <v-text-field
                v-if="selectedActivity.trackDistance"
                v-model.number="formData.distance"
                :label="$t('activity.distance')"
                type="number"
                step="0.1"
                suffix="km"
                variant="outlined"
                class="mb-4"
              />

              <!-- Calculated Pace (read-only) -->
              <v-text-field
                v-if="selectedActivity.trackPace && calculatedPace"
                :model-value="calculatedPace"
                :label="$t('activity.pace')"
                readonly
                suffix="/km"
                variant="outlined"
                class="mb-4"
              />

              <!-- Elevation Gain -->
              <v-text-field
                v-if="selectedActivity.trackElevation"
                v-model.number="formData.elevationGain"
                :label="$t('activity.elevationGain')"
                type="number"
                suffix="m"
                variant="outlined"
                class="mb-4"
              />

              <!-- Max Elevation -->
              <v-text-field
                v-if="selectedActivity.trackElevation"
                v-model.number="formData.maxElevation"
                :label="$t('activity.maxElevation')"
                type="number"
                suffix="m"
                variant="outlined"
                class="mb-4"
              />

              <!-- Calories -->
              <v-text-field
                v-if="selectedActivity.trackCalories"
                v-model.number="formData.calories"
                :label="$t('activity.calories')"
                type="number"
                suffix="kcal"
                variant="outlined"
                class="mb-4"
              />
            </template>

            <!-- Notes -->
            <v-textarea
              v-model="formData.notes"
              :label="$t('activity.notes')"
              variant="outlined"
              rows="3"
              class="mb-4"
            />

            <!-- Submit Button -->
            <v-btn :loading="isSubmitting" type="submit" size="large" color="primary" block>
              {{ $t('activity.save') }}
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- Create Activity Dialog (full-screen) -->
    <v-dialog v-model="isCreateOpen" fullscreen transition="dialog-bottom-transition">
      <CreateActivity @close="onCreateClose" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useActivityStore } from '@/stores/activity.store'
import { createActivityLog } from '@/services/activityLog.service'
import type { Activity, ActivityIcon, CreateActivityLogDto } from '@/interfaces/Activity.interface'
import CreateActivity from '@/components/Activity/CreateActivity.vue'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const activityStore = useActivityStore()
const { t } = useI18n()
const formRef = ref()

const isLogDialogOpen = ref(false)
const isCreateOpen = ref(false)
const selectedActivity = ref<Activity | null>(null)

const formData = ref<CreateActivityLogDto>({
  activityId: null as unknown as number,
  date: new Date().toISOString().split('T')[0],
  duration: null as unknown as number,
  distance: undefined,
  elevationGain: undefined,
  maxElevation: undefined,
  calories: undefined,
  notes: undefined,
  scheduledSessionId: route.query.scheduledSessionId
    ? Number(route.query.scheduledSessionId)
    : undefined,
})

const isSubmitting = ref(false)

const rules = {
  required: (v: string | number | null) => !!v || 'This field is required',
  positive: (v: number) => v > 0 || 'Must be greater than 0',
}

// Get tracked metric labels for an activity
function getMetrics(activity: Activity): string[] {
  const metrics: string[] = []
  if (activity.trackDistance) metrics.push(t('activity.trackDistance'))
  if (activity.trackPace) metrics.push(t('activity.trackPace'))
  if (activity.trackElevation) metrics.push(t('activity.trackElevation'))
  if (activity.trackCalories) metrics.push(t('activity.trackCalories'))
  return metrics
}

// Icon mapping
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

function openLogDialog(activity: Activity) {
  selectedActivity.value = activity
  formData.value = {
    activityId: activity.id,
    date: new Date().toISOString().split('T')[0],
    duration: null as unknown as number,
    distance: undefined,
    elevationGain: undefined,
    maxElevation: undefined,
    calories: undefined,
    notes: undefined,
    scheduledSessionId: route.query.scheduledSessionId
      ? Number(route.query.scheduledSessionId)
      : undefined,
  }
  isLogDialogOpen.value = true
}

function closeLogDialog() {
  isLogDialogOpen.value = false
  selectedActivity.value = null
}

// Calculate pace from duration and distance
const calculatedPace = computed(() => {
  if (!formData.value.duration || !formData.value.distance) {
    return null
  }
  const paceMinutes = formData.value.duration / formData.value.distance
  const minutes = Math.floor(paceMinutes)
  const seconds = Math.round((paceMinutes - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    await createActivityLog(formData.value)
    await activityStore.fetchActivityLogs(true)
    toast.success(t('activity.logCreated'), { progressBar: true, duration: 1000 })
    closeLogDialog()
    const returnTo = (route.query.returnTo as string) || '/'
    router.push(returnTo)
  } catch (error) {
    console.error('Error creating activity log:', error)
    toast.error(t('activity.failedToCreateLog'), { progressBar: true, duration: 1000 })
  } finally {
    isSubmitting.value = false
  }
}

async function onCreateClose() {
  isCreateOpen.value = false
  await activityStore.fetchActivities(true)
}

// If navigated with activityId query param, auto-open the dialog
if (route.query.activityId) {
  const preselected = activityStore.activities.find(a => a.id === Number(route.query.activityId))
  if (preselected) {
    openLogDialog(preselected)
  }
}
</script>

<style scoped>
.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.activity-card {
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  border-color: rgb(var(--v-theme-primary)) !important;
}

.activity-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
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
