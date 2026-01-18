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
                  :key="session.id"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex flex-wrap align-center w-100 ga-2">
                      <div class="mr-4">
                        <div class="text-subtitle-1 font-weight-medium">
                          {{ title(session) }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ $t('sessionList.started') }}: {{ formatDateTime(session.startedAt) }}
                          <span v-if="session.endedAt">
                            • {{ $t('sessionList.ended') }}: {{ formatDateTime(session.endedAt) }}
                          </span>
                          • {{ $t('sessionList.duration') }}:
                          {{
                            durationMinutes(
                              session.startedAt,
                              session.endedAt || undefined
                            )
                          }}
                        </div>
                      </div>

                      <div class="d-flex ga-2 flex-wrap">
                        <v-chip
                          :color="statusColor(session.status)"
                          size="small"
                          variant="flat"
                          class="text-uppercase"
                        >
                          {{ statusLabel(session.status) }}
                        </v-chip>

                        <v-chip
                          size="small"
                          variant="outlined"
                        >
                          {{ $t('sessionList.totalWeight') }}: {{ session.totalWeight }} {{ $t('units.kgShort') }}
                        </v-chip>
                      </div>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-row class="mb-2">
                      <v-col
                        cols="12"
                        md="8"
                      >
                        <div class="text-body-2">
                          {{
                            session.workoutSnapshot?.description ||
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
                          {{ $t('common.createdAt') }}: {{ formatDateTime(session.createdAt) }} •
                          {{ $t('common.updatedAt') }}: {{ formatDateTime(session.updatedAt) }}
                        </div>
                      </v-col>
                    </v-row>

                    <v-divider class="my-2" />

                    <div class="text-subtitle-2 mb-2">
                      {{ $t('sessionList.exercises') }}
                    </div>
                    <v-row>
                      <v-col
                        v-for="ex in session.exercises"
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

                    <v-divider class="my-2" />

                    <div class="d-flex align-center justify-space-between mt-4">
                      <div class="text-caption">
                        {{ $t('sessionList.sessionNotes') }}: {{ session.notes || '—' }}
                      </div>
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-delete"
                        @click="handleDelete(session.id)"
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
import type { WorkoutSession } from '@/interfaces/workoutSession.interface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const searchQuery = ref('');
const store = useWorkoutSessionStore();
const sessions = computed<WorkoutSession[]>(() => {
  return ((store.workoutSessions as WorkoutSession[]) || [])
    .filter(session => {
      if (!searchQuery.value) return true; // Show all if no search query

      const query = searchQuery.value.toLowerCase().trim();
      
      if (session.workoutSnapshot?.title?.toLowerCase().includes(query)) return true;
      
      if (session.notes?.toLowerCase().includes(query)) return true;
      
      if (session.exercises?.some(ex => 
        ex.exerciseSnapshot?.name?.toLowerCase().includes(query) ||
        ex.exerciseSnapshot?.description?.toLowerCase().includes(query)
      )) return true;
      
      return false;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startedAt).getTime();
      const dateB = new Date(b.startedAt).getTime();
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

function durationMinutes(start?: string, end?: string) {
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

function title(session: WorkoutSession) {
  return session.workoutSnapshot?.title || `Session #${session.id}`;
}

async function handleDelete(sessionId: number) {
  if (
    confirm(
      t('sessionList.deleteConfirm'),
    )
  ) {
    await store.deleteSession(sessionId);
  }
}

onMounted(() => {
  store.setWorkoutSessions(true);
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