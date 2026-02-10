<template>
  <v-dialog v-model="dialogOpen" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <v-card class="bg-background">
      <!-- Header -->
      <v-toolbar color="transparent" density="compact">
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ $t('schedule.title') }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="flat"
          color="primary"
          :disabled="!canSubmit"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-toolbar>

      <div class="pa-5 d-flex flex-column ga-5">
        <!-- Type toggle: Workout or Activity -->
        <div>
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('schedule.selectType') }}
          </p>
          <v-btn-toggle
            v-model="sessionType"
            mandatory
            color="primary"
            variant="outlined"
            class="w-100"
          >
            <v-btn value="workout" class="flex-grow-1">
              <v-icon start>mdi-dumbbell</v-icon>
              {{ $t('schedule.workout') }}
            </v-btn>
            <v-btn value="activity" class="flex-grow-1">
              <v-icon start>mdi-run</v-icon>
              {{ $t('schedule.activity') }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Select workout or activity -->
        <div>
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{
              sessionType === 'workout'
                ? $t('schedule.selectWorkout')
                : $t('schedule.selectActivity')
            }}
          </p>
          <v-list
            v-if="itemList.length > 0"
            class="bg-cardBg rounded-lg"
            style="border: 1px solid #474747"
          >
            <v-list-item
              v-for="item in itemList"
              :key="item.id"
              :active="selectedItemId === item.id"
              color="primary"
              @click="selectedItemId = item.id"
            >
              <template #prepend>
                <v-icon :color="selectedItemId === item.id ? 'primary' : undefined">
                  {{ sessionType === 'workout' ? 'mdi-dumbbell' : 'mdi-run' }}
                </v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
              <template #append>
                <v-icon v-if="selectedItemId === item.id" color="primary">mdi-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
          <v-card
            v-else
            class="bg-cardBg rounded-lg pa-4 d-flex align-center justify-center"
            style="border: 1px solid #474747"
          >
            <p class="text-body-2 text-textSecondary">
              {{
                sessionType === 'workout' ? 'No workouts created yet' : 'No activities created yet'
              }}
            </p>
          </v-card>
        </div>

        <!-- Scheduling mode: One-time or Recurring -->
        <div>
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('schedule.title') }}
          </p>
          <v-btn-toggle
            v-model="scheduleMode"
            mandatory
            color="primary"
            variant="outlined"
            class="w-100"
          >
            <v-btn value="one-time" class="flex-grow-1">
              <v-icon start>mdi-calendar</v-icon>
              {{ $t('schedule.oneTime') }}
            </v-btn>
            <v-btn value="recurring" class="flex-grow-1">
              <v-icon start>mdi-repeat</v-icon>
              {{ $t('schedule.recurring') }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- One-time: Date picker -->
        <div v-if="scheduleMode === 'one-time'">
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('schedule.pickDate') }}
          </p>
          <v-text-field
            v-model="selectedDateDisplay"
            type="date"
            variant="outlined"
            density="compact"
            class="bg-cardBg rounded-lg"
            @update:model-value="onDateInput"
          />
        </div>

        <!-- Recurring: Day of week picker -->
        <div v-if="scheduleMode === 'recurring'">
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('schedule.pickDays') }}
          </p>
          <v-btn-toggle
            v-model="selectedDays"
            multiple
            color="primary"
            variant="outlined"
            class="d-flex flex-wrap ga-1"
          >
            <v-btn v-for="(day, idx) in dayLabels" :key="idx" :value="idx" size="small">
              {{ day }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Notes -->
        <div>
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('schedule.notes') }}
          </p>
          <v-textarea
            v-model="notes"
            variant="outlined"
            density="compact"
            rows="2"
            class="bg-cardBg rounded-lg"
            :placeholder="$t('schedule.noNotes')"
          />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useWorkoutStore } from '@/stores/workout.store'
import { useActivityStore } from '@/stores/activity.store'
import { useScheduledSessionStore } from '@/stores/scheduledSession.store'
import type { ScheduledSessionType } from '@/interfaces/ScheduledSession.interface'
import type { Workout } from '@/interfaces/Workout.interface'
import type { Activity } from '@/interfaces/Activity.interface'

const props = defineProps<{
  modelValue: boolean
  preselectedDate?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  scheduled: []
}>()

const dialogOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const workoutStore = useWorkoutStore()
const activityStore = useActivityStore()
const scheduledSessionStore = useScheduledSessionStore()

const sessionType = ref<ScheduledSessionType>('workout')
const selectedItemId = ref<number | null>(null)
const scheduleMode = ref<'one-time' | 'recurring'>('one-time')
const selectedDateDisplay = ref('')
const selectedDays = ref<number[]>([])
const notes = ref('')
const isSubmitting = ref(false)

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface ListItem {
  id: number
  name: string
}

const itemList = computed<ListItem[]>(() => {
  if (sessionType.value === 'workout') {
    return ((workoutStore.workouts || []) as Workout[]).map(w => ({
      id: w.id,
      name: w.title,
    }))
  } else {
    return ((activityStore.activities || []) as Activity[]).map(a => ({
      id: a.id,
      name: a.name,
    }))
  }
})

const canSubmit = computed(() => {
  if (!selectedItemId.value) return false
  if (scheduleMode.value === 'one-time' && !selectedDateDisplay.value) return false
  if (scheduleMode.value === 'recurring' && selectedDays.value.length === 0) return false
  return true
})

// Reset form when dialog opens
watch(dialogOpen, async open => {
  if (open) {
    sessionType.value = 'workout'
    selectedItemId.value = null
    scheduleMode.value = 'one-time'
    selectedDateDisplay.value = props.preselectedDate || ''
    selectedDays.value = []
    notes.value = ''

    await Promise.all([workoutStore.setWorkouts(), activityStore.fetchActivities()])
  }
})

// Reset selected item when type changes
watch(sessionType, () => {
  selectedItemId.value = null
})

function onDateInput(val: string) {
  selectedDateDisplay.value = val
}

function close() {
  dialogOpen.value = false
}

async function submit() {
  if (!canSubmit.value) return
  isSubmitting.value = true

  try {
    if (scheduleMode.value === 'recurring') {
      // Create one scheduled session per selected day
      const promises = selectedDays.value.map(dayOfWeek =>
        scheduledSessionStore.create({
          type: sessionType.value,
          ...(sessionType.value === 'workout'
            ? { workoutId: selectedItemId.value! }
            : { activityId: selectedItemId.value! }),
          isRecurring: true,
          dayOfWeek,
          notes: notes.value || undefined,
        })
      )
      await Promise.all(promises)
    } else {
      await scheduledSessionStore.create({
        type: sessionType.value,
        ...(sessionType.value === 'workout'
          ? { workoutId: selectedItemId.value! }
          : { activityId: selectedItemId.value! }),
        isRecurring: false,
        scheduledDate: selectedDateDisplay.value,
        notes: notes.value || undefined,
      })
    }

    emit('scheduled')
    close()
  } catch (error) {
    console.error('Failed to create scheduled session:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
