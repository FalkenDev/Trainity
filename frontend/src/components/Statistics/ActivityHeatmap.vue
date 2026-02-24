<template>
  <div class="heatmap-container">
    <p class="text-caption text-uppercase font-weight-bold text-textSecondary mb-3">
      {{ $t('statistics.heatmap.title') }}
    </p>

    <v-card
      class="bg-cardBg pa-4 rounded-lg"
      style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
    >
      <!-- Month labels -->
      <div class="heatmap-months mb-1" :style="{ marginLeft: '34px', gridTemplateColumns: `repeat(${weekCount}, 1fr)` }">
        <span
          v-for="month in monthLabels"
          :key="month.label + month.col"
          class="text-caption text-textSecondary"
          :style="{ gridColumn: month.col }"
        >
          {{ month.label }}
        </span>
      </div>

      <div class="d-flex">
        <!-- Day labels -->
        <div class="heatmap-day-labels mr-2">
          <span class="text-caption text-textSecondary">{{ $t('statistics.heatmap.mon') }}</span>
          <span class="text-caption text-textSecondary">{{ $t('statistics.heatmap.wed') }}</span>
          <span class="text-caption text-textSecondary">{{ $t('statistics.heatmap.fri') }}</span>
        </div>

        <!-- Grid -->
        <div
          class="heatmap-grid"
          :style="{ gridTemplateColumns: `repeat(${weekCount}, 1fr)` }"
        >
          <div
            v-for="(cell, idx) in heatmapCells"
            :key="idx"
            class="heatmap-cell"
            :class="{ 'heatmap-cell-empty': !cell.inRange }"
            :style="{ backgroundColor: cell.inRange ? cell.color : 'transparent' }"
            @mouseenter="showTooltip($event, cell)"
            @mouseleave="hideTooltip"
          />
        </div>
      </div>

      <!-- Legend -->
      <div class="d-flex align-center justify-end ga-1 mt-3">
        <span class="text-caption text-textSecondary mr-1">{{ $t('statistics.heatmap.less') }}</span>
        <div
          v-for="(color, idx) in legendColors"
          :key="idx"
          class="heatmap-legend-cell"
          :style="{ backgroundColor: color }"
        />
        <span class="text-caption text-textSecondary ml-1">{{ $t('statistics.heatmap.more') }}</span>
      </div>
    </v-card>

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible"
      class="heatmap-tooltip"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      <span class="font-weight-bold">{{ tooltip.date }}</span>
      <span class="text-caption">
        {{ tooltip.count }} {{ tooltip.count === 1 ? $t('statistics.heatmap.workout') : $t('statistics.heatmap.workouts') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { HeatmapDay } from '@/interfaces/Statistics.interface'

const props = withDefaults(
  defineProps<{
    data: HeatmapDay[]
    weeks?: number
  }>(),
  { weeks: 12 }
)

const weekCount = computed(() => props.weeks)

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  date: '',
  count: 0,
})

const COLORS = {
  empty: 'rgba(255, 255, 255, 0.03)',
  level1: 'rgba(171, 255, 26, 0.2)',
  level2: 'rgba(171, 255, 26, 0.4)',
  level3: 'rgba(171, 255, 26, 0.65)',
  level4: '#ABFF1A',
}

const legendColors = [COLORS.empty, COLORS.level1, COLORS.level2, COLORS.level3, COLORS.level4]

function getColor(count: number): string {
  if (count === 0) return COLORS.empty
  if (count === 1) return COLORS.level1
  if (count === 2) return COLORS.level2
  if (count === 3) return COLORS.level3
  return COLORS.level4
}

interface HeatmapCell {
  date: string
  count: number
  color: string
  dayOfWeek: number
  inRange: boolean
}

const heatmapCells = computed(() => {
  const countMap = new Map<string, number>()
  for (const d of props.data) {
    countMap.set(d.date, d.count)
  }

  const cells: HeatmapCell[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the Monday of the earliest week
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (props.weeks * 7) + 1)
  // Adjust to Monday
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + mondayOffset)

  const totalDays = props.weeks * 7
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const count = countMap.get(dateStr) ?? 0
    cells.push({
      date: dateStr,
      count,
      color: getColor(count),
      dayOfWeek: d.getDay(),
      inRange: d <= today,
    })
  }

  return cells
})

const monthLabels = computed(() => {
  const labels: { label: string; col: number }[] = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let lastMonth = -1

  for (let weekIdx = 0; weekIdx < weekCount.value; weekIdx++) {
    const cellIdx = weekIdx * 7 // First day of the week (Monday)
    if (cellIdx < heatmapCells.value.length) {
      const cell = heatmapCells.value[cellIdx]
      const date = new Date(cell.date)
      const month = date.getMonth()
      if (month !== lastMonth) {
        labels.push({ label: monthNames[month], col: weekIdx + 1 })
        lastMonth = month
      }
    }
  }
  return labels
})

function showTooltip(event: MouseEvent, cell: HeatmapCell) {
  if (!cell.inRange) return
  const d = new Date(cell.date)
  tooltip.date = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  tooltip.count = cell.count
  tooltip.x = event.clientX
  tooltip.y = event.clientY - 60
  tooltip.visible = true
}

function hideTooltip() {
  tooltip.visible = false
}
</script>

<style scoped>
.heatmap-container {
  position: relative;
}

.heatmap-months {
  display: grid;
  grid-template-rows: 1fr;
  font-size: 11px;
  overflow: visible;
}

.heatmap-months span {
  white-space: nowrap;
  overflow: visible;
}

.heatmap-day-labels {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  align-items: center;
  min-width: 24px;
  font-size: 11px;
}

.heatmap-day-labels span:nth-child(1) { grid-row: 1; }
.heatmap-day-labels span:nth-child(2) { grid-row: 3; }
.heatmap-day-labels span:nth-child(3) { grid-row: 5; }

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 3px;
  flex: 1;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 3px;
  min-width: 0;
  min-height: 0;
  cursor: default;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.heatmap-cell:not(.heatmap-cell-empty):hover {
  transform: scale(1.3);
  opacity: 0.9;
}

.heatmap-cell-empty {
  pointer-events: none;
}

.heatmap-legend-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.heatmap-tooltip {
  position: fixed;
  z-index: 1000;
  background: #1e1e1e;
  border: 1px solid rgba(171, 255, 26, 0.3);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>
