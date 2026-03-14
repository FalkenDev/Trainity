/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index.vue'
import { useAuthStore } from '@/stores/auth.store'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Onboarding from '@/pages/Onboarding.vue'
import VerifyEmail from '@/pages/VerifyEmail.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import ResetPassword from '@/pages/ResetPassword.vue'
import OAuthCallback from '@/pages/OAuthCallback.vue'
import WorkoutDetails from '@/pages/WorkoutDetails.vue'
import Session from '@/pages/Session.vue'
import SessionSummary from '@/pages/SessionSummary.vue'
import Calendar from '@/pages/Calendar.vue'
import Settings from '@/pages/Settings.vue'
import AddWorkout from '@/pages/AddWorkout.vue'
import LogActivity from '@/pages/LogActivity.vue'
import Statistics from '@/pages/Statistics.vue'
import SessionDetail from '@/pages/SessionDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/oauth-callback',
    name: 'OAuthCallback',
    component: OAuthCallback,
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { requiresAuth: true, hideBottomNav: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: { requiresAuth: true },
  },
  {
    path: '/workout',
    name: 'Workout',
    component: AddWorkout,
    meta: { requiresAuth: true },
  },
  {
    path: '/log-activity',
    name: 'LogActivity',
    component: LogActivity,
    meta: { requiresAuth: true },
  },
  {
    path: '/workout/:workoutId',
    name: 'WorkoutDetails',
    component: WorkoutDetails,
    meta: { requiresAuth: true, hideBottomNav: true },
  },
  {
    path: '/session/:sessionId',
    name: 'SessionDetails',
    component: Session,
    meta: { requiresAuth: true },
  },
  {
    path: '/session-summary',
    name: 'SessionSummary',
    component: SessionSummary,
    meta: { requiresAuth: true, hideBottomNav: true },
  },
  {
    path: '/session-history/:type/:id',
    name: 'SessionDetail',
    component: SessionDetail,
    meta: { requiresAuth: true, hideBottomNav: true },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*', // 404
    redirect: () => '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore() // Get store instance inside the guard
  const isAuthenticated = authStore.isAuthenticated

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else if (requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else if (
    isAuthenticated &&
    to.path !== '/onboarding' &&
    authStore.user &&
    !authStore.user.onboardingCompleted
  ) {
    // Redirect to onboarding if not completed (except when already on onboarding page)
    next('/onboarding')
  } else {
    next()
  }
})
// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
