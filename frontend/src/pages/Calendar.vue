<template>
  <div class="pa-5 d-flex flex-column ga-5">
    <!-- Month Navigation Header -->
    <div>
      <h1>Calendar</h1>
      <p>Track your workout history</p>
    </div>

    <!-- Dynamic Stats Card -->
    <v-card
      class="bg-cardBg pa-5 d-flex justify-space-between rounded-lg"
      style="border: 1px solid #474747"
    >
      <div class="d-flex align-center ga-4">
        <v-avatar color="avatarBg" size="48">
          <v-icon size="32" color="primary">mdi-fire</v-icon>
        </v-avatar>
        <div>
          <p class="text-subtitle-2 text-textSecondary">{{ $t('calendar.workoutsThisMonth') }}</p>
          <h1 class="text-h6">{{ workoutsThisMonth }} {{ $t('progress.workouts') }}</h1>
        </div>
      </div>
      <div>
        <p class="text-subtitle-2 text-textSecondary">{{ $t('calendar.currentStreak') }}</p>
        <div class="d-flex align-center ga-1">
          <h1 class="text-h6 text-primary">
            {{ streakInfo?.currentStreak || 0 }} {{ $t('calendar.days') }}
          </h1>
          <v-icon color="red" size="24">mdi-fire</v-icon>
        </div>
      </div>
    </v-card>

    <!-- Calendar Grid -->
    <v-card
      elevation="0"
      class="calendar-card bg-cardBg pt-5 px-2 rounded-lg"
      style="border: 1px solid #474747"
    >
      <div class="d-flex align-center justify-space-between">
        <v-btn icon variant="text" size="large" @click="previousMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="text-center" style="flex: 1">
          <div class="text-h5 font-weight-bold" style="letter-spacing: -0.5px">{{ monthName }}</div>
          <div class="text-body-2" style="opacity: 0.6">{{ yearName }}</div>
        </div>
        <v-btn icon variant="text" size="large" @click="nextMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-card-text class="pa-2">
        <div class="modern-calendar">
          <!-- Weekday headers -->
          <div
            v-for="day in weekdays"
            :key="day"
            class="text-center text-caption font-weight-bold text-uppercase text-textSecondary"
          >
            {{ day }}
          </div>

          <!-- Calendar days -->
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="calendar-cell bg-cardBg"
            :class="{
              'other-month': !day.isCurrentMonth,
              'is-today': day.isToday,
              'has-activity': day.events.length > 0,
              'is-selected': day.date === selectedDate,
            }"
            @click="selectDay(day)"
          >
            <div class="cell-content">
              <div class="day-number">{{ day.dayNumber }}</div>

              <!-- Activity indicators -->
              <div v-if="day.events.length > 0" class="activity-indicators">
                <div
                  v-for="(event, idx) in day.events.slice(0, 3)"
                  :key="event.id"
                  class="activity-dot"
                  :class="event.type"
                  :style="{ animationDelay: `${Number(idx) * 100}ms` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Day Detail View -->
    <div class="d-flex flex-column ga-3 pb-16">
      <!-- Date Header -->
      <div class="d-flex align-center justify-space-between">
        <h3 class="text-h6 font-weight-bold">{{ selectedDateLabel }}</h3>
        <v-btn
          v-if="isSelectedDateFutureOrToday"
          variant="text"
          size="small"
          color="primary"
          @click="openScheduleDialog"
        >
          {{ $t('calendar.scheduleSession') }}
        </v-btn>
        <v-btn v-else variant="text" size="small" color="primary" @click="openAddPastDialog">
          {{ $t('calendar.addPastSession') }}
        </v-btn>
      </div>

      <!-- Scheduled Sessions (not completed) -->
      <template v-if="scheduledForSelectedDate.length > 0">
        <p class="text-caption text-uppercase font-weight-bold text-textSecondary">
          {{ $t('calendar.scheduledSessions') }}
        </p>
        <v-card
          v-for="session in scheduledForSelectedDate"
          :key="'sched-' + session.id + session.resolvedDate"
          class="bg-cardBg rounded-lg pa-4"
          style="border: 1px solid #474747"
          @click="openBottomSheet(session)"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-3">
              <v-avatar color="blue-darken-4" size="40">
                <v-icon size="20" color="blue-lighten-1">
                  {{ session.type === 'workout' ? 'mdi-dumbbell' : 'mdi-run' }}
                </v-icon>
              </v-avatar>
              <div>
                <p class="text-body-1 font-weight-bold">
                  {{ session.type === 'workout' ? session.workout?.title : session.activity?.name }}
                </p>
                <div class="d-flex align-center ga-2">
                  <v-chip size="x-small" color="blue" variant="flat">
                    {{ $t('schedule.scheduled') }}
                  </v-chip>
                  <span v-if="session.isRecurring" class="text-caption text-textSecondary">
                    <v-icon size="12">mdi-repeat</v-icon>
                    {{ $t('schedule.recurring') }}
                  </span>
                </div>
              </div>
            </div>
            <div class="d-flex align-center ga-2">
              <v-btn
                v-if="isSelectedDateToday"
                size="small"
                color="primary"
                variant="flat"
                @click.stop="startScheduledSession(session)"
              >
                {{ session.type === 'workout' ? $t('schedule.start') : $t('schedule.logActivity') }}
              </v-btn>
              <v-icon size="20" class="text-textSecondary">mdi-chevron-right</v-icon>
            </div>
          </div>
        </v-card>
      </template>

      <!-- Completed Sessions -->
      <template v-if="completedForSelectedDate.length > 0">
        <p class="text-caption text-uppercase font-weight-bold text-textSecondary">
          {{ $t('calendar.completedSessions') }}
        </p>
        <v-card
          v-for="event in completedForSelectedDate"
          :key="event.id"
          class="bg-cardBg rounded-lg pa-4"
          style="border: 1px solid #474747"
        >
          <div class="d-flex align-center ga-3">
            <v-avatar
              :color="event.type === 'workout' ? 'green-darken-4' : 'amber-darken-4'"
              size="40"
            >
              <v-icon
                size="20"
                :color="event.type === 'workout' ? 'green-lighten-1' : 'amber-lighten-1'"
              >
                {{ event.type === 'workout' ? 'mdi-dumbbell' : 'mdi-run' }}
              </v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <p class="text-body-1 font-weight-bold">{{ event.name }}</p>
              <div class="d-flex align-center ga-2 mt-1">
                <v-chip
                  size="x-small"
                  :color="event.type === 'workout' ? 'green' : 'amber'"
                  variant="flat"
                >
                  {{ event.type === 'workout' ? $t('schedule.workout') : $t('schedule.activity') }}
                </v-chip>
                <span v-if="event.duration" class="text-caption text-textSecondary">
                  <v-icon size="12">mdi-clock-outline</v-icon>
                  {{ event.duration }}
                </span>
                <span v-if="event.totalWeight" class="text-caption text-textSecondary">
                  <v-icon size="12">mdi-weight-kilogram</v-icon>
                  {{ event.totalWeight }} kg
                </span>
              </div>
            </div>
          </div>
        </v-card>
      </template>

      <!-- Empty State -->
      <v-card
        v-if="completedForSelectedDate.length === 0 && scheduledForSelectedDate.length === 0"
        class="bg-cardBg rounded-lg pa-8 d-flex flex-column align-center ga-3"
        style="border: 1px solid #474747"
      >
        <v-icon size="48" class="text-textSecondary">mdi-calendar-blank</v-icon>
        <p class="text-body-1 font-weight-bold text-textSecondary">
          {{
            isSelectedDateFutureOrToday
              ? $t('calendar.noWorkoutScheduled')
              : $t('calendar.noWorkoutDone')
          }}
        </p>
        <v-btn
          v-if="isSelectedDateToday"
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="$router.push('/workout')"
        >
          {{ $t('calendar.startWorkout') }}
        </v-btn>
        <v-btn
          v-else-if="isSelectedDateFuture"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="openScheduleDialog"
        >
          {{ $t('calendar.scheduleSession') }}
        </v-btn>
        <v-btn
          v-else
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="openAddPastDialog"
        >
          {{ $t('calendar.addPastSession') }}
        </v-btn>
      </v-card>
    </div>

    <!-- Dialogs -->
    <ScheduleSessionDialog
      v-model="isScheduleDialogOpen"
      :preselected-date="selectedDate"
      @scheduled="onScheduleCreated"
    />

    <AddPastSessionDialog
      v-model="isAddPastDialogOpen"
      :date="selectedDate"
      :preselected-type="pastSessionPreselectedType"
      :preselected-workout-id="pastSessionPreselectedWorkoutId"
      :preselected-activity-id="pastSessionPreselectedActivityId"
      :preselected-scheduled-session-id="pastSessionPreselectedScheduledSessionId"
      @session-added="onPastSessionAdded"
    />

    <ScheduledSessionBottomSheet
      v-model="isBottomSheetOpen"
      :scheduled-session="selectedScheduledSession"
      @deleted="onScheduleDeleted"
      @started="onScheduleStarted"
      @log-past="onLogPastFromSchedule"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { useActivityStore } from '@/stores/activity.store'
