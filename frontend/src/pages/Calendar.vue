<template>
  <v-sheet>
    <v-calendar
      ref="calendar"
      v-model="selectedDate"
      :events="mockCalendarData"
    />
  </v-sheet>
</template>
<script lang="ts" setup>
const selectedDate = ref<Date | string | number | undefined>(new Date());

const mockCalendarData = [
    {
        name: 'Workout 1',
        start: '2023-10-01',
        end: '2023-10-01',
        color: 'primary',
    },
    {
        name: 'Workout 2',
        start: '2023-10-02',
        end: '2023-10-02',
        color: 'secondary',
    },
];
</script>