<template>
  <div>
    <ExitHeader :title="$t('workout.workoutTitle')" :show-menu="false" />
    <!-- TODO: When click on start new workout a list of workouts show and you can choose one, see details ect -->
    <div class="mx-5 d-flex flex-column ga-5">
      <div class="d-flex flex-column ga-4">
        <h1 class="text-h6 text-textPrimary">Quick Start</h1>
        <div class="d-flex ga-5">
          <v-card
            class="pa-2 rounded-lg d-flex flex-column flex-grow-1"
            style="
              background: linear-gradient(135deg, #142a37 0%, #0d1f2a 100%);
              border: 1px solid #3a5a7b;
              box-shadow: none;
              flex: 1;
            "
            @click="startEmptySession"
          >
            <v-icon size="30" color="primary">mdi-lightning-bolt</v-icon>
            <div class="text-subtitle-1 font-weight-medium text-textPrimary mt-2">
              <h1 class="text-body-1">Empty Workout</h1>
              <p class="text-caption text-textSecondary">Start fresh and add exercises</p>
            </div>
          </v-card>
          <v-card
            class="pa-2 rounded-lg d-flex flex-column flex-grow-1"
            style="
              background: linear-gradient(135deg, #0d4a2a 0%, #061f15 100%);
              border: 1px solid #2a5a3a;
              box-shadow: none;
              flex: 1;
            "
            @click="$router.push('/log-activity')"
          >
            <v-icon size="30" color="success">mdi-notebook-edit</v-icon>
            <div class="text-subtitle-1 font-weight-medium text-textPrimary mt-2">
              <h1 class="text-body-1">Log Activity</h1>
              <p class="text-caption text-textSecondary">Running, sports & more</p>
            </div>
          </v-card>
        </div>
      </div>
      <div class="d-flex flex-column ga-4">
        <MyWorkouts />
      </div>
    </div>
    <v-dialog v-model="isCreateWorkoutOpen" fullscreen>
      <CreateWorkout @close="isCreateWorkoutOpen = false" />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { startEmptyWorkoutSession } from '@/services/workoutSession.service'

const router = useRouter()
const workoutSessionStore = useWorkoutSessionStore()

const isCreateWorkoutOpen = ref<boolean>(false)
const isStartingEmptySession = ref(false)

async function startEmptySession() {
  if (isStartingEmptySession.value) return
  try {
    isStartingEmptySession.value = true
    const session = await startEmptyWorkoutSession()
    if (session?.id) {
      await workoutSessionStore.fetchSelectedWorkoutSession(session.id)
      router.push(`/session/${session.id}`)
    }
  } finally {
    isStartingEmptySession.value = false
  }
}
</script>