import { useScheduledSessionStore } from '@/stores/scheduledSession.store'
import { useRouter } from 'vue-router'
import { getStreakInfo } from '@/services/user.service'
import { startWorkoutSession } from '@/services/workoutSession.service'
import type { WorkoutSession } from '@/interfaces/workoutSession.interface'
import type { ActivityLog } from '@/interfaces/Activity.interface'
import type { ScheduledSessionForDate } from '@/interfaces/ScheduledSession.interface'
import type { StreakInfo } from '@/interfaces/User.interface'
import ScheduleSessionDialog from '@/components/Session/ScheduleSessionDialog.vue'
import AddPastSessionDialog from '@/components/Session/AddPastSessionDialog.vue'
import ScheduledSessionBottomSheet from '@/components/Session/ScheduledSessionBottomSheet.vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const currentDate = ref(new Date())
const selectedDate = ref(toLocalDateString(new Date()))
const workoutSessionStore = useWorkoutSessionStore()
const activityStore = useActivityStore()
const scheduledSessionStore = useScheduledSessionStore()
const streakInfo = ref<StreakInfo | null>(null)

// Dialog state
const isScheduleDialogOpen = ref(false)
const isAddPastDialogOpen = ref(false)
const isBottomSheetOpen = ref(false)
const selectedScheduledSession = ref<ScheduledSessionForDate | null>(null)

