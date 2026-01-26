<template>
  <v-app>
    <VSonner position="top-center" />
    <v-main
      :style="{
        paddingBottom:
          authStore.isAuthenticated && workoutSessionStore.selectedWorkoutSession && checkPath()
            ? '101px'
            : '',
      }"
    >
      <router-view :key="$route.name" />
    </v-main>
    <v-card
      v-if="authStore.isAuthenticated && workoutSessionStore.selectedWorkoutSession && checkPath()"
      class="resume-card d-flex align-center justify-space-between px-5 border-t-sm border-b-sm"
      style="border-color: #abff1a !important"
      height="45"
      color="cardBg"
      width="100%"
      elevation="0"
      rounded="0"
      @click="routeToSelectedWorkoutSession"
    >
      <h1 class="text-body-1 text-primary">
        {{ $t('navigation.resumeWorkout') }}
      </h1>
      <v-icon color="primary"> mdi-chevron-right </v-icon>
    </v-card>
    <BottomNavigation v-if="authStore.isAuthenticated && !$route.meta.hideBottomNav" />
  </v-app>
</template>

<script lang="ts" setup>
import { useAuthStore } from './stores/auth.store'
import { VSonner } from 'vuetify-sonner'
import { useWorkoutSessionStore } from './stores/workoutSession.store'
import 'vuetify-sonner/style.css'
import router from './router'

const workoutSessionStore = useWorkoutSessionStore()
const authStore = useAuthStore()

const routeToSelectedWorkoutSession = () => {
  if (
    workoutSessionStore.selectedWorkoutSession &&
    'id' in workoutSessionStore.selectedWorkoutSession
  ) {
    router.push('/session/' + workoutSessionStore.selectedWorkoutSession.id)
  }
}

const checkPath = () => {
  return !router.currentRoute.value.path.startsWith('/session')
}
</script>
<style scoped>
.resume-card {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 56px;
  z-index: 1100;
  width: 100%;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
}
</style>
