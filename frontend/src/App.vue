<template>
  <v-app>
    <VSonner position="top-center" />
    <v-main
      :style="{
        paddingBottom: showResumeBar ? '101px' : '',
      }"
    >
      <router-view :key="$route.name" />
    </v-main>
    <v-card
      v-if="showResumeBar"
      class="resume-card d-flex align-center justify-space-between px-5 border-t-sm border-b-sm"
      :style="{ borderColor: theme.current.value.colors.primary + ' !important' }"
      height="45"
      color="cardBg"
      width="100%"
      elevation="0"
      rounded="0"
      @click="routeToSelectedWorkoutSession"
    >
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="small">mdi-dumbbell</v-icon>
        <h1 class="text-body-1 text-primary font-weight-bold">
          {{ $t('navigation.resumeWorkout') }}
        </h1>
      </div>
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
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/app'
import { useTheme } from 'vuetify'

const workoutSessionStore = useWorkoutSessionStore()
const authStore = useAuthStore()
const appStore = useAppStore()
const theme = useTheme()
const route = useRoute()

// Initialize theme from persisted preference
theme.global.name.value = appStore.darkMode ? 'dark' : 'light'

const isActiveSession = computed(() => {
  const session = workoutSessionStore.selectedWorkoutSession as { status?: string } | null
  return session != null && session.status === 'in_progress'
})

const isOnSessionPage = computed(() => {
  const path = route.path
  return path.startsWith('/session') || path.startsWith('/session-history')
})

const showResumeBar = computed(() => {
  return authStore.isAuthenticated && isActiveSession.value && !isOnSessionPage.value
})

const routeToSelectedWorkoutSession = () => {
  if (
    workoutSessionStore.selectedWorkoutSession &&
    'id' in workoutSessionStore.selectedWorkoutSession
  ) {
    router.push('/session/' + workoutSessionStore.selectedWorkoutSession.id)
  }
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

:deep(.v-field) {
  background-color: rgb(var(--v-theme-cardBg)) !important;
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 6px 0 0 6px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 6px 6px 0 !important;
}
</style>