// Pre-selection state for AddPastSessionDialog (from scheduled session)
const pastSessionPreselectedType = ref<'workout' | 'activity' | undefined>(undefined)
const pastSessionPreselectedWorkoutId = ref<number | null>(null)
const pastSessionPreselectedActivityId = ref<number | null>(null)
const pastSessionPreselectedScheduledSessionId = ref<number | null>(null)

interface CalendarEvent {
  id: string
  sessionId: number
  name: string
  date: Date
  type: 'workout' | 'activity' | 'scheduled'
  rawData: WorkoutSession | ActivityLog | ScheduledSessionForDate
  duration?: string
  totalWeight?: number | null
}

interface CalendarDay {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

const weekdays = computed(() => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long' })
})

const yearName = computed(() => {
  return currentDate.value.getFullYear().toString()
})

const todayStr = computed(() => toLocalDateString(new Date()))

const isSelectedDateToday = computed(() => selectedDate.value === todayStr.value)

const isSelectedDateFuture = computed(() => selectedDate.value > todayStr.value)

const isSelectedDateFutureOrToday = computed(() => selectedDate.value >= todayStr.value)

const selectedDateLabel = computed(() => {
  if (isSelectedDateToday.value) return t('calendar.today')

  const d = new Date(selectedDate.value + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
})

// Workouts this month (dynamic)
const workoutsThisMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  let count = 0

  if (workoutSessionStore.workoutSessions) {
    ;(workoutSessionStore.workoutSessions as WorkoutSession[]).forEach(session => {
      if (session.status === 'finished' && session.endedAt) {
        const d = new Date(session.endedAt)
        if (d.getFullYear() === year && d.getMonth() === month) count++
      }
    })
  }

  if (activityStore.activityLogs) {
    ;(activityStore.activityLogs as ActivityLog[]).forEach(log => {
      const d = new Date(log.date)
      if (d.getFullYear() === year && d.getMonth() === month) count++
    })
  }

  return count
})

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    workoutSessionStore.setWorkoutSessions(true),
    activityStore.fetchActivityLogs(true),
    loadStreakInfo(),
    fetchScheduledRange(),
    scheduledSessionStore.fetchForDate(selectedDate.value),
  ])
})

