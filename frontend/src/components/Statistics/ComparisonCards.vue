<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Grindify.
  -
  - Grindify is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Grindify. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
      {{ $t('statistics.comparison.title') }}
    </p>

    <div v-if="!comparison" class="text-center py-4">
      <v-skeleton-loader type="card" class="rounded-lg" />
    </div>

    <div v-else class="d-flex flex-column ga-3">
      <!-- Weekly comparison -->
      <v-card
        class="bg-cardBg pa-4 rounded-lg comparison-card"
        style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
      >
        <div class="d-flex align-center ga-2 mb-3">
          <v-icon size="16" color="primary">mdi-calendar-week</v-icon>
          <span class="text-body-2 font-weight-bold">{{
            $t('statistics.comparison.weeklyTitle')
          }}</span>
        </div>

        <div class="d-flex ga-3">
          <!-- Current week - highlighted -->
          <div class="flex-grow-1 comparison-period current-period pa-3 rounded-lg">
            <p class="text-caption font-weight-bold text-primary mb-2">
              {{ $t('statistics.comparison.thisWeek') }}
            </p>
            <div class="d-flex flex-column ga-1">
              <ComparisonMetric
                icon="mdi-dumbbell"
                :value="comparison.weekly.current.workouts"
                :suffix="$t('statistics.comparison.sessions')"
              />
              <ComparisonMetric
                icon="mdi-weight-kilogram"
                :value="formatVolume(comparison.weekly.current.volume)"
              />
              <ComparisonMetric
                icon="mdi-clock-outline"
                :value="formatDuration(comparison.weekly.current.duration)"
              />
            </div>
          </div>

          <!-- VS divider -->
          <div class="d-flex flex-column align-center justify-center">
            <div class="vs-divider" />
            <span class="vs-label text-caption font-weight-black">VS</span>
            <div class="vs-divider" />
          </div>

          <!-- Previous week -->
          <div class="flex-grow-1 comparison-period pa-3 rounded-lg text-right">
            <p class="text-caption text-textSecondary mb-2">
              {{ $t('statistics.comparison.lastWeek') }}
            </p>
            <div class="d-flex flex-column ga-1 align-end">
              <ComparisonMetric
                :value="comparison.weekly.previous.workouts"
                :suffix="$t('statistics.comparison.sessions')"
                align="right"
              />
              <ComparisonMetric
                :value="formatVolume(comparison.weekly.previous.volume)"
                align="right"
              />
              <ComparisonMetric
                :value="formatDuration(comparison.weekly.previous.duration)"
                align="right"
              />
            </div>
          </div>
        </div>

        <!-- Delta chips row -->
        <div class="d-flex justify-center ga-2 mt-3">
          <DeltaChip
            :current="comparison.weekly.current.workouts"
            :previous="comparison.weekly.previous.workouts"
            label="sessions"
          />
          <DeltaChip
            :current="comparison.weekly.current.volume"
            :previous="comparison.weekly.previous.volume"
            label="volume"
          />
        </div>
      </v-card>

      <!-- Monthly comparison -->
      <v-card
        class="bg-cardBg pa-4 rounded-lg comparison-card"
        style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
      >
        <div class="d-flex align-center ga-2 mb-3">
          <v-icon size="16" color="blue">mdi-calendar-month</v-icon>
          <span class="text-body-2 font-weight-bold">{{
            $t('statistics.comparison.monthlyTitle')
          }}</span>
        </div>

        <div class="d-flex ga-3">
          <div class="flex-grow-1 comparison-period current-period pa-3 rounded-lg">
            <p class="text-caption font-weight-bold text-primary mb-2">
              {{ $t('statistics.comparison.thisMonth') }}
            </p>
            <div class="d-flex flex-column ga-1">
              <ComparisonMetric
                icon="mdi-dumbbell"
                :value="comparison.monthly.current.workouts"
                :suffix="$t('statistics.comparison.sessions')"
              />
              <ComparisonMetric
                icon="mdi-weight-kilogram"
                :value="formatVolume(comparison.monthly.current.volume)"
              />
              <ComparisonMetric
                icon="mdi-clock-outline"
                :value="formatDuration(comparison.monthly.current.duration)"
              />
            </div>
          </div>

          <div class="d-flex flex-column align-center justify-center">
            <div class="vs-divider" />
            <span class="vs-label text-caption font-weight-black">VS</span>
            <div class="vs-divider" />
          </div>

          <div class="flex-grow-1 comparison-period pa-3 rounded-lg text-right">
            <p class="text-caption text-textSecondary mb-2">
              {{ $t('statistics.comparison.lastMonth') }}
            </p>
            <div class="d-flex flex-column ga-1 align-end">
              <ComparisonMetric
                :value="comparison.monthly.previous.workouts"
                :suffix="$t('statistics.comparison.sessions')"
                align="right"
              />
              <ComparisonMetric
                :value="formatVolume(comparison.monthly.previous.volume)"
                align="right"
              />
              <ComparisonMetric
                :value="formatDuration(comparison.monthly.previous.duration)"
                align="right"
              />
            </div>
          </div>
        </div>

        <div class="d-flex justify-center ga-2 mt-3">
          <DeltaChip
            :current="comparison.monthly.current.workouts"
            :previous="comparison.monthly.previous.workouts"
            label="sessions"
          />
          <DeltaChip
            :current="comparison.monthly.current.volume"
            :previous="comparison.monthly.previous.volume"
            label="volume"
          />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'
