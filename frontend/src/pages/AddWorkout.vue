<template>
  <div>
    <ExitHeader
      :title="$t('workout.workoutTitle')"
      :show-menu="false"
    />
    <!-- TODO: When click on start new workout a list of workouts show and you can choose one, see details ect -->
    <div class="px-5 d-flex flex-column ga-6 mt-4">
      <v-btn
        :loading="isStartingEmptySession"
        size="large"
        color="secondary"
        variant="tonal"
        prepend-icon="mdi-play"
        @click="startEmptySession"
      >
        {{ $t('workout.startEmptyWorkout') }}
      </v-btn>
      <v-btn
        size="large"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-run"
        @click="$router.push('/log-activity')"
      >
        {{ $t('activity.logActivity') }}
      </v-btn>
      <v-btn
        size="large"
        disabled
      >
        {{ $t('workout.startNewWorkout') }}
      </v-btn>
      <!-- TODO: When click on Add previous workout, you choose a workout and all the details to save the workout as done -->
      <v-btn
        disabled
        size="large"
      >
        {{ $t('workout.addPreviousWorkout') }}
      </v-btn>
      <v-divider />
      <!-- TODO: FEAT: FUTURE: Maybe have like you can Browse workouts -->
      <v-btn
        size="large"
        @click="isCreateWorkoutOpen = true"
      >
        {{ $t('workout.createNewWorkout') }}
      </v-btn>
    </div>
    <v-dialog
      v-model="isCreateWorkoutOpen"
      fullscreen
    >
      <CreateWorkout @close="isCreateWorkoutOpen = false" />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';
import { startEmptyWorkoutSession } from '@/services/workoutSession.service';

const router = useRouter();
const workoutSessionStore = useWorkoutSessionStore();

const isCreateWorkoutOpen = ref<boolean>(false);
const isStartingEmptySession = ref(false);

async function startEmptySession() {
  if (isStartingEmptySession.value) return;
  try {
    isStartingEmptySession.value = true;
    const session = await startEmptyWorkoutSession();
    if (session?.id) {
      await workoutSessionStore.fetchSelectedWorkoutSession(session.id);
      router.push(`/session/${session.id}`);
    }
  } finally {
    isStartingEmptySession.value = false;
  }
}
</script>