async function loadStreakInfo() {
  try {
    streakInfo.value = await getStreakInfo()
  } catch (error) {
    console.error('Failed to load streak info:', error)
  }
}

async function fetchScheduledRange() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  const rangeStart = new Date(year, month, 1 - firstDayOfWeek)
  const rangeEnd = new Date(lastDay)
  rangeEnd.setDate(rangeEnd.getDate() + (42 - (lastDay.getDate() + firstDayOfWeek)))

  await scheduledSessionStore.fetchForRange(
    toLocalDateString(rangeStart),
    toLocalDateString(rangeEnd)
  )
}

// All completed events (workout sessions and activity logs)
const allCompletedEvents = computed<CalendarEvent[]>(() => {
  const events: CalendarEvent[] = []

  if (workoutSessionStore.workoutSessions) {
    ;(workoutSessionStore.workoutSessions as WorkoutSession[]).forEach((session, index) => {
      if (session.status === 'finished' && session.endedAt) {
        const startTime = new Date(session.startedAt).getTime()
        const endTime = new Date(session.endedAt).getTime()
        const durationMins = Math.round((endTime - startTime) / 60000)

        events.push({
          id: `workout-${session.id}`,
          sessionId: session.id,
          name: session.workout?.title || t('calendar.workoutNumber', { number: index + 1 }),
          date: new Date(session.endedAt),
          type: 'workout',
          rawData: session,
          duration: `${durationMins} min`,
          totalWeight: session.totalWeight || null,
        })
      }
    })
  }

  if (activityStore.activityLogs) {
    ;(activityStore.activityLogs as ActivityLog[]).forEach(log => {
      events.push({
        id: `activity-${log.id}`,
        sessionId: log.id,
        name: log.activity?.name || 'Activity',
        date: new Date(log.date),
        type: 'activity',
        rawData: log,
        duration: `${log.duration} min`,
      })
    })
  }

  return events
})

// Scheduled events (not completed) from range cache
const scheduledEvents = computed<CalendarEvent[]>(() => {
  return scheduledSessionStore.rangeCache
    .filter(s => !s.isCompleted)
    .map(s => ({
      id: `scheduled-${s.id}-${s.resolvedDate}`,
      sessionId: s.id,
      name: s.type === 'workout' ? s.workout?.title || 'Workout' : s.activity?.name || 'Activity',
      date: new Date(s.resolvedDate + 'T12:00:00'),
      type: 'scheduled' as const,
      rawData: s,
    }))
})

// Completed events for selected date
const completedForSelectedDate = computed(() => {
  return allCompletedEvents.value.filter(e => toLocalDateString(e.date) === selectedDate.value)
})

// Scheduled (not completed) for selected date
const scheduledForSelectedDate = computed(() => {
  return scheduledSessionStore.selectedDateSessions.filter(s => !s.isCompleted)
})

// Build calendar days
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month - 1, prevMonthLastDay.getDate() - i)
    const dateStr = toLocalDateString(day)
    days.push({
      date: dateStr,
      dayNumber: day.getDate(),
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(dateStr),
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i)
    day.setHours(0, 0, 0, 0)
    const dateStr = toLocalDateString(day)
    days.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: day.getTime() === today.getTime(),
      events: getEventsForDate(dateStr),
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(year, month + 1, i)
    const dateStr = toLocalDateString(day)
    days.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(dateStr),
    })
  }

  return days
})

