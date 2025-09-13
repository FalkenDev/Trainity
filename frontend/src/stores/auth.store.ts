// Utilities
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';
import { useWorkoutStore } from './workout.store';
import { useExerciseStore } from './exercise.store';
import { useMuscleGroupStore } from './muscleGroup.store';
import { useWorkoutSessionStore } from './workoutSession.store';
import { fetchWrapper } from '@/utils/fetchWrapper';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const router = useRouter();
    const loading = ref(false);
    const isAuthenticated = ref(false);
    const user = ref();
    const token = ref('');

    const login = async (email: string, password: string) => {
      loading.value = true;
      try {
        const data = await fetchWrapper<{ user: any }>(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        isAuthenticated.value = true;
        user.value = data.user;
        token.value = '';

        await useWorkoutStore().resetStore();
        await useExerciseStore().resetStore();
        await useMuscleGroupStore().resetStore();
        await useWorkoutSessionStore().resetStore();

        router.push('/');
        return data;
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed. Please check your credentials.');
        isAuthenticated.value = false;
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const logout = (): void => {
      resetStore();
      router.push('/login');
    };

    const createAccount = async (registerData: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      loading.value = true;
      try {
        const firstName = registerData.fullName.split(' ')[0];
        const lastName = registerData.fullName.split(' ')[1] || '';

        const response = await fetchWrapper(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: registerData.email,
            password: registerData.password,
          }),
        });

        if (response instanceof Response && response.ok) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Account creation failed:', error);
        throw new Error('Account creation failed');
      } finally {
        loading.value = false;
      }
      return null;
    };

    const resetStore = () => {
      isAuthenticated.value = false;
      user.value = null;
      token.value = '';
      loading.value = false;
    };

    return {
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout,
      createAccount,
      resetStore,
    };
  },
  {
    persist: {
      pick: ['isAuthenticated', 'user', 'token'],
    },
  },
);
