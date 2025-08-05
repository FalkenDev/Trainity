import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import { useAuthStore } from '@/stores/auth.store';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import WorkoutDetails from '@/pages/WorkoutDetails.vue';
import Session from '@/pages/Session.vue';
import Calendar from '@/pages/Calendar.vue';
import Settings from '@/pages/Settings.vue';

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
    path: '/statistics',
    name: 'Statistics',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/workout',
    name: 'Workout',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/workout/:workoutId',
    name: 'WorkoutDetails',
    component: WorkoutDetails,
    meta: { requiresAuth: true },
  },
  {
    path: '/session/:sessionId',
    name: 'SessionDetails',
    component: Session,
    meta: { requiresAuth: true },
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore(); // Get store instance inside the guard
  const isAuthenticated = authStore.isAuthenticated;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else if (requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});
// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
