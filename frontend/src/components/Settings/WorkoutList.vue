<template>
  <v-container
    fluid
    class="pa-0 bg-grey-darken-4"
  >
    <BackHeader
      title="Workouts"
      show-menu
      @close="emit('close')"
    >
      <template #menuAppend>
        <v-list>
          <v-list-item @click="isCreateWorkoutOpen = true">
            <v-list-item-title>Create workout</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </BackHeader>

    <div class="px-3 pt-2 pb-3 d-flex align-center ga-2">
      <v-text-field
        v-model="search"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        clearable
        hide-details
        density="comfortable"
        class="flex-grow-1"
      />
      <v-btn
        height="40"
        variant="outlined"
        class="px-3"
        @click="mgSheet = true"
      >
        Filters
        <v-icon
          size="18"
          class="ml-1"
        >
          mdi-tune
        </v-icon>
      </v-btn>
      <v-btn
        height="40"
        variant="outlined"
        class="px-3"
        @click="sortSheet = true"
      >
        Sort
        <v-icon
          size="18"
          class="ml-1"
        >
          mdi-sort
        </v-icon>
      </v-btn>
    </div>

    <div
      v-if="hasActiveFilters"
      class="px-3 pb-2 d-flex flex-wrap ga-2"
    >
      <v-chip
        v-for="mg in activeMGs"
        :key="mg.id"
        size="small"
        variant="outlined"
        class="text-caption"
        closable
        @click:close="removeMG(mg.id)"
      >
        {{ mg.name }}
      </v-chip>
      <v-chip
        v-if="hasActiveFilters"
        size="small"
        color="grey-darken-1"
        variant="text"
        @click="clearAllFilters"
      >
        Clear all
      </v-chip>
    </div>

    <div class="content-scroll">
      <v-row class="px-2">
        <v-col cols="12">
          <v-card elevation="1">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="text-subtitle-1">
                Workout Plans
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ filteredWorkouts.length }}
              </div>
            </v-card-title>
            <v-divider />

            <v-card-text class="pa-0">
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="w in filteredWorkouts"
                  :key="w.id"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex w-100">
                      <div class="flex-grow-1">
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ w.title }}
                        </div>
                        <div
                          class="text-caption text-medium-emphasis one-line"
                        >
                          {{ w.description }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                          {{ w.time }} min • {{ totalSets(w) }} sets •
                          {{ w.exercises.length }} exercises
                        </div>
                        <div class="mt-2 d-flex flex-wrap ga-1">
                          <v-chip
                            v-for="mg in distinctMGs(w)"
                            :key="mg"
                            size="x-small"
                            variant="outlined"
                            class="text-caption"
                          >
                            {{ mg }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <div>
                      <div
                        v-for="it in orderedItems(w)"
                        :key="it.id"
                        class="pa-3 mb-2 rounded-lg bg-grey-darken-3"
                      >
                        <div class="d-flex justify-space-between">
                          <div class="font-weight-medium">
                            {{ it.order }}. {{ it.exercise.name }}
                          </div>
                          <div class="text-caption text-medium-emphasis">
                            {{ it.pauseSeconds }}s
                          </div>
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ it.exercise.description }}
                        </div>
                        <div class="mt-2 d-flex flex-wrap ga-2">
                          <v-chip
                            size="small"
                            variant="outlined"
                          >
                            {{ it.sets }} sets
                          </v-chip>
                          <v-chip
                            size="small"
                            variant="outlined"
                          >
                            {{ it.reps }} reps
                          </v-chip>
                          <v-chip
                            size="small"
                            variant="outlined"
                          >
                            {{ it.weight }} kg
                          </v-chip>
                        </div>
                        <div class="mt-2 d-flex flex-wrap ga-1">
                          <v-chip
                            v-for="m in it.exercise.muscleGroups"
                            :key="m.id"
                            size="x-small"
                            variant="text"
                            class="text-caption"
                          >
                            {{ m.name }}
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <!-- Desktop details (table) -->
                    <div class="d-none d-md-block">
                      <v-table density="comfortable">
                        <thead>
                          <tr>
                            <th class="text-left">
                              #
                            </th>
                            <th class="text-left">
                              Exercise
                            </th>
                            <th class="text-left">
                              Sets
                            </th>
                            <th class="text-left">
                              Reps
                            </th>
                            <th class="text-left">
                              Weight (kg)
                            </th>
                            <th class="text-left">
                              Pause (s)
                            </th>
                            <th class="text-left">
                              Muscle Groups
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="it in orderedItems(w)"
                            :key="it.id"
                          >
                            <td>{{ it.order }}</td>
                            <td>
                              <div class="font-weight-medium">
                                {{ it.exercise.name }}
                              </div>
                              <div class="text-caption text-medium-emphasis">
                                {{ it.exercise.description }}
                              </div>
                            </td>
                            <td>{{ it.sets }}</td>
                            <td>{{ it.reps }}</td>
                            <td>{{ it.weight }}</td>
                            <td>{{ it.pauseSeconds }}</td>
                            <td class="text-caption">
                              {{
                                it.exercise.muscleGroups
                                  .map((m) => m.name)
                                  .join(', ')
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <v-btn
                      color="primary"
                      class="my-5 w-100"
                      @click="$router.push(`/workout/${w.id}`)"
                    >
                      Go to workout
                    </v-btn>
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel v-if="filteredWorkouts.length === 0">
                  <v-expansion-panel-title>
                    No workouts match your filters
                  </v-expansion-panel-title>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="isCreateWorkoutOpen"
      fullscreen
    >
      <CreateWorkout @close="isCreateWorkoutOpen = false" />
    </v-dialog>

    <v-bottom-sheet
      v-model="mgSheet"
      inset
    >
      <v-card>
        <v-card-title class="text-subtitle-1">
          Muscle groups
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="mgSearch"
            prepend-inner-icon="mdi-magnify"
            label="Search muscle groups"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-2"
          />
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="mg in filteredMuscleGroups"
              :key="mg.id"
              :color="
                selectedMGIds.includes(mg.id) ? 'primary' : undefined
              "
              variant="outlined"
              @click="toggleMG(mg.id)"
            >
              {{ mg.name }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            variant="text"
            @click="clearMG"
          >
            Clear
          </v-btn>
          <v-btn
            color="primary"
            @click="mgSheet = false"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-bottom-sheet
      v-model="sortSheet"
      inset
    >
      <v-card>
        <v-card-title class="text-subtitle-1">
          Sort by
        </v-card-title>
        <v-list
          density="comfortable"
          nav
        >
          <v-list-item
            v-for="item in sortItems"
            :key="item.value"
            :title="item.label"
            :prepend-icon="
              sortBy === item.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'
            "
            @click="
              sortBy = item.value as any;
              sortSheet = false;
            "
          />
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>
<script setup lang="ts">
import type { MuscleGroup } from '@/interfaces/Exercise.interface';
import type { Workout } from '@/interfaces/Workout.interface';
import { useWorkoutStore } from '@/stores/workout.store';

const emit = defineEmits<{ (e: 'close'): void }>();
const workoutStore = useWorkoutStore();

const workouts = computed<Workout[]>(() => {
  const w = (workoutStore.workouts as Workout[]) || [];
  return w.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

const search = ref('');
const sortBy = ref<'recent' | 'name' | 'time' | 'exercises'>('recent');
const sortItems = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Name (A–Z)', value: 'name' },
  { label: 'Time (min)', value: 'time' },
  { label: 'Exercises (count)', value: 'exercises' },
];

const mgSheet = ref(false);
const sortSheet = ref(false);
const mgSearch = ref('');
const selectedMGIds = ref<number[]>([]);
const isCreateWorkoutOpen = ref(false);

const allMuscleGroups = computed<MuscleGroup[]>(() => {
  const map = new Map<number, MuscleGroup>();
  for (const w of workouts.value) {
    for (const it of w.exercises) {
      for (const mg of it.exercise.muscleGroups) {
        map.set(mg.id, {
          id: mg.id,
          name: mg.name,
          description: mg.description ?? '',
          createdAt: mg.createdAt ?? '',
          updatedAt: mg.updatedAt ?? '',
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
});

const filteredMuscleGroups = computed(() => {
  const q = mgSearch.value.trim().toLowerCase();
  if (!q) return allMuscleGroups.value;
  return allMuscleGroups.value.filter((m) =>
    m.name.toLowerCase().includes(q),
  );
});

const activeMGs = computed(() =>
  allMuscleGroups.value.filter((m) => selectedMGIds.value.includes(m.id)),
);

const hasActiveFilters = computed(
  () => selectedMGIds.value.length > 0 || search.value.trim().length > 0,
);

const filteredWorkouts = computed<Workout[]>(() => {
  let list = workouts.value;

  // Search by title, description, exercise names
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((w) => {
      const inTitle =
        w.title.toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q);
      const inExercises = w.exercises.some((it) =>
        it.exercise.name.toLowerCase().includes(q),
      );
      return inTitle || inExercises;
    });
  }

  if (selectedMGIds.value.length) {
    list = list.filter((w) => {
      const mgIds = new Set<number>();
      w.exercises.forEach((it) =>
        it.exercise.muscleGroups.forEach((mg) => mgIds.add(mg.id)),
      );
      return selectedMGIds.value.every((id) => mgIds.has(id));
    });
  }

  switch (sortBy.value) {
    case 'name':
      list = list
        .slice()
        .sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { numeric: true }),
        );
      break;
    case 'time':
      list = list.slice().sort((a, b) => a.time - b.time);
      break;
    case 'exercises':
      list = list
        .slice()
        .sort((a, b) => a.exercises.length - b.exercises.length);
      break;
    case 'recent':
    default:
      list = list
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      break;
  }

  return list;
});

function orderedItems(w: Workout) {
  return w.exercises.slice().sort((a, b) => a.order - b.order);
}

function totalSets(w: Workout) {
  return w.exercises.reduce((sum, it) => sum + (it.sets || 0), 0);
}

function distinctMGs(w: Workout) {
  const s = new Set<string>();
  w.exercises.forEach((it) =>
    it.exercise.muscleGroups.forEach((m) => s.add(m.name)),
  );
  return Array.from(s).sort();
}

function toggleMG(id: number) {
  const idx = selectedMGIds.value.indexOf(id);
  if (idx === -1) selectedMGIds.value.push(id);
  else selectedMGIds.value.splice(idx, 1);
}
function removeMG(id: number) {
  selectedMGIds.value = selectedMGIds.value.filter((x) => x !== id);
}
function clearMG() {
  selectedMGIds.value = [];
  mgSearch.value = '';
}
function clearAllFilters() {
  clearMG();
  search.value = '';
}

</script>
<style scoped>
.content-scroll {
  height: calc(100vh - 100px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
}

.one-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>