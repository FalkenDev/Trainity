<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4">
    <BackHeader
      :title="$t('sessionList.title')"
      show-menu
      @close="emit('close')"
    />

    <div class="content-scroll">
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <v-card-title class="d-flex ga-10 justify-space-between align-center">
              <div class="text-h6 w-100">
                <v-text-field
                  v-model="searchQuery"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  :label="$t('common.search')"
                  clearable
                  hide-details
                  density="compact"
                  width="100%"
                />
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ sessions.length }} {{ $t('common.total') }}
              </div>
            </v-card-title>

            <v-divider />

            <v-card-text
              v-if="sessions.length > 0"
              class="pa-0"
            >
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="session in sessions"
                  :key="`${session.type}-${session.data.id}`"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex flex-wrap align-center w-100 ga-2">
                      <div class="mr-4">
                        <div class="text-subtitle-1 font-weight-medium">
                          {{ title(session) }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          <!-- Workout Session -->
                          <template v-if="session.type === 'workout'">
                            {{ $t('sessionList.started') }}: {{ formatDateTime((session.data as WorkoutSession).startedAt) }}
                            <span v-if="(session.data as WorkoutSession).endedAt">
                              • {{ $t('sessionList.ended') }}: {{ formatDateTime((session.data as WorkoutSession).endedAt) }}
                            </span>
                            • {{ $t('sessionList.duration') }}:
                            {{
                              durationMinutes(
                                (session.data as WorkoutSession).startedAt,
                                (session.data as WorkoutSession).endedAt || undefined
                              )
                            }}
                          </template>
                          <!-- Activity Log -->
                          <template v-else>
                            {{ $t('common.date') }}: {{ formatDateTime((session.data as ActivityLog).date) }}
                            • {{ $t('sessionList.duration') }}: {{ durationMinutes(undefined, undefined, (session.data as ActivityLog).duration) }}
                            <span v-if="(session.data as ActivityLog).distance">
                              • {{ $t('activity.distance') }}: {{ (session.data as ActivityLog).distance }} {{ $t('units.km') }}
                            </span>
                          </template>
                        </div>
                      </div>

                      <div class="d-flex ga-2 flex-wrap">
                        <!-- Type chip -->
                        <v-chip
                          :color="session.type === 'workout' ? 'primary' : 'secondary'"
                          size="small"
                          variant="flat"
                        >
                          {{ session.type === 'workout' ? $t('sessionList.workoutSession') : $t('sessionList.activityLog') }}
                        </v-chip>

                        <!-- Workout Session: Status chip -->
                        <v-chip
                          v-if="session.type === 'workout'"
                          :color="statusColor((session.data as WorkoutSession).status)"
                          size="small"
                          variant="flat"
                          class="text-uppercase"
                        >
                          {{ statusLabel((session.data as WorkoutSession).status) }}
                        </v-chip>

                        <!-- Workout Session: Total Weight -->
                        <v-chip
                          v-if="session.type === 'workout'"
                          size="small"
                          variant="outlined"
                        >
                          {{ $t('sessionList.totalWeight') }}: {{ (session.data as WorkoutSession).totalWeight }} {{ $t('units.kgShort') }}
                        </v-chip>

                        <!-- Activity Log: Calories -->
                        <v-chip
                          v-if="session.type === 'activity' && (session.data as ActivityLog).calories"
                          size="small"
                          variant="outlined"
                        >
                          {{ $t('activity.calories') }}: {{ (session.data as ActivityLog).calories }} {{ $t('units.kcal') }}
                        </v-chip>
                      </div>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <!-- Workout Session Details -->
                    <template v-if="session.type === 'workout'">
                      <v-row class="mb-2">
                        <v-col
                          cols="12"
                          md="8"
                        >
                          <div class="text-body-2">
                            {{
                              (session.data as WorkoutSession).workoutSnapshot?.description ||
                                $t('common.noDescription')
                            }}
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          class="d-flex justify-end"
                        >
                          <div class="text-caption text-medium-emphasis">
                            {{ $t('common.createdAt') }}: {{ formatDateTime(session.data.createdAt) }} <br />
                            {{ $t('common.updatedAt') }}: {{ formatDateTime(session.data.updatedAt) }}
                          </div>
                        </v-col>
                      </v-row>

                      <v-divider class="my-2" />

                      <div class="text-subtitle-2 mb-2">
                        {{ $t('sessionList.exercises') }}
                      </div>
                      <v-row>
                        <v-col
                          v-for="ex in (session.data as WorkoutSession).exercises"
                          :key="ex.exerciseId"
                          cols="12"
                        >
                          <v-card
                            variant="text"
                            class="pa-2"
                          >
                            <div class="d-flex justify-space-between align-start">
                              <div>
                                <div class="text-subtitle-2">
                                  {{ ex.exerciseSnapshot?.name || $t('sessionList.exerciseFallback') }}
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                  {{ ex.exerciseSnapshot?.description || '' }}
                                </div>
                              </div>

                              <div class="text-caption text-medium-emphasis">
                                {{ $t('sessionList.sets') }}: {{ ex.sets?.length || 0 }}
                              </div>
                            </div>

                            <v-table
                              density="comfortable"
                              class="mt-2"
                            >
                              <thead>
                                <tr>
                                  <th class="text-left">
                                    {{ $t('table.set') }}
                                  </th>
                                  <th class="text-left">
                                    {{ $t('sessionList.weightKg') }}
                                  </th>
                                  <th class="text-left">
                                    {{ $t('table.reps') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="s in ex.sets"
                                  :key="s.setNumber"
                                >
                                  <td>#{{ s.setNumber }}</td>
                                  <td>{{ s.weight }}</td>
                                  <td>{{ s.reps }}</td>
                                </tr>
                                <tr v-if="!ex.sets || ex.sets.length === 0">
                                  <td
                                    colspan="5"
                                    class="text-medium-emphasis"
                                  >
                                    {{ $t('sessionList.noSetsRecorded') }}
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                          </v-card>
                        </v-col>
                      </v-row>
                    </template>

                    <!-- Activity Log Details -->
                    <template v-else>
                      <v-row class="mb-2">
                        <v-col cols="12">
                          <v-card variant="text" class="pa-2">
                            <div class="text-subtitle-2 mb-2">{{ $t('sessionList.activityDetails') }}</div>
                            <v-row dense>
                              <v-col v-if="(session.data as ActivityLog).distance" cols="6">
                                <div class="text-caption text-medium-emphasis">{{ $t('activity.distance') }}</div>
                                <div class="text-body-1">{{ (session.data as ActivityLog).distance }} {{ $t('units.km') }}</div>
                              </v-col>
                              <v-col v-if="(session.data as ActivityLog).pace" cols="6">
                                <div class="text-caption text-medium-emphasis">{{ $t('activity.pace') }}</div>
                                <div class="text-body-1">{{ (session.data as ActivityLog).pace }}</div>
                              </v-col>
                              <v-col v-if="(session.data as ActivityLog).calories" cols="6">
                                <div class="text-caption text-medium-emphasis">{{ $t('activity.calories') }}</div>
                                <div class="text-body-1">{{ (session.data as ActivityLog).calories }} {{ $t('units.kcal') }}</div>
                              </v-col>
                              <v-col cols="6">
                                <div class="text-caption text-medium-emphasis">{{ $t('sessionList.duration') }}</div>
                                <div class="text-body-1">{{ durationMinutes(undefined, undefined, (session.data as ActivityLog).duration) }}</div>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                        <v-col cols="12">
                          <div class="text-caption text-medium-emphasis">
                            {{ $t('common.createdAt') }}: {{ formatDateTime(session.data.createdAt) }}
                          </div>
                        </v-col>
                      </v-row>
                    </template>

                    <v-divider class="my-2" />

                    <div class="d-flex align-center justify-space-between mt-4">
                      <div class="text-caption">
                        {{ $t('sessionList.sessionNotes') }}: {{ session.data.notes || '—' }}
                      </div>
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-delete"
                        @click="handleDelete(session.type, session.data.id)"
                      >
                        {{ $t('common.delete') }}
                      </v-btn>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
            <div
              v-else
              class="py-10"
            >
              <p class="text-center text-subtitle text-medium-emphasis">
                {{ $t('sessionList.noSessionsFound') }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import { useActivityStore } from '@/stores/activity.store';
import type { WorkoutSession } from '@/interfaces/workoutSession.interface';
import type { ActivityLog } from '@/interfaces/Activity.interface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const searchQuery = ref('');
const workoutSessionStore = useWorkoutSessionStore();
const activityStore = useActivityStore();

type UnifiedSession = 
  | { type: 'workout'; data: WorkoutSession }
  | { type: 'activity'; data: ActivityLog };

const sessions = computed<UnifiedSession[]>(() => {
  const workoutSessions: UnifiedSession[] = ((workoutSessionStore.workoutSessions as WorkoutSession[]) || [])
    .map(session => ({ type: 'workout' as const, data: session }));
  
  const activityLogs: UnifiedSession[] = ((activityStore.activityLogs as ActivityLog[]) || [])
    .map(log => ({ type: 'activity' as const, data: log }));
  
  const combined = [...workoutSessions, ...activityLogs];
  
  return combined
    .filter(session => {
      if (!searchQuery.value) return true;

      const query = searchQuery.value.toLowerCase().trim();
      
      if (session.type === 'workout') {
        const ws = session.data as WorkoutSession;
        if (ws.workoutSnapshot?.title?.toLowerCase().includes(query)) return true;
        if (ws.notes?.toLowerCase().includes(query)) return true;
        if (ws.exercises?.some(ex => 
          ex.exerciseSnapshot?.name?.toLowerCase().includes(query) ||
          ex.exerciseSnapshot?.description?.toLowerCase().includes(query)
        )) return true;
      } else {
        const al = session.data as ActivityLog;
        if (al.activity?.name?.toLowerCase().includes(query)) return true;
        if (al.notes?.toLowerCase().includes(query)) return true;
      }
      
      return false;
    })
    .sort((a, b) => {
      const dateA = a.type === 'workout' 
        ? new Date((a.data as WorkoutSession).startedAt).getTime()
        : new Date((a.data as ActivityLog).date).getTime();
      const dateB = b.type === 'workout'
        ? new Date((b.data as WorkoutSession).startedAt).getTime()
        : new Date((b.data as ActivityLog).date).getTime();
      return dateB - dateA;
    });
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function formatDateTime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}

function durationMinutes(start?: string, end?: string, duration?: number) {
  // For activity logs with duration field
  if (duration !== undefined) {
    return `${duration} ${t('units.minShort')}`;
  }
  // For workout sessions with start/end times
  if (!start) return '';
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const mins = Math.max(0, Math.round((e - s) / 60000));
  return `${mins} ${t('units.minShort')}`;
}

function statusLabel(status: WorkoutSession['status']) {
  const key = `session.status.${status}` as const;
  return t(key);
}

function statusColor(status: WorkoutSession['status']) {
  switch (status) {
    case 'finished':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'abandoned':
      return 'error';
    default:
      return 'default';
  }
}

function title(session: UnifiedSession) {
  if (session.type === 'workout') {
    return (session.data as WorkoutSession).workoutSnapshot?.title || `Session #${(session.data as WorkoutSession).id}`;
  } else {
    return (session.data as ActivityLog).activity?.name || `Activity #${(session.data as ActivityLog).id}`;
  }
}

async function handleDelete(sessionType: 'workout' | 'activity', sessionId: number) {
  if (
    confirm(
      t('sessionList.deleteConfirm'),
    )
  ) {
    if (sessionType === 'workout') {
      await workoutSessionStore.deleteSession(sessionId);
    } else {
      await activityStore.deleteActivityLog(sessionId);
    }
  }
}

onMounted(() => {
  workoutSessionStore.setWorkoutSessions(true);
  activityStore.fetchActivityLogs(true);
});

</script>

<style scoped>
.content-scroll {
  height: calc(100vh - 56px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
