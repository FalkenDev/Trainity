<template>
  <div>
    <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
      {{ $t('statistics.weeklyVolume.title') }}
    </p>

    <v-card
      class="bg-cardBg pa-4 rounded-lg"
      style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
    >
      <div v-if="trends.length === 0" class="text-center py-6 text-textSecondary">
        <v-icon size="32" class="mb-2" style="opacity: 0.4">mdi-chart-bar</v-icon>
        <p class="text-caption">{{ $t('statistics.noData') }}</p>
      </div>

      <div v-else>
        <!-- Mini summary row -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center ga-2">
            <span class="text-body-2 font-weight-bold text-textPrimary">
              {{ formatVolume(latestWeekVolume) }}
            </span>
            <span class="text-caption text-textSecondary">{{ $t('statistics.weeklyVolume.thisWeek') }}</span>
          </div>
          <v-chip
            v-if="weekOverWeekDelta !== null"
            :color="weekOverWeekDelta >= 0 ? 'success' : 'error'"
            variant="tonal"
            size="x-small"
            class="font-weight-bold"
          >
            <v-icon start size="10">{{ weekOverWeekDelta >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ weekOverWeekDelta >= 0 ? '+' : '' }}{{ weekOverWeekDelta }}%
          </v-chip>
        </div>

        <Bar :data="chartData" :options="chartOptions" style="max-height: 180px" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { WeeklyTrend } from '@/interfaces/Statistics.interface'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Filler)

const props = defineProps<{
  trends: WeeklyTrend[]
}>()

const { t } = useI18n()

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M kg`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K kg`
  return `${v} kg`
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const latestWeekVolume = computed(() => {
  if (props.trends.length === 0) return 0
  return props.trends[props.trends.length - 1].totalVolume
})

const weekOverWeekDelta = computed(() => {
  if (props.trends.length < 2) return null
  const current = props.trends[props.trends.length - 1].totalVolume
  const previous = props.trends[props.trends.length - 2].totalVolume
  if (previous === 0 && current === 0) return null
  if (previous === 0) return 100
  return Math.round(((current - previous) / previous) * 100)
})

const chartData = computed(() => {
  const maxVolume = Math.max(...props.trends.map((t) => t.totalVolume), 1)

  return {
    labels: props.trends.map((t) => formatWeekLabel(t.weekStart)),
    datasets: [
      {
        label: t('statistics.totalVolume'),
        data: props.trends.map((t) => t.totalVolume),
        backgroundColor: props.trends.map((trend, idx) => {
          // Highlight the latest bar with full primary, others with lower opacity
          const isLatest = idx === props.trends.length - 1
          const intensity = 0.25 + (trend.totalVolume / maxVolume) * 0.75
          if (isLatest) return '#ABFF1A'
          return `rgba(171, 255, 26, ${intensity * 0.6})`
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E1E1E',
      titleColor: '#fff',
      bodyColor: '#ABFF1A',
      borderColor: 'rgba(171, 255, 26, 0.3)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      callbacks: {
        label: (context: { parsed: { y: number | null } }) => formatVolume(context.parsed.y ?? 0),
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#888', font: { size: 9 }, maxRotation: 0 },
      grid: { display: false },
      border: { display: false },
    },
    y: {
      ticks: {
        color: '#888',
        font: { size: 9 },
        callback: (value: string | number) => {
          const v = Number(value)
          if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
          return String(v)
        },
      },
      grid: { color: 'rgba(255,255,255,0.04)' },
      border: { display: false },
    },
  },
}))
</script>
