<template>
  <div class="calendar-page">
    <v-container fluid class="pa-0">
      <!-- Month Navigation Header -->
      <div class="month-header">
        <v-btn
          icon
          variant="text"
          size="large"
          @click="previousMonth"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="month-display">
          <div class="month-name">{{ monthName }}</div>
          <div class="year-name">{{ yearName }}</div>
        </div>
        <v-btn
          icon
          variant="text"
          size="large"
          @click="nextMonth"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Calendar Grid -->
      <v-card elevation="0" class="calendar-card mt-10">
        <v-card-text class="pa-2">
          <div class="modern-calendar">
            <!-- Weekday headers -->
            <div
              v-for="day in weekdays"
              :key="day"
              class="weekday-header"
            >
              {{ day }}
            </div>

            <!-- Calendar days -->
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="calendar-cell"
              :class="{
                'other-month': !day.isCurrentMonth,
                'is-today': day.isToday,
                'has-activity': day.events.length > 0
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

      <!-- Recent Sessions -->
      <div class="recent-sessions">
        <div class="section-header">
          <h3 class="section-title">{{ $t('calendar.recentActivity') }}</h3>
          <v-btn
            variant="text"
            size="small"
            color="primary"
            @click="viewAllSessions"
          >
            {{ $t('common.viewAll') }}
          </v-btn>
        </div>

        <div v-if="recentSessions.length > 0" class="sessions-list">
          <v-card
            v-for="session in recentSessions"
            :key="session.id"
            class="session-card"
            elevation="0"
            @click="openSessionDetails(session)"
          >
            <v-card-text class="pa-4">
              <div class="session-date">
                <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                {{ formatSessionDate(session.date) }}
              </div>
              
              <div class="session-content">
                <div class="session-info">
                  <h4 class="session-title">{{ session.title }}</h4>
                  
                  <div class="session-meta">
                    <v-chip
                      size="small"
                      :color="session.type === 'workout' ? 'primary' : 'secondary'"
                      variant="flat"
                    >
                      <v-icon start size="small">
                        {{ session.type === 'workout' ? 'mdi-dumbbell' : 'mdi-run' }}
                      </v-icon>
                      {{ session.typeLabel }}
                    </v-chip>
                    
                    <div class="session-stats">
                      <span class="stat-item">
                        <v-icon size="small">mdi-clock-outline</v-icon>
                        {{ session.duration }}
                      </span>
                      
                      <span v-if="session.type === 'workout' && session.totalWeight" class="stat-item">
                        <v-icon size="small">mdi-weight-kilogram</v-icon>
                        {{ session.totalWeight }} kg
                      </span>
                      
                      <span v-if="session.type === 'activity' && session.distance" class="stat-item">
                        <v-icon size="small">mdi-map-marker-distance</v-icon>
                        {{ session.distance }} km
                      </span>
                      
                      <span v-if="session.type === 'activity' && session.calories" class="stat-item">
                        <v-icon size="small">mdi-fire</v-icon>
                        {{ session.calories }} kcal
                      </span>
                    </div>
                  </div>
                </div>
                
                <v-icon class="chevron-icon">mdi-chevron-right</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <div v-else class="empty-state">
          <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
          <p class="text-medium-emphasis mt-4">{{ $t('calendar.noRecentActivity') }}</p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import { useActivityStore } from '@/stores/activity.store';
import { useRouter } from 'vue-router';
import type { WorkoutSession } from '@/interfaces/workoutSession.interface';
import type { ActivityLog } from '@/interfaces/Activity.interface';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

const currentDate = ref(new Date());
const workoutSessionStore = useWorkoutSessionStore();
const activityStore = useActivityStore();

interface CalendarEvent {
  id: string;
  sessionId: number;
  name: string;
  date: Date;
  type: 'workout' | 'activity';
  rawData: WorkoutSession | ActivityLog;
}

interface CalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface RecentSession {
  id: string;
  sessionId: number;
  type: 'workout' | 'activity';
  title: string;
  date: Date;
  typeLabel: string;
  duration: string;
  totalWeight: number | null;
  distance: number | null;
  calories: number | null;
}

const weekdays = computed(() => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
});

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long' });
});

const yearName = computed(() => {
  return currentDate.value.getFullYear().toString();
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    workoutSessionStore.setWorkoutSessions(true),
    activityStore.fetchActivityLogs(true),
  ]);
});

// Get all events (workout sessions and activity logs)
const allEvents = computed<CalendarEvent[]>(() => {
  const events: CalendarEvent[] = [];

  // Add workout sessions
  if (workoutSessionStore.workoutSessions) {
    (workoutSessionStore.workoutSessions as WorkoutSession[]).forEach((session, index) => {
      if (session.status === 'finished' && session.endedAt) {
        events.push({
          id: `workout-${session.id}`,
          sessionId: session.id,
          name: session.workoutSnapshot?.title || t('calendar.workoutNumber', { number: index + 1 }),
          date: new Date(session.endedAt),
          type: 'workout',
          rawData: session,
        });
      }
    });
  }

  // Add activity logs
  if (activityStore.activityLogs) {
    (activityStore.activityLogs as ActivityLog[]).forEach((log) => {
      events.push({
        id: `activity-${log.id}`,
        sessionId: log.id,
        name: log.activity.name,
        date: new Date(log.date),
        type: 'activity',
        rawData: log,
      });
    });
  }

  return events;
});

