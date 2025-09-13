import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

export const fetchWrapper = async <T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    options.credentials = 'include';

    const headers = new Headers(options.headers || {});
    if (
      options.body &&
      typeof options.body === 'string' &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }
    options.headers = headers;

    const response = await fetch(url, options);

    if (response.status === 401) {
      await handleUnauthorized();
      return Promise.reject('401 Unauthorized');
    }

    if (response.status === 403) {
      await handleForbidden();
      return Promise.reject('403 Forbidden');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}. Body: ${errorText}`,
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const handleUnauthorized = async () => {
  const authStore = useAuthStore();
  await authStore.logout();
  console.warn('401 Unauthorized: Redirecting to login...');
  router.push('/login');
};

const handleForbidden = async () => {
  const authStore = useAuthStore();
  await authStore.logout();
  console.warn('403 Forbidden: Redirecting to login...');
  router.push('/login');
};
