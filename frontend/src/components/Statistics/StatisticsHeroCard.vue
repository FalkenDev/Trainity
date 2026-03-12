<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card
    class="hero-card pa-4 rounded-lg"
    :style="{
      border: '1px solid rgba(171, 255, 26, 0.15)',
      boxShadow: 'none',
      background:
        'linear-gradient(135deg, rgba(171, 255, 26, 0.06) 0%, rgb(var(--v-theme-cardBg)) 50%, rgba(171, 255, 26, 0.03) 100%)',
    }"
  >
    <!-- Empty state -->
    <div v-if="!overview || overview.totalWorkouts === 0" class="text-center py-4">
      <v-icon size="40" color="primary" class="mb-2 hero-icon-pulse">mdi-chart-areaspline</v-icon>
      <p class="text-body-2 text-textSecondary mb-3">{{ $t('statistics.heroEmpty') }}</p>
      <v-btn color="primary" size="small" variant="flat" rounded @click="$router.push('/')">
        {{ $t('statistics.startWorkout') }}
      </v-btn>
    </div>

    <!-- Hero stats - single row with compact items -->
    <div v-else class="hero-stats-row">
      <div v-for="stat in heroStats" :key="stat.key" class="hero-stat">
        <div class="d-flex align-center ga-1 mb-1">
          <v-icon :color="stat.iconColor" size="14">{{ stat.icon }}</v-icon>
          <span class="text-caption text-textSecondary text-no-wrap">{{ stat.label }}</span>
        </div>
        <p
          :ref="(el: any) => setRef(stat.key, el)"
          class="text-h6 font-weight-black text-primary hero-value"
        >
          {{ stat.displayValue }}
        </p>
        <div v-if="stat.delta !== null" class="mt-1">
          <v-chip
            :color="stat.delta >= 0 ? 'success' : 'error'"
            variant="tonal"
            size="x-small"
            class="font-weight-bold"
          >
            <v-icon start size="10">{{
              stat.delta >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
            }}</v-icon>
            {{ stat.delta >= 0 ? '+' : '' }}{{ stat.deltaDisplay }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { CountUp } from 'countup.js'
import type { OverviewStatistics, ComparisonStats } from '@/interfaces/Statistics.interface'

const props = defineProps<{
  overview: OverviewStatistics | null
  comparison: ComparisonStats | null
}>()

const { t } = useI18n()

const refs = ref<Record<string, HTMLElement | null>>({})
const animatedKeys = ref<Set<string>>(new Set())

function setRef(key: string, el: HTMLElement | null) {
  if (el) refs.value[key] = el
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
  return `${v}`
}

function computeDelta(current: number, previous: number): number | null {
  if (previous === 0 && current === 0) return null
  if (previous === 0) return 100
  return Math.round(((current - previous) / previous) * 100)
}

const heroStats = computed(() => {
  const o = props.overview
  const c = props.comparison
  if (!o) return []

  const weeklyVolumeDelta = c
    ? computeDelta(c.weekly.current.volume, c.weekly.previous.volume)
    : null
  const weeklyWorkoutDelta = c
    ? computeDelta(c.weekly.current.workouts, c.weekly.previous.workouts)
    : null

  return [
    {
      key: 'workouts',
      icon: 'mdi-dumbbell',
      iconColor: 'primary',
      label: t('statistics.totalWorkouts'),
      value: o.totalWorkouts,
      displayValue: o.totalWorkouts.toLocaleString(),
      delta: weeklyWorkoutDelta,
      deltaDisplay: weeklyWorkoutDelta !== null ? `${Math.abs(weeklyWorkoutDelta)}%` : '',
    },
    {
      key: 'volume',
      icon: 'mdi-weight-kilogram',
      iconColor: 'blue',
      label: t('statistics.totalVolume'),
      value: o.totalVolume,
      displayValue: formatVolume(o.totalVolume) + ' kg',
      delta: weeklyVolumeDelta,
      deltaDisplay: weeklyVolumeDelta !== null ? `${Math.abs(weeklyVolumeDelta)}%` : '',
    },
    {
      key: 'streak',
      icon: 'mdi-fire',
      iconColor: 'orange',
      label: t('statistics.currentStreak'),
      value: o.currentStreak,
      displayValue: `${o.currentStreak}`,
      delta: null,
      deltaDisplay: '',
    },
  ]
})

function animateNumbers() {
  for (const stat of heroStats.value) {
    const el = refs.value[stat.key]
    if (!el || animatedKeys.value.has(stat.key)) continue

    const countUp = new CountUp(el, stat.value, {
      duration: 1.8,
      useEasing: true,
      startVal: 0,
      formattingFn: (n: number) => {
        if (stat.key === 'volume') return formatVolume(Math.round(n)) + ' kg'
        return Math.round(n).toLocaleString()
      },
    })

    if (!countUp.error) {
      animatedKeys.value.add(stat.key)
      countUp.start()
    }
  }
}

watch(
  () => props.overview,
  async val => {
    if (val && val.totalWorkouts > 0) {
      await nextTick()
      animateNumbers()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (props.overview && props.overview.totalWorkouts > 0) {
    await nextTick()
    animateNumbers()
  }
})
</script>

<style scoped>
.hero-card {
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 50%, rgba(171, 255, 26, 0.04) 0%, transparent 50%);
  pointer-events: none;
}

.hero-stats-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.hero-stat {
  position: relative;
  z-index: 1;
  text-align: center;
  flex: 1;
  min-width: 0;
}

.hero-value {
  letter-spacing: -0.5px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-icon-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>
