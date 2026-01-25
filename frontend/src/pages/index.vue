<template>
  <div class="pa-5 d-flex flex-column ga-5">
    <HomeHeader />
    <v-card
      v-if="streakInfo && streakInfo.currentStreak > 0"
      class="bg-cardBg pa-4 d-flex flex-column ga-2 rounded-lg"
      style="
        border: 1px solid #474747;
        box-shadow: none;
        background: linear-gradient(135deg, #355300 0%, #15181e 100%);
      "
    >
      <div class="d-flex align-center justify-between">
        <div class="d-flex align-center">
          <v-icon size="20" color="primary">mdi-fire</v-icon>
          <span class="text-body-2 text-primary font-weight-bold" style="margin-top: 1px">
            {{ streakInfo.currentStreak }} Day Streak
          </span>
        </div>
      </div>
      <div>
        <p class="text-body-2 text-textPrimary">
          You're on fire! Keep pushing to hit {{ streakInfo.currentStreak + 2 }} days.
        </p>
      </div>
    </v-card>
    <div class="d-flex ga-3">
      <v-btn
        class="flex-grow-1 bg-cardBg rounded-lg"
        style="border: 1px solid #474747; box-shadow: none"
        prepend-icon="mdi-weight"
        size="small"
        @click="$router.push('/log-activity')"
      >
        <template #prepend>
          <v-icon color="yellow-darken-1">mdi-weight</v-icon>
        </template>
        <span class="text-caption">Log Weight</span>
      </v-btn>
      <v-btn
        class="flex-grow-1 bg-cardBg rounded-lg"
        style="border: 1px solid #474747; box-shadow: none"
        size="small"
      >
        <template #prepend>
          <v-icon color="green-darken-1">mdi-chart-line</v-icon>
        </template>
        <span class="text-caption">Progress</span>
      </v-btn>
      <v-btn
        class="flex-grow-1 bg-cardBg rounded-lg"
        style="border: 1px solid #474747; box-shadow: none"
        size="small"
      >
        <template #prepend>
          <v-icon color="red-darken-1">mdi-chart-box</v-icon>
        </template>
        <span class="text-caption">Statistics</span>
      </v-btn>
    </div>
    <ProgressBar />
    <div class="d-flex ga-3">
      <v-card
        class="flex-grow-1 bg-cardBg justify-center align-center py-2 d-flex flex-column align-center rounded-lg"
        style="border: 1px solid #474747; box-shadow: none; flex: 1"
      >
        <v-icon size="24" color="primary">mdi-fire</v-icon>
        <h2 class="text-h5 text-textPrimary mt-1">{{ streakInfo?.currentStreak || 0 }}</h2>
        <p class="text-caption text-textSecondary text-uppercase">Day streak</p>
      </v-card>
      <v-card
        class="flex-grow-1 bg-cardBg justify-center align-center py-2 d-flex flex-column align-center rounded-lg"
        style="border: 1px solid #474747; box-shadow: none; flex: 1"
      >
        <v-icon size="24" color="primary">mdi-bullseye</v-icon>
        <h2 class="text-h5 text-textPrimary mt-1">
          {{ streakInfo?.currentWeekWorkouts || 0 }}/{{ streakInfo?.weeklyWorkoutGoal || 3 }}
        </h2>
        <p class="text-caption text-textSecondary text-uppercase">Weekly goal</p>
      </v-card>
      <v-card
        class="flex-grow-1 bg-cardBg justify-center align-center py-2 d-flex flex-column align-center rounded-lg"
        style="border: 1px solid #474747; box-shadow: none; flex: 1"
      >
        <v-icon size="24" color="primary">mdi-timer</v-icon>
        <h2 class="text-h5 text-textPrimary mt-1">{{ totalMinutesThisWeek }}</h2>
        <p class="text-caption text-textSecondary text-uppercase">Minutes</p>
      </v-card>
    </div>
    <MyWorkouts />
  </div>
</template>

<script lang="ts" setup>
import { getStreakInfo } from '@/services/user.service'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import type { StreakInfo } from '@/interfaces/User.interface'
import type { WorkoutSession } from '@/interfaces/workoutSession.interface'

const workoutSessionStore = useWorkoutSessionStore()
const streakInfo = ref<StreakInfo | null>(null)

// Get the start and end of the current week (Monday to Sunday)
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

// Calculate total minutes for finished sessions this week
const totalMinutesThisWeek = computed(() => {
  const sessions = workoutSessionStore.workoutSessions as WorkoutSession[]
  const { start, end } = currentWeekRange.value

  let totalMinutes = 0

  sessions.forEach((session: WorkoutSession) => {
    if (session.status === 'finished' && session.endedAt && session.startedAt) {
      const sessionDate = new Date(session.endedAt)
      if (sessionDate >= start && sessionDate <= end) {
        const startTime = new Date(session.startedAt).getTime()
        const endTime = new Date(session.endedAt).getTime()
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
        totalMinutes += durationMinutes
      }
    }
  })

  return totalMinutes
})

// Load streak info
const loadStreakInfo = async () => {
  try {
    streakInfo.value = await getStreakInfo()
  } catch (error) {
    console.error('Failed to load streak info:', error)
  }
}

onMounted(() => {
  loadStreakInfo()
})
</script>
