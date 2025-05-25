<template>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex ga-3 align-center">
      <img width="45" height="45" style="border-radius: 10px" />
      <div>
        <h1 class="text-h6">Kasper Falk</h1>
        <p class="text-body-2">Lets Get Ready 💪</p>
      </div>
    </div>
    <v-btn
      icon
      size="45"
      id="menu-activator"
      color="grey-darken-3"
      variant="flat"
      density="compact"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in sortBy"
          :key="index"
          :value="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang="ts" setup></script>
