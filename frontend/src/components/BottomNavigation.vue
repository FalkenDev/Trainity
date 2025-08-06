<template>
  <v-bottom-navigation class="d-flex justify-space-around">
    <v-btn
      icon
      to="/"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <!-- Disabled for now: Eanble when implemented -->
    <v-btn
      icon
      to="/statistics"
      :disabled="true"
    >
      <v-icon>mdi-chart-bar</v-icon>
    </v-btn>
    <!-- Disabled for now: Eanble when implemented -->
    <v-btn
      icon
      to="/add-workout"
      :disabled="true"
    >
      <v-icon
        color="orange-darken-1"
        size="40"
      >
        mdi-plus-circle
      </v-icon>
    </v-btn>
    <!-- Disabled for now: Eanble when implemented -->
    <v-btn
      icon
      to="/calendar"
      :disabled="true"
    >
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
    <v-btn
      icon
      to="/settings"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
