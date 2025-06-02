// Utilities
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';
      try {
        const response = await fetch(`${apiUrl}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (response instanceof Response && response.ok) {
          const data = await response.json();
          isAuthenticated.value = true;
          user.value = data.user;
          token.value = data.token;
          router.push('/');
          return data;
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed. Please check your credentials.');
        isAuthenticated.value = false;
        throw new Error('Login failed');
      } finally {
        loading.value = false;
      }
      return null;
    };

    const logout = (): void => {
      isAuthenticated.value = false;
      user.value = null;
      token.value = '';
      router.push('/login');
    };

    const createAccount = async (registerData: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      loading.value = true;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';
      try {
        console.log('Creating account with data:', registerData);
        console.log('fullname:', registerData.fullName);
        const firstName = registerData.fullName.split(' ')[0];
        const lastName = registerData.fullName.split(' ')[1] || '';

        const response = await fetch(`${apiUrl}/users/register`, {
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

    return {
      isAuthenticated,
      user,
      token,
      loading,
      login,
      logout,
      createAccount,
    };
  },
  {
    persist: {
      pick: ['isAuthenticated', 'user', 'token'],
    },
  }
);
