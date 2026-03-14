<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-bottom-navigation bg-color="cardBg" class="d-flex justify-space-around">
    <v-btn icon to="/">
      <v-icon :color="route.path === '/' ? 'primary' : ''">
        {{ route.path === '/' ? 'mdi-home' : 'mdi-home-outline' }}
      </v-icon>
    </v-btn>
    <v-btn icon to="/calendar">
      <v-icon :color="route.path === '/calendar' ? 'primary' : ''">
        {{ route.path === '/calendar' ? 'mdi-calendar' : 'mdi-calendar-outline' }}
      </v-icon>
    </v-btn>
    <v-btn icon to="/workout">
      <v-icon color="primary" size="40">mdi-plus-circle</v-icon>
    </v-btn>
    <v-btn icon to="/statistics">
      <v-icon :color="route.path === '/statistics' ? 'primary' : ''">mdi-chart-bar</v-icon>
    </v-btn>
    <v-btn icon to="/settings">
      <v-icon :color="route.path === '/settings' ? 'primary' : ''">
        {{ route.path === '/settings' ? 'mdi-account' : 'mdi-account-outline' }}
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
