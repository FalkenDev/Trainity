<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">My workouts</h1>
      <v-btn
        id="menu-activator"
        color="grey-darken-3"
        variant="flat"
        density="compact"
      >
        Lägg till
      </v-btn>
    </div>
    <div>
      <v-card
        v-for="(workout, index) in workouts"
        :key="index"
        class="mb-4 d-flex pa-2 align-center justify-space-between"
        style="border-radius: 5px;"
      >
        <div class="d-flex ga-5 align-center">
          <img style="width: 65px; height: 65px;" class="bg-grey"></img>
          <div class="d-flex flex-column ga-1">
            <h2 class="text-h6">{{ workout.title }}</h2>
            <div class="text-body-2 d-flex align-center ga-1" style="line-height: 1.1rem !important;">
              <v-icon>mdi-clock-outline</v-icon>
              <p>{{ workout.duration }} minutes</p>
            </div>
          </div>
        </div>
        <v-btn
          icon
          size="35"
          color="orange-darken-2"
          class="d-flex justify-center align-center mx-2"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
const workouts = [
  {
    title: "Morning Run",
    date: "2023-10-01",
    duration: 30,
    calories: 300,
  },
  {
    title: "Evening Yoga",
    date: "2023-10-02",
    duration: 60,
    calories: 200,
  },
  {
    title: "Strength Training",
    date: "2023-10-03",
    duration: 45,
    calories: 400,
  },
];
</script>
