<template>
  <v-app>
    <VSonner position="top-center" />
    <router-view />
    <BottomNavigation v-if="authStore.isAuthenticated" />
  </v-app>
</template>

<script lang="ts" setup>
  import { useAuthStore } from './stores/auth.store';
  import { toast, VSonner } from 'vuetify-sonner';
  import 'vuetify-sonner/style.css';
  const authStore = useAuthStore();
</script>
