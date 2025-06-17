<template>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex ga-3 align-center">
      <v-avatar
        color="white"
        height="45"
        style="border-radius: 8px"
        width="45"
      />
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
  const authStore = useAuthStore();

  const user = computed<User | null>(() => authStore.user);
</script>
