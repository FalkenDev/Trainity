<template>
  <div class="w-100 h-100 bg-grey-darken-4">
    <BackHeader title="Add Exercises" />
    <v-form class="mx-5">
      <h1 class="text-h4 mb-4">Create Exercise</h1>
      <v-text-field label="Exercise Name" required variant="outlined" />
      <v-textarea
        label="Description"
        rows="2"
        hide-details
        variant="outlined"
      />
      <v-file-input
        label="Upload Image"
        accept="image/*"
        prepend-icon="mdi-image"
        class="mt-3"
        hide-details
        variant="outlined"
      />
      <v-select
        label="Muscle Group"
        :items="['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']"
        required
        class="mt-3"
        multiple
        hide-details
        variant="outlined"
      />
      <v-text-field
        label="Sets"
        type="number"
        min="1"
        required
        class="mt-3"
        hide-details
        variant="outlined"
      />
      <v-text-field
        label="Reps"
        type="number"
        min="1"
        required
        class="mt-3"
        hide-details
        variant="outlined"
      />
      <v-text-field
        label="Pause Seconds"
        type="number"
        min="0"
        required
        class="mt-3"
        hide-details
        variant="outlined"
      />
      <v-btn color="primary" class="mt-4">Create Exercise</v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup></script>
