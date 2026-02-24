<template>
  <div>
    <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-2">
      {{ $t('statistics.muscleBalance.title') }}
    </p>

    <v-card
      class="bg-cardBg pa-4 rounded-lg"
      style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
    >
      <div v-if="!muscleData || muscleData.length === 0" class="text-center py-6 text-textSecondary">
        <v-icon size="32" class="mb-2" style="opacity: 0.4">mdi-arm-flex</v-icon>
        <p class="text-caption">{{ $t('statistics.muscleBalance.empty') }}</p>
      </div>

      <div v-else>
        <Radar :data="chartData" :options="chartOptions" style="max-height: 260px" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  muscleData: { name: string; volume: number }[]
}>()

const { t } = useI18n()

const chartData = computed(() => ({
  labels: props.muscleData.map((m) => m.name),
  datasets: [
    {
      label: t('statistics.totalVolume'),
      data: props.muscleData.map((m) => m.volume),
      backgroundColor: 'rgba(171, 255, 26, 0.15)',
      borderColor: '#ABFF1A',
      borderWidth: 2,
      pointBackgroundColor: '#ABFF1A',
      pointBorderColor: 'rgba(171, 255, 26, 0.5)',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#ABFF1A',
      pointHoverBorderColor: '#fff',
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
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
        label: (context: { parsed: { r: number } }) => {
          const val = context.parsed.r
          if (val >= 1000) return `${(val / 1000).toFixed(1)}K kg`
          return `${val} kg`
        },
      },
    },
  },
  scales: {
    r: {
      grid: {
        color: 'rgba(255, 255, 255, 0.06)',
        circular: true,
      },
      angleLines: {
        color: 'rgba(255, 255, 255, 0.08)',
      },
      pointLabels: {
        color: '#A1A1A1',
        font: {
          size: 11,
          weight: 'bold' as const,
        },
      },
      ticks: {
        display: false,
        stepSize: undefined,
      },
      suggestedMin: 0,
    },
  },
}))
</script>
