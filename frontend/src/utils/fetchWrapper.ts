import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

export const fetchWrapper = async (url: string, options: RequestInit = {}) => {
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
      handleForbidden();
      return Promise.reject('401 Unauthorized');
    }

    if (response.status === 403) {
      handleForbidden();
      return Promise.reject('403 Forbidden');
    }

    if (response.status === 405) {
      console.error('405 Method Not Allowed');
      return Promise.reject('405 Method Not Allowed');
    }

    if (response.status === 409) {
      let errorData;
      const responseText = await response.text();

      try {
        errorData = JSON.parse(responseText);
      } catch (_e) {
        console.error("Failed to parse JSON from 409 response:", _e);
        errorData = {
          type: 'unknown',
          message: responseText || 'Conflict detected',
        };
      }

      return Promise.reject({
        status: 409,
        ...errorData,
      });
    }

    if (response.status === 500) {
      console.error('500 Internal Server Error');
      return Promise.reject('500 Internal Server Error');
    }

    // Check if response is not OK (but not 403)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Function to handle 403 Forbidden responses
const handleForbidden = async () => {
  const authStore = useAuthStore();
  await authStore.logout();
  console.warn('403 Forbidden: Redirecting to login...');
  router.push('/login');
};
