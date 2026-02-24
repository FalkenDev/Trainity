<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-2">
      <p class="text-caption text-uppercase font-weight-bold text-textSecondary">
        {{ $t('statistics.prTimeline.title') }}
      </p>
      <button
        v-if="prs && prs.length > 4 && !showAll"
        class="text-caption font-weight-bold text-primary view-all-btn"
        @click="showAll = true"
      >
        {{ $t('statistics.prTimeline.viewAll') }}
      </button>
      <button
        v-else-if="showAll && prs && prs.length > 4"
        class="text-caption font-weight-bold text-primary view-all-btn"
        @click="showAll = false"
      >
        {{ $t('statistics.prTimeline.showLess') }}
      </button>
    </div>

    <div v-if="!prs || prs.length === 0" class="text-center py-4">
      <v-card
        class="bg-cardBg pa-4 rounded-lg"
        style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
      >
        <v-icon size="32" class="mb-2" style="opacity: 0.4" color="amber">mdi-trophy-outline</v-icon>
        <p class="text-caption text-textSecondary">{{ $t('statistics.prTimeline.empty') }}</p>
      </v-card>
    </div>

    <div v-else class="pr-grid">
      <v-card
        v-for="pr in displayedPRs"
        :key="`${pr.exerciseId}-${pr.recordType}`"
        class="bg-cardBg pa-3 rounded-lg pr-card"
        style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none"
        @click="$emit('select-exercise', pr.exerciseId)"
      >
        <div class="d-flex align-center ga-2 mb-2">
          <div class="pr-trophy-wrap">
            <v-icon size="16" color="amber">mdi-trophy</v-icon>
          </div>
          <span class="text-caption text-textSecondary">{{ formatRelativeDate(pr.date) }}</span>
        </div>
        <p class="text-body-2 font-weight-bold text-truncate mb-1">{{ pr.exerciseName }}</p>
        <div class="d-flex align-center ga-2">
          <v-chip
            size="x-small"
            :color="getRecordColor(pr.recordType)"
            variant="tonal"
            class="font-weight-bold"
          >
            {{ formatRecordType(pr.recordType) }}
          </v-chip>
          <span class="text-body-2 font-weight-bold text-primary">
            {{ formatRecordValue(pr) }}
          </span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PersonalRecord, RecordType } from '@/interfaces/Statistics.interface'

const props = defineProps<{
  prs: PersonalRecord[]
}>()

defineEmits<{
  (e: 'select-exercise', exerciseId: number): void
}>()

const { t } = useI18n()
const showAll = ref(false)

const displayedPRs = computed(() => {
  if (!props.prs) return []
  const sorted = [...props.prs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return showAll.value ? sorted : sorted.slice(0, 4)
})

function formatRecordType(type: RecordType): string {
  const map: Record<string, string> = {
    max_weight: t('statistics.records.maxWeight'),
    estimated_1rm: t('statistics.records.estimated1RM'),
    max_volume_set: t('statistics.records.maxVolumeSet'),
    max_volume_session: t('statistics.records.maxVolumeSession'),
    max_reps: t('statistics.records.maxReps'),
  }
  return map[type] || type
}

function formatRecordValue(pr: PersonalRecord): string {
  if (pr.recordType === 'max_reps') return `${pr.value} reps`
  return `${pr.value} kg`
}

function getRecordColor(type: RecordType): string {
  const map: Record<string, string> = {
    max_weight: 'red',
    estimated_1rm: 'purple',
    max_volume_set: 'blue',
    max_volume_session: 'teal',
    max_reps: 'orange',
  }
  return map[type] || 'primary'
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t('statistics.prTimeline.today')
  if (diffDays === 1) return t('statistics.prTimeline.yesterday')
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.pr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pr-card {
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease;
}

.pr-card:hover {
  border-color: rgba(171, 255, 26, 0.3) !important;
}

.pr-card:active {
  transform: scale(0.97);
}

.pr-trophy-wrap {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 193, 7, 0.1);
  flex-shrink: 0;
}

.view-all-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.view-all-btn:hover {
  text-decoration: underline;
}
</style>
