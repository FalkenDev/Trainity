<template>
  <div class="bg-grey-darken-4 h-100 w-100">
    <ExitHeader
      title="Weight and Reps Settings"
      showMenu
      @close="$emit('close')"
    />
    <v-list>
      <v-list-item
        v-for="option in options"
        :key="option.value"
        class="border-t-sm border-b-sm py-2"
        two-line
        @click="$emit('select', option.value)"
      >
        <div class="d-flex w-100 align-center ga-4">
          <div class="d-flex flex-column">
            <v-list-item-title class="text-body-1 font-weight-bold">
              {{ option.label }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2 d-flex flex-wrap">
              {{ option.description }}
            </v-list-item-subtitle>
          </div>
          <v-icon color="primary">mdi-check</v-icon>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts" setup>
const options = [
  {
    label: "Latest",
    description:
      "Use the weights and repetitions from the last time you did this workout",
    value: "latest",
  },
  {
    label: "Default",
    description: "Use the default weights and repetitions set for this workout",
    value: "default",
  },
];
</script>
