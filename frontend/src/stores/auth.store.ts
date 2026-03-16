/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

// Utilities
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';
import { useWorkoutStore } from './workout.store';
import { useExerciseStore } from './exercise.store';
import { useMuscleGroupStore } from './muscleGroup.store';
import { useWorkoutSessionStore } from './workoutSession.store';
import { fetchWrapper } from '@/utils/fetchWrapper';
import type { User } from '@/interfaces/User.interface';
import i18n from '@/plugins/i18n';

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
        const data = await fetchWrapper<{ user: User }>(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        isAuthenticated.value = true;
        user.value = data.user;
        token.value = '';

        // Give the browser a tick to persist Set-Cookie before fetching protected resources.
        await new Promise((resolve) => setTimeout(resolve, 0));

        await useWorkoutStore().resetStore();
        await useExerciseStore().resetStore();
        await useMuscleGroupStore().resetStore();
        await useWorkoutSessionStore().resetStore();

        router.push('/');
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '';
        if (errorMessage.includes('email_not_verified')) {
          toast.info(i18n.global.t('auth.emailNotVerifiedToast'), { progressBar: true, duration: 3000 });
          router.push({ path: '/verify-email', query: { email } });
          isAuthenticated.value = false;
          throw error;
        }
        console.error('Login failed:', error);
        toast.error(i18n.global.t('auth.loginFailed'), { progressBar: true, duration: 1000 });
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
    }): Promise<boolean> => {
      loading.value = true;
      try {
        const firstName = registerData.fullName.split(' ')[0];
        const lastName = registerData.fullName.split(' ')[1] || '';

        const registeredUser = await fetchWrapper<{ emailVerified: boolean }>(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: registerData.email,
            password: registerData.password,
            termsAccepted: true,
          }),
        });

        if (registeredUser.emailVerified) {
          // Email verification is disabled — auto-login
          await login(registerData.email, registerData.password);
        } else {
          // Email verification is required — redirect to verify page
          router.push({ path: '/verify-email', query: { email: registerData.email } });
        }
        return true;
      } catch (error) {
        console.error('Account creation failed:', error);
        const errorMessage = error instanceof Error ? error.message : '';

        if (errorMessage.includes('User already exists')) {
          toast.error(i18n.global.t('auth.accountAlreadyExists'), { progressBar: true, duration: 1000 });
          return false;
        }

        toast.error(i18n.global.t('auth.accountCreationFailed'), { progressBar: true, duration: 1000 });
        return false;
      } finally {
        loading.value = false;
      }
    };

    const verifyEmail = async (email: string, code: string): Promise<void> => {
      const data = await fetchWrapper<{ user: User }>(`${apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      isAuthenticated.value = true;
      user.value = data.user;
      token.value = '';
    };

    const resendVerification = async (email: string): Promise<void> => {
      await fetchWrapper(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    };

    const forgotPassword = async (email: string): Promise<void> => {
      await fetchWrapper(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    };

    const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
      await fetchWrapper(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
    };

    const setUserFromOAuth = (oauthUser: User) => {
      isAuthenticated.value = true;
      user.value = oauthUser;
      token.value = '';
    };

    const resetStore = () => {
      isAuthenticated.value = false;
      user.value = null;
      token.value = '';
      loading.value = false;
    };

    const refreshUser = async () => {
      try {
        const data = await fetchWrapper<User>(`${apiUrl}/users`);
        user.value = data;
        return data;
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        throw error;
      }
    };

    return {
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout,
      createAccount,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      setUserFromOAuth,
      resetStore,
      refreshUser,
    };
  },
  {
    persist: {
      pick: ['isAuthenticated', 'user', 'token'],
    },
  },
);
