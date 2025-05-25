<template>
  <!-- A bottom navigation with routes to home, statistics, add workout, calendar and profile -->
  <v-bottom-navigation class="d-flex justify-space-around">
    <v-btn to="/" icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn to="/statistics" icon>
      <v-icon>mdi-chart-bar</v-icon>
    </v-btn>
    <v-btn to="/add-workout" icon>
      <v-icon size="40" color="orange-darken-1">mdi-plus-circle</v-icon>
    </v-btn>
    <v-btn to="/calendar" icon>
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
    <v-btn to="/account" icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
