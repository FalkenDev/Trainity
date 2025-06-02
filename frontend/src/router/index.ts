import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import { useAuthStore } from '@/stores/auth.store';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import WorkoutDetails from '@/pages/WorkoutDetails.vue';
import Session from '@/pages/Session.vue';
import Calendar from '@/pages/Calendar.vue';

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
    path: '/account',
    name: 'Account',
    component: Home,
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

  console.log(isAuthenticated, 'isAuthenticated in guard');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !isAuthenticated) {
    console.log(`Guard: Auth required for ${to.path}, redirecting to /login`);
    next({
      path: '/login',
      query: { redirect: to.fullPath }, // Optional: redirect back after login
    });
  } else if (requiresGuest && isAuthenticated) {
    console.log(
      `Guard: Guest route ${to.path} accessed while authenticated, redirecting to /dashboard`
    );
    next('/dashboard');
  } else {
    console.log(`Guard: Allowing navigation to ${to.path}`);
    next();
  }
});
// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
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
