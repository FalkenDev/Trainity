<template>
  <v-card
    class="pa-5"
    style="border-radius: 10px"
  >
    <div class="d-flex justify-space-between align-center">
      <h1 class="text-h6">
        {{ $t('progress.title') }}
      </h1>
      <v-btn
        color="grey-darken-3"
        density="compact"
        variant="flat"
      >
        {{ $t('progress.days') }}
        <v-icon>mdi-chevron-down</v-icon>
        <v-menu activator="parent">
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
      </v-btn>
    </div>
    <div class="d-flex justify-space-between align-center my-5">
      <div
        v-for="day in weekdays"
        :key="day"
      >
        <v-avatar
          color="grey-darken-3"
          size="35"
        >
          <span class="text-body-2">{{ day }}</span>
        </v-avatar>
      </div>
    </div>
    <div class="d-flex justify-space-between align-center">
      <div class="text-center d-flex flex-column ga-2">
        <h1 class="text-h4">
          4
        </h1>
        <p class="text-grey-lighten-1">
          {{ $t('progress.workouts') }}
        </p>
      </div>
      <div class="text-center d-flex flex-column ga-2">
        <h1 class="text-h4">
          2000
        </h1>
        <p class="text-grey-lighten-1">
          {{ $t('progress.kcal') }}
        </p>
      </div>
      <div class="text-center d-flex flex-column ga-2">
        <h1 class="text-h4">
          120
        </h1>
        <p class="text-grey-lighten-1">
          {{ $t('progress.minutes') }}
        </p>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>

import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n({ useScope: 'global' });

const weekdays = computed(() => {
  const v = tm('progress.weekdaysShort');
  return Array.isArray(v) ? (v as string[]) : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
});

const sortBy = computed(() => [
  { title: t('progress.days') },
  { title: t('progress.weeks') },
  { title: t('progress.months') },
  { title: t('progress.years') },
]);
</script>
