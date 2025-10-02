<template>
  <div>
    <ExitHeader
      title="Workout"
      :show-menu="false"
    />
    <!-- TODO: When click on start new workout a list of workouts show and you can choose one, see details ect -->
    <div class="px-5 d-flex flex-column ga-6 mt-4">
      <v-btn
        size="large"
        disabled
      >
        Start New Workout
      </v-btn>
      <!-- TODO: When click on Add previous workout, you choose a workout and all the details to save the workout as done -->
      <v-btn
        disabled
        size="large"
      >
        Add previous workout
      </v-btn>
      <v-divider />
      <!-- TODO: FEAT: FUTURE: Maybe have like you can Browse workouts -->
      <v-btn
        size="large"
        @click="isCreateWorkoutOpen = true"
      >
        Create new workout
      </v-btn>
    </div>
    <v-dialog
      v-model="isCreateWorkoutOpen"
      fullscreen
    >
      <CreateWorkout @close="isCreateWorkoutOpen = false" />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
const isCreateWorkoutOpen = ref<boolean>(false);
</script>