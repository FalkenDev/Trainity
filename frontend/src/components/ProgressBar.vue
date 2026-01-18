<template>
  <v-card
    class="pa-5"
    style="border-radius: 10px"
  >
    <div class="d-flex justify-space-between align-center">
      <h1 class="text-h6">
        {{ $t('progress.week') }} {{ currentWeek }}
      </h1>
    </div>
    <div class="d-flex justify-space-between align-center my-5">
      <div
        v-for="(day, index) in weekdays"
        :key="day"
      >
        <v-avatar
          :color="getDayColor(index)"
          size="40"
        >
          <span class="text-body-2">{{ day }}</span>
        </v-avatar>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import type { WorkoutSession } from '@/interfaces/workoutSession.interface';

const { tm } = useI18n({ useScope: 'global' });
const workoutSessionStore = useWorkoutSessionStore();

const weekdays = computed(() => {
  const v = tm('progress.weekdaysShort');
  return Array.isArray(v) ? (v as string[]) : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
});

// Get current week number (ISO week)
const currentWeek = computed(() => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
});

// Get the start and end of the current week (Monday to Sunday)
const currentWeekRange = computed(() => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  // Adjust for Monday as start of week (0 = Sunday, 1 = Monday, etc.)
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
});

// Get completed sessions for the current week
const completedDaysThisWeek = computed(() => {
  const sessions = workoutSessionStore.workoutSessions as WorkoutSession[];
  const { start, end } = currentWeekRange.value;
  
  const completedDays = new Set<number>();
  
  sessions.forEach((session: WorkoutSession) => {
    if (session.status === 'finished' && session.endedAt) {
      const sessionDate = new Date(session.endedAt);
      if (sessionDate >= start && sessionDate <= end) {
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        let dayOfWeek = sessionDate.getDay();
        // Convert to Monday = 0, Sunday = 6
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        completedDays.add(dayOfWeek);
      }
    }
  });
  
  return completedDays;
});

// Get color for each day based on workout completion
function getDayColor(dayIndex: number): string {
  if (completedDaysThisWeek.value.has(dayIndex)) {
    return 'success';
  }
  return 'grey-darken-3';
}
</script>
