<template>
  <div class="pa-5 d-flex flex-column ga-4">
    <div>
      <h1>{{ $t('statistics.title') }}</h1>
      <p>{{ $t('statistics.description') }}</p>
    </div>

    <v-tabs v-model="activeTab" color="primary" density="compact" grow>
      <v-tab value="overview">{{ $t('statistics.overview') }}</v-tab>
      <v-tab value="exercises">{{ $t('statistics.exercises') }}</v-tab>
      <v-tab value="workouts">{{ $t('statistics.workouts') }}</v-tab>
    </v-tabs>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'">
      <div v-if="statisticsStore.isLoadingOverview" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="statisticsStore.overview" class="d-flex flex-column ga-4">
        <!-- Key Stats Grid -->
        <div class="d-flex flex-wrap ga-3">
          <v-card
            v-for="stat in overviewCards"
            :key="stat.label"
            class="flex-grow-1 bg-cardBg pa-3 rounded-lg"
            style="border: 1px solid #474747; box-shadow: none; min-width: 140px"
          >
            <p class="text-caption text-textSecondary">{{ stat.label }}</p>
            <p class="text-h6 font-weight-bold text-primary">{{ stat.value }}</p>
          </v-card>
        </div>

        <!-- Recent Personal Records -->
        <div v-if="statisticsStore.overview.recentPRs.length > 0">
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('statistics.recentPRs') }}
          </p>
          <v-card
            v-for="pr in statisticsStore.overview.recentPRs.slice(0, 5)"
            :key="`${pr.exerciseId}-${pr.recordType}`"
            class="bg-cardBg pa-3 rounded-lg mb-2"
            style="border: 1px solid #474747; box-shadow: none"
          >
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center ga-2">
                <v-icon size="18" color="amber">mdi-trophy</v-icon>
                <div>
                  <p class="text-body-2 font-weight-bold">{{ pr.exerciseName }}</p>
                  <p class="text-caption text-textSecondary">
                    {{ formatRecordType(pr.recordType) }}: {{ formatRecordValue(pr) }}
                  </p>
                </div>
              </div>
              <span class="text-caption text-textSecondary">
                {{ formatDate(pr.date) }}
              </span>
            </div>
          </v-card>
        </div>

        <!-- Most Trained -->
        <div v-if="statisticsStore.overview.mostTrainedMuscleGroups.length > 0">
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('statistics.mostTrainedMuscles') }}
          </p>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="mg in statisticsStore.overview.mostTrainedMuscleGroups"
              :key="mg.name"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ mg.name }} ({{ mg.count }})
            </v-chip>
          </div>
        </div>

        <div v-if="statisticsStore.overview.mostTrainedExercises.length > 0" class="mt-1">
          <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
            {{ $t('statistics.mostTrainedExercises') }}
          </p>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="ex in statisticsStore.overview.mostTrainedExercises"
              :key="ex.name"
              size="small"
              variant="tonal"
            >
              {{ ex.name }} ({{ ex.count }})
            </v-chip>
          </div>
        </div>
      </div>
      <div v-else class="text-center pa-8 text-textSecondary">
        <v-icon size="48" class="mb-2">mdi-chart-bar</v-icon>
        <p>{{ $t('statistics.noData') }}</p>
      </div>
    </div>

    <!-- Exercises Tab -->
    <div v-if="activeTab === 'exercises'">
      <v-text-field
        v-model="exerciseSearch"
        :placeholder="$t('exercise.searchExercises')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-3"
        bg-color="cardBg"
      />
      <div v-if="filteredExercises.length === 0" class="text-center pa-8 text-textSecondary">
        <v-icon size="48" class="mb-2">mdi-dumbbell</v-icon>
        <p>{{ $t('statistics.noExercises') }}</p>
      </div>
      <v-card
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        class="bg-cardBg pa-3 rounded-lg mb-2 cursor-pointer"
        style="border: 1px solid #474747; box-shadow: none"
        @click="openExerciseDetail(exercise)"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <v-avatar v-if="exercise.image" size="36" rounded>
              <v-img :src="getImageUrl(exercise.image)" />
            </v-avatar>
            <v-avatar v-else color="blue-grey-darken-3" size="36" rounded>
              <v-icon size="18">mdi-dumbbell</v-icon>
            </v-avatar>
            <div>
              <p class="text-body-2 font-weight-bold">{{ exercise.name }}</p>
              <div class="d-flex ga-1">
                <v-chip
                  v-for="mg in exercise.muscleGroups?.slice(0, 2)"
                  :key="mg.id"
                  size="x-small"
                  variant="tonal"
                >
                  {{ mg.name }}
                </v-chip>
              </div>
            </div>
          </div>
          <v-icon size="20" class="text-textSecondary">mdi-chevron-right</v-icon>
        </div>
      </v-card>
    </div>

    <!-- Workouts Tab -->
    <div v-if="activeTab === 'workouts'">
      <div v-if="workoutStore.workouts.length === 0" class="text-center pa-8 text-textSecondary">
        <v-icon size="48" class="mb-2">mdi-clipboard-list</v-icon>
        <p>{{ $t('statistics.noWorkouts') }}</p>
      </div>
      <v-card
        v-for="workout in workoutStore.workouts"
        :key="workout.id"
        class="bg-cardBg pa-3 rounded-lg mb-2 cursor-pointer"
        style="border: 1px solid #474747; box-shadow: none"
        @click="openWorkoutDetail(workout)"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <v-avatar color="deep-purple-darken-3" size="36" rounded>
              <v-icon size="18">mdi-clipboard-list</v-icon>
            </v-avatar>
            <div>
              <p class="text-body-2 font-weight-bold">{{ workout.title }}</p>
              <p class="text-caption text-textSecondary">
                {{ workout.exercises?.length ?? 0 }} {{ $t('statistics.exercisesCount') }} ·
                {{ workout.time }} {{ $t('units.minShort') }}
              </p>
            </div>
          </div>
          <v-icon size="20" class="text-textSecondary">mdi-chevron-right</v-icon>
        </div>
      </v-card>
    </div>

    <!-- Exercise Detail Dialog -->
    <ExerciseStatisticsDetail v-model="showExerciseDetail" :exercise="selectedExercise" />

    <!-- Workout Detail Dialog -->
    <WorkoutStatisticsDetail v-model="showWorkoutDetail" :workout="selectedWorkout" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BackHeader from '@/components/BackHeader.vue'
