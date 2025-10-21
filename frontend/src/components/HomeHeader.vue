<template>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex ga-3 align-center">
      <v-avatar
        color="white"
        height="45"
        style="border-radius: 8px"
        width="45"
      >
        <v-img
          v-if="user?.avatar"
          :src="getImageUrl(user.avatar)"
          alt="User avatar"
          cover
        />
        <v-icon
          v-else
          color="grey"
        >
          mdi-account
        </v-icon>
      </v-avatar>
      <div>
        <h1 class="text-h6">
          {{ user ? user.firstName + " " + user.lastName : "Guest" }}
        </h1>
        <p class="text-body-2">
          Lets Get Ready 💪
        </p>
      </div>
    </div>
    <v-btn
      color="grey-darken-3"
      density="compact"
      icon
      size="45"
      variant="flat"
    >
      <v-icon>mdi-menu</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item @click="authStore.logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>
<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth.store';
  import type { User } from '@/interfaces/User.interface';
  import { onMounted } from 'vue';
  
  const authStore = useAuthStore();

  const user = computed<User | null>(() => authStore.user);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Remove /v1 from API URL for static assets
    const baseUrl = apiUrl.replace('/v1', '');
    return `${baseUrl}${imagePath}`;
  };

  // Refresh user data when component mounts to get latest avatar
  onMounted(async () => {
    try {
      await authStore.refreshUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  });
</script>