// Get recent sessions (last 5)
const recentSessions = computed<RecentSession[]>(() => {
  const sessions = [...allEvents.value]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map(event => {
      if (event.type === 'workout') {
        const ws = event.rawData as WorkoutSession;
        const startTime = new Date(ws.startedAt).getTime();
        const endTime = ws.endedAt ? new Date(ws.endedAt).getTime() : Date.now();
        const durationMins = Math.round((endTime - startTime) / 60000);
        
        return {
          id: event.id,
          sessionId: event.sessionId,
          type: 'workout' as const,
          title: event.name,
          date: event.date,
          typeLabel: t('sessionList.workoutSession'),
          duration: `${durationMins} ${t('units.minShort')}`,
          totalWeight: ws.totalWeight,
          distance: null,
          calories: null,
        };
      } else {
        const al = event.rawData as ActivityLog;
        return {
          id: event.id,
          sessionId: event.sessionId,
          type: 'activity' as const,
          title: event.name,
          date: event.date,
          typeLabel: t('sessionList.activityLog'),
          duration: `${al.duration} ${t('units.minShort')}`,
          totalWeight: null,
          distance: al.distance ?? null,
          calories: al.calories ?? null,
        };
      }
    });

  return sessions;
});

// Build calendar days
const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay();
  // Convert to Monday = 0
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Add days from previous month
  const prevMonthLastDay = new Date(year, month, 0);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
    days.push({
      date: day.toISOString(),
      dayNumber: day.getDate(),
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(day),
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i);
    day.setHours(0, 0, 0, 0);
    days.push({
      date: day.toISOString(),
      dayNumber: i,
      isCurrentMonth: true,
      isToday: day.getTime() === today.getTime(),
      events: getEventsForDate(day),
    });
  }
  
  // Add days from next month to complete the grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(year, month + 1, i);
    days.push({
      date: day.toISOString(),
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(day),
    });
  }
  
  return days;
});

function getEventsForDate(date: Date): CalendarEvent[] {
  const dateStr = date.toISOString().split('T')[0];
  return allEvents.value.filter(event => {
    const eventDateStr = event.date.toISOString().split('T')[0];
    return eventDateStr === dateStr;
  });
}

function formatSessionDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (dateStr === todayStr) {
    return t('calendar.today');
  } else if (dateStr === yesterdayStr) {
    return t('calendar.yesterday');
  } else {
    return date.toLocaleDateString('sv-SE', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  }
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
}

function selectDay(day: CalendarDay) {
  if (day.events.length > 0) {
    // Could open a dialog showing events for this day
    console.log('Selected day:', day);
  }
}

function openSessionDetails(session: RecentSession) {
  // Navigate to session details or open a dialog
  console.log('Open session:', session);
}

function viewAllSessions() {
  // Navigate to sessions list
  router.push('/settings');
}
</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(var(--v-theme-surface), 0.02) 0%, transparent 100%);
}

/* Month Header */
.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 16px 16px;
  background: rgb(var(--v-theme-surface));
}

.month-display {
  text-align: center;
  flex: 1;
}

.month-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.year-name {
  font-size: 14px;
  opacity: 0.6;
  font-weight: 500;
}

/* Calendar Card */
.calendar-card {
  margin: 0 8px 24px;
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface)) !important;
}

/* Modern Calendar Grid */
.modern-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.weekday-header {
  padding: 12px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.5;
}

.calendar-cell {
  aspect-ratio: 1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.calendar-cell:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.05);
}

.calendar-cell.other-month {
  opacity: 0.3;
}

.calendar-cell.other-month:hover {
  opacity: 0.5;
}

.calendar-cell.is-today {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.2), rgba(var(--v-theme-primary), 0.1));
  border: 2px solid rgb(var(--v-theme-primary));
}

.calendar-cell.is-today .day-number {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
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

.activity-dot.workout {
  background: rgb(var(--v-theme-primary));
}

.activity-dot.activity {
  background: rgb(var(--v-theme-secondary));
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

/* Recent Sessions Section */
.recent-sessions {
  padding: 0 16px 80px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-card {
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: all 0.2s ease;
  cursor: pointer;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.session-date {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
  margin-bottom: 12px;
}

.session-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.session-info {
  flex: 1;
}

.session-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}

.session-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  opacity: 0.7;
}

.stat-item .v-icon {
  opacity: 0.6;
}

.chevron-icon {
  opacity: 0.3;
  transition: all 0.2s ease;
}

.session-card:hover .chevron-icon {
  opacity: 0.7;
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}

/* Responsive */
@media (max-width: 600px) {
  .month-name {
    font-size: 20px;
  }
  
  .day-number {
    font-size: 14px;
  }
  
  .session-title {
    font-size: 16px;
  }
  
  .session-stats {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