import ExerciseStatisticsDetail from '@/components/Statistics/ExerciseStatisticsDetail.vue'
import WorkoutStatisticsDetail from '@/components/Statistics/WorkoutStatisticsDetail.vue'
import { useStatisticsStore } from '@/stores/statistics.store'
import { useExerciseStore } from '@/stores/exercise.store'
import { useWorkoutStore } from '@/stores/workout.store'
import type { Exercise } from '@/interfaces/Exercise.interface'
import type { Workout } from '@/interfaces/Workout.interface'
import type { PersonalRecord, RecordType } from '@/interfaces/Statistics.interface'

const { t } = useI18n()
const statisticsStore = useStatisticsStore()
const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()

const activeTab = ref('overview')
const exerciseSearch = ref('')
const showExerciseDetail = ref(false)
const showWorkoutDetail = ref(false)
const selectedExercise = ref<Exercise | null>(null)
const selectedWorkout = ref<Workout | null>(null)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

function getImageUrl(image: string | null | undefined): string {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `${apiUrl}/${image}`
}

const filteredExercises = computed(() => {
  const search = exerciseSearch.value.toLowerCase()
  if (!search) return exerciseStore.exercises
  return exerciseStore.exercises.filter(
    e =>
      e.name.toLowerCase().includes(search) ||
      e.muscleGroups?.some(mg => mg.name.toLowerCase().includes(search))
  )
})

const overviewCards = computed(() => {
  const o = statisticsStore.overview
  if (!o) return []
  return [
    { label: t('statistics.totalWorkouts'), value: o.totalWorkouts },
    { label: t('statistics.totalVolume'), value: formatVolume(o.totalVolume) },
    { label: t('statistics.thisWeek'), value: o.workoutsThisWeek },
    { label: t('statistics.thisMonth'), value: o.workoutsThisMonth },
    {
      label: t('statistics.avgDuration'),
      value: `${o.averageSessionDuration} ${t('units.minShort')}`,
    },
    { label: t('statistics.totalTime'), value: `${o.totalDuration} ${t('units.minShort')}` },
  ]
})

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M kg`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K kg`
  return `${v} kg`
}

function formatRecordType(type: RecordType): string {
  const map: Record<string, string> = {
    max_weight: t('statistics.records.maxWeight'),
    estimated_1rm: t('statistics.records.estimated1RM'),
    max_volume_set: t('statistics.records.maxVolumeSet'),
    max_volume_session: t('statistics.records.maxVolumeSession'),
    max_reps: t('statistics.records.maxReps'),
  }
  return map[type] || type
}

function formatRecordValue(pr: PersonalRecord): string {
  if (pr.recordType === 'max_reps') return `${pr.value} reps`
  return `${pr.value} kg`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function openExerciseDetail(exercise: Exercise) {
  selectedExercise.value = exercise
  showExerciseDetail.value = true
}

function openWorkoutDetail(workout: Workout) {
  selectedWorkout.value = workout
  showWorkoutDetail.value = true
}

onMounted(async () => {
  await Promise.all([
    statisticsStore.fetchOverview(),
    exerciseStore.setExercises(),
    workoutStore.setWorkouts(),
  ])
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
