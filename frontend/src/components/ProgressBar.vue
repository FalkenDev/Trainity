<template>
  <v-card
    class="px-5 py-4 bg-cardBg d-flex ga-2 flex-column rounded-lg"
    style="border: 1px solid #474747; box-shadow: none"
  >
    <div class="d-flex justify-space-between align-center">
      <h1 class="text-h6">{{ $t('progress.week') }} {{ currentWeek }}</h1>
    </div>
    <div class="d-flex justify-space-between align-center">
      <div v-for="(day, index) in weekdays" :key="day">
        <v-avatar :color="getDayColor(index)" size="40" :style="getScheduledStyle(index)">
          <span class="text-body-2">{{ day }}</span>
        </v-avatar>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { useActivityStore } from '@/stores/activity.store'
import { useScheduledSessionStore } from '@/stores/scheduledSession.store'
import type { WorkoutSession } from '@/interfaces/workoutSession.interface'

const { tm } = useI18n({ useScope: 'global' })
const workoutSessionStore = useWorkoutSessionStore()
const activityStore = useActivityStore()
const scheduledSessionStore = useScheduledSessionStore()

const weekdays = computed(() => {
  const v = tm('progress.weekdaysShort')
  return Array.isArray(v) ? (v as string[]) : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
})

const currentWeek = computed(() => {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
})

const currentWeekRange = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
})

const completedDaysThisWeek = computed(() => {
  const sessions = workoutSessionStore.workoutSessions as WorkoutSession[]
  const activityLogs = activityStore.activityLogs || []
  const { start, end } = currentWeekRange.value

  const completedDays = new Set<number>()

  sessions.forEach((session: WorkoutSession) => {
    if (session.status === 'finished' && session.endedAt) {
      const sessionDate = new Date(session.endedAt)
      if (sessionDate >= start && sessionDate <= end) {
        let dayOfWeek = sessionDate.getDay()
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        completedDays.add(dayOfWeek)
      }
    }
  })

  activityLogs.forEach(log => {
    const logDate = new Date(log.date)
    if (logDate >= start && logDate <= end) {
      let dayOfWeek = logDate.getDay()
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      completedDays.add(dayOfWeek)
    }
  })

  return completedDays
})

const todayIndex = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  return dayOfWeek === 0 ? 6 : dayOfWeek - 1
})

function getDayColor(dayIndex: number): string {
  if (completedDaysThisWeek.value.has(dayIndex)) {
    return 'success'
  }
  if (dayIndex === todayIndex.value) {
    return 'primary'
  }
  return 'grey-darken-3'
}

// Scheduled days this week (days that have a scheduled session but no completed session)
const scheduledDaysThisWeek = computed(() => {
  const scheduled = new Set<number>()
  const rangeCache = scheduledSessionStore.rangeCache

  if (!rangeCache || rangeCache.length === 0) return scheduled

  const { start, end } = currentWeekRange.value

  rangeCache.forEach(session => {
    if (session.isCompleted) return
    const sessionDate = new Date(session.resolvedDate + 'T12:00:00')
    if (sessionDate >= start && sessionDate <= end) {
      let dayOfWeek = sessionDate.getDay()
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      scheduled.add(dayOfWeek)
    }
  })

  return scheduled
})

function getScheduledStyle(dayIndex: number): Record<string, string> {
  if (scheduledDaysThisWeek.value.has(dayIndex) && !completedDaysThisWeek.value.has(dayIndex)) {
    return { border: '2px solid #2196F3' }
  }
  return {}
}

// Fetch scheduled sessions for the current week on mount
onMounted(async () => {
  const { start, end } = currentWeekRange.value
  const toStr = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  await scheduledSessionStore.fetchForRange(toStr(start), toStr(end))
})
</script>