function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getEventsForDate(dateStr: string): CalendarEvent[] {
  const completed = allCompletedEvents.value.filter(
    event => toLocalDateString(event.date) === dateStr
  )
  const scheduled = scheduledEvents.value.filter(event => toLocalDateString(event.date) === dateStr)
  return [...completed, ...scheduled]
}

async function selectDay(day: CalendarDay) {
  selectedDate.value = day.date
  await scheduledSessionStore.fetchForDate(day.date)
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  fetchScheduledRange()
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  fetchScheduledRange()
}

function openScheduleDialog() {
  isScheduleDialogOpen.value = true
}

function openAddPastDialog() {
  pastSessionPreselectedType.value = undefined
  pastSessionPreselectedWorkoutId.value = null
  pastSessionPreselectedActivityId.value = null
  pastSessionPreselectedScheduledSessionId.value = null
  isAddPastDialogOpen.value = true
}

function onLogPastFromSchedule(session: ScheduledSessionForDate) {
  pastSessionPreselectedType.value = session.type as 'workout' | 'activity'
  pastSessionPreselectedWorkoutId.value = session.workout?.id ?? null
  pastSessionPreselectedActivityId.value = session.activity?.id ?? null
  pastSessionPreselectedScheduledSessionId.value = session.id
  // Use the scheduled session's resolved date for the dialog
  selectedDate.value = session.resolvedDate
  isAddPastDialogOpen.value = true
}

function openBottomSheet(session: ScheduledSessionForDate) {
  selectedScheduledSession.value = session
  isBottomSheetOpen.value = true
}

async function startScheduledSession(session: ScheduledSessionForDate) {
  if (session.type === 'workout' && session.workout) {
    try {
      const ws = await startWorkoutSession(session.workout.id, session.id)
      await workoutSessionStore.fetchSelectedWorkoutSession(ws.id)
      router.push(`/session/${ws.id}?returnTo=/calendar`)
    } catch (error) {
      console.error('Failed to start scheduled workout:', error)
    }
  } else if (session.type === 'activity' && session.activity) {
    router.push(
      `/log-activity?activityId=${session.activity.id}&scheduledSessionId=${session.id}&returnTo=/calendar`
    )
  }
}

async function onScheduleCreated() {
  await Promise.all([fetchScheduledRange(), scheduledSessionStore.fetchForDate(selectedDate.value)])
}

async function onPastSessionAdded() {
  await Promise.all([
    workoutSessionStore.setWorkoutSessions(true),
    activityStore.fetchActivityLogs(true),
    scheduledSessionStore.fetchForDate(selectedDate.value),
    loadStreakInfo(),
  ])
}

async function onScheduleDeleted() {
  await Promise.all([fetchScheduledRange(), scheduledSessionStore.fetchForDate(selectedDate.value)])
}

async function onScheduleStarted() {
  await Promise.all([fetchScheduledRange(), scheduledSessionStore.fetchForDate(selectedDate.value)])
}
</script>

<style scoped>
/* Calendar Grid — no Vuetify equivalent for CSS grid */
.modern-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.calendar-cell:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.05);
}

.calendar-cell.other-month {
  opacity: 0.3;
}

.calendar-cell.is-today {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.2),
    rgba(var(--v-theme-primary), 0.1)
  );
  border: 2px solid rgb(var(--v-theme-primary));
}

.calendar-cell.is-today .day-number {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}

.calendar-cell.is-selected {
  background: rgba(var(--v-theme-primary), 0.15);
  border: 2px solid rgb(var(--v-theme-primary));
}

.calendar-cell.has-activity {
  background: rgba(var(--v-theme-primary), 0.04);
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 8px 4px;
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.activity-indicators {
  display: flex;
  gap: 4px;
  margin-top: auto;
}

.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Green for completed workouts */
.activity-dot.workout {
  background: #4caf50;
}

/* Yellow/amber for completed activities */
.activity-dot.activity {
  background: #ffc107;
}

/* Blue for scheduled sessions */
.activity-dot.scheduled {
  background: #2196f3;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .day-number {
    font-size: 14px;
  }
}
</style>
