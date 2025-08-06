<template>
  <v-container
    fluid
    class="pa-0 bg-grey-darken-4"
  >
    <BackHeader
      title="Sessions"
      show-menu
      @close="emit('close')"
    />

    <div class="content-scroll">
      <v-row>
        <v-col cols="12">
          <v-card elevation="1">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="text-h6">
                Workout Sessions
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ sessions.length }} total
              </div>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-0">
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
                          Started: {{ formatDateTime(session.startedAt) }}
                          <span v-if="session.endedAt">
                            • Ended: {{ formatDateTime(session.endedAt) }}
                          </span>
                          • Duration:
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
                          {{ session.status.replace('_', ' ') }}
                        </v-chip>

                        <v-chip
                          size="small"
                          variant="outlined"
                        >
                          Total: {{ session.totalWeight }} kg
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
                              'No description'
                          }}
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        class="d-flex justify-end"
                      >
                        <div class="text-caption text-medium-emphasis">
                          Created: {{ formatDateTime(session.createdAt) }} •
                          Updated: {{ formatDateTime(session.updatedAt) }}
                        </div>
                      </v-col>
                    </v-row>

                    <v-divider class="my-2" />

                    <div class="text-subtitle-2 mb-2">
                      Exercises
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
                                {{ ex.exerciseSnapshot?.name || 'Exercise' }}
                              </div>
                              <div class="text-caption text-medium-emphasis">
                                {{ ex.exerciseSnapshot?.description || '' }}
                              </div>
                            </div>

                            <div class="text-caption text-medium-emphasis">
                              Sets: {{ ex.sets?.length || 0 }}
                            </div>
                          </div>

                          <v-table
                            density="comfortable"
                            class="mt-2"
                          >
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Set
                                </th>
                                <th class="text-left">
                                  Weight (kg)
                                </th>
                                <th class="text-left">
                                  Reps
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
                                  No sets recorded
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-divider class="my-2" />

                    <div class="text-caption">
                      Session notes: {{ session.notes || '—' }}
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel v-if="sessions.length === 0">
                  <v-expansion-panel-title>
                    No sessions yet
                  </v-expansion-panel-title>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import type { WorkoutSession } from '@/interfaces/workoutSession.interface';

const store = useWorkoutSessionStore();
const sessions = computed<WorkoutSession[]>(
  () => (store.workoutSessions as WorkoutSession[]) || [],
);

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
  return `${mins} min`;
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

</script>

<style scoped>
.content-scroll {
  height: calc(100vh - 56px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>