<template>
  <div class="settings-page">
    <div class="settings-content">
      <h1 class="text-h6">
        Content
      </h1>
      <div>
        <v-list class="bg-transparent">
          test
        </v-list>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWorkoutSessionStore } from '@/stores/workoutSession.store';

const workoutSessionStore = useWorkoutSessionStore();

const sessionData = workoutSessionStore.workoutSessions;

console.log('Session Data:', sessionData);
</script>