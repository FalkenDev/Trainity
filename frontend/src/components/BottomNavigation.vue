<template>
  <v-bottom-navigation bg-color="cardBg" class="d-flex justify-space-around">
    <v-btn icon to="/">
      <v-icon :color="route.path === '/' ? 'primary' : ''">mdi-home</v-icon>
    </v-btn>
    <v-btn icon to="/calendar">
      <v-icon :color="route.path === '/calendar' ? 'primary' : ''">mdi-calendar</v-icon>
    </v-btn>
    <v-btn icon to="/workout">
      <v-icon color="primary" size="40"> mdi-plus-circle </v-icon>
    </v-btn>
    <v-btn icon to="/statistics">
      <v-icon :color="route.path === '/statistics' ? 'primary' : ''">mdi-chart-bar</v-icon>
    </v-btn>
    <v-btn icon to="/settings">
      <v-icon :color="route.path === '/settings' ? 'primary' : ''">mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