import type { ComparisonStats } from '@/interfaces/Statistics.interface'

defineProps<{
  comparison: ComparisonStats | null
}>()

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M kg`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K kg`
  return `${v} kg`
}

function formatDuration(minutes: number): string {
  if (!minutes) return '0 min'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`
  if (hrs > 0) return `${hrs}h`
  return `${mins} min`
}

// Inline functional subcomponents
const ComparisonMetric: FunctionalComponent<{
  icon?: string
  value: string | number
  suffix?: string
  align?: string
}> = props =>
  h(
    'div',
    {
      class: 'd-flex align-center ga-1',
      style: props.align === 'right' ? 'justify-content: flex-end' : '',
    },
    [
      h('span', { class: 'text-body-2 font-weight-bold' }, String(props.value)),
      props.suffix ? h('span', { class: 'text-caption text-textSecondary' }, props.suffix) : null,
    ]
  )
ComparisonMetric.props = ['icon', 'value', 'suffix', 'align']

const DeltaChip: FunctionalComponent<{
  current: number
  previous: number
  label: string
}> = props => {
  const diff = props.current - props.previous
  if (diff === 0 && props.current === 0 && props.previous === 0) return null

  const percent =
    props.previous === 0
      ? props.current > 0
        ? 100
        : 0
      : Math.round(((props.current - props.previous) / props.previous) * 100)

  const isPositive = diff >= 0
  const color = isPositive ? 'success' : 'error'
  const icon = isPositive ? 'mdi-trending-up' : 'mdi-trending-down'

  return h(
    'div',
    {
      class: `v-chip v-chip--size-x-small v-theme--dark v-chip--density-default v-chip--variant-tonal bg-${color} font-weight-bold`,
      style:
        'font-size: 10px; height: 20px; padding: 0 6px; border-radius: 10px; display: inline-flex; align-items: center; gap: 2px;',
    },
    [
      h('i', {
        class: `mdi ${icon}`,
        style: 'font-size: 10px;',
      }),
      ` ${isPositive ? '+' : ''}${percent}% ${props.label}`,
    ]
  )
}
DeltaChip.props = ['current', 'previous', 'label']
</script>

<style scoped>
.comparison-card {
  transition: border-color 0.2s ease;
}

.comparison-card:hover {
  border-color: rgba(171, 255, 26, 0.15) !important;
}

.current-period {
  background: rgba(171, 255, 26, 0.04);
  border: 1px solid rgba(171, 255, 26, 0.12);
}

.vs-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
}

.vs-label {
  color: rgba(255, 255, 255, 0.25);
  padding: 4px 0;
  letter-spacing: 1px;
}
</style>
