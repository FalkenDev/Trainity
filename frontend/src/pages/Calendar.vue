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
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const selectedDate = ref<Date | string | number | undefined>(new Date());

const mockCalendarData = [
    {
    name: t('calendar.workoutNumber', { number: 1 }),
        start: '2023-10-01',
        end: '2023-10-01',
        color: 'primary',
    },
    {
    name: t('calendar.workoutNumber', { number: 2 }),
        start: '2023-10-02',
        end: '2023-10-02',
        color: 'secondary',
    },
];
</script>