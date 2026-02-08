<template>
  <v-dialog v-model="dialogOpen" fullscreen transition="slide-y-transition" persistent>
    <v-card class="d-flex flex-column bg-background">
      <BackHeader :title="$t('weightLog.title')" @close="close" />

      <!-- First-time setup: no startWeight set yet -->
      <template v-if="showFirstTimeSetup">
        <v-card-text class="pa-5 flex-grow-1 d-flex flex-column ga-4">
          <div class="text-center mb-2">
            <v-icon size="64" color="primary" class="mb-3">mdi-scale-bathroom</v-icon>
            <h2 class="text-h6 text-textPrimary">{{ $t('weightLog.firstTimeTitle') }}</h2>
            <p class="text-body-2 text-textSecondary mt-2">
              {{ $t('weightLog.firstTimeDescription') }}
            </p>
          </div>

          <v-text-field
            v-model.number="setupWeight"
            :label="$t('weightLog.currentWeight')"
            :suffix="weightUnit"
            type="number"
            step="0.1"
            variant="outlined"
            :rules="[rules.required, rules.positive]"
          />

          <v-text-field
            v-model.number="setupTargetWeight"
            :label="$t('weightLog.targetWeight') + ' (' + $t('common.optional') + ')'"
            :suffix="weightUnit"
            type="number"
            step="0.1"
            variant="outlined"
          />

          <v-select
            v-model="setupGoalType"
            :items="goalTypeItems"
            :label="$t('weightLog.goalType') + ' (' + $t('common.optional') + ')'"
            variant="outlined"
          />

          <v-btn
            color="primary"
            size="large"
            block
            :loading="isSavingSetup"
            :disabled="!setupWeight || setupWeight <= 0"
            @click="saveFirstTimeSetup"
          >
            {{ $t('weightLog.startTracking') }}
          </v-btn>
        </v-card-text>
      </template>

      <!-- Main weight log view -->
      <template v-else>
        <v-card-text class="pa-5 flex-grow-1 overflow-y-auto">
          <!-- Stats summary cards -->
          <div class="d-flex ga-3 mb-5">
            <v-card
              class="flex-grow-1 bg-cardBg py-3 d-flex flex-column align-center rounded-lg"
              style="border: 1px solid #474747; box-shadow: none; flex: 1"
            >
              <p class="text-caption text-textSecondary text-uppercase mb-1">
                {{ $t('weightLog.current') }}
              </p>
              <h2 class="text-h6 text-textPrimary">
                {{ formatWeight(stats?.currentWeight) }}
              </h2>
              <p class="text-caption text-textSecondary">{{ weightUnit }}</p>
            </v-card>
            <v-card
              class="flex-grow-1 bg-cardBg py-3 d-flex flex-column align-center rounded-lg"
              style="border: 1px solid #474747; box-shadow: none; flex: 1"
            >
              <p class="text-caption text-textSecondary text-uppercase mb-1">
                {{ $t('weightLog.sinceStart') }}
              </p>
              <h2 class="text-h6" :class="changeColor(stats?.changeFromStart)">
                {{ formatChange(stats?.changeFromStart) }}
              </h2>
              <p class="text-caption text-textSecondary">{{ weightUnit }}</p>
            </v-card>
            <v-card
              class="flex-grow-1 bg-cardBg py-3 d-flex flex-column align-center rounded-lg"
              style="border: 1px solid #474747; box-shadow: none; flex: 1"
            >
              <p class="text-caption text-textSecondary text-uppercase mb-1">
                {{ $t('weightLog.sinceLast') }}
              </p>
              <h2 class="text-h6" :class="changeColor(stats?.changeFromLastLog)">
                {{ formatChange(stats?.changeFromLastLog) }}
              </h2>
              <p class="text-caption text-textSecondary">{{ weightUnit }}</p>
            </v-card>
          </div>

          <!-- Target weight indicator -->
          <v-card
            v-if="stats?.targetWeight"
            class="bg-cardBg pa-3 mb-5 rounded-lg d-flex align-center ga-3"
            style="border: 1px solid #474747; box-shadow: none"
          >
            <v-icon color="primary" size="20">mdi-flag-checkered</v-icon>
            <div class="flex-grow-1">
              <p class="text-body-2 text-textPrimary">
                {{ $t('weightLog.targetWeight') }}: {{ formatWeight(stats.targetWeight) }}
                {{ weightUnit }}
              </p>
              <p
                v-if="stats.currentWeight && stats.targetWeight"
                class="text-caption text-textSecondary"
              >
                {{ formatWeight(Math.abs(stats.currentWeight - stats.targetWeight)) }}
                {{ weightUnit }}
                {{ $t('weightLog.toGo') }}
              </p>
            </div>
          </v-card>

          <!-- Chart -->
          <v-card
            class="bg-cardBg pa-4 mb-5 rounded-lg"
            style="border: 1px solid #474747; box-shadow: none"
          >
            <h3 class="text-subtitle-1 text-textPrimary mb-3">{{ $t('weightLog.progress') }}</h3>
            <div v-if="chartData && sortedLogs.length > 1" style="height: 220px">
              <Line :data="chartData" :options="chartOptions" />
            </div>
            <div
              v-else
              class="d-flex align-center justify-center text-textSecondary"
              style="height: 120px"
            >
              <p class="text-body-2">{{ $t('weightLog.needMoreData') }}</p>
            </div>
          </v-card>

          <!-- History table -->
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-subtitle-1 text-textPrimary">{{ $t('weightLog.history') }}</h3>
            <v-btn
              color="primary"
              size="small"
              variant="tonal"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              {{ $t('weightLog.addEntry') }}
            </v-btn>
          </div>

          <v-card
            v-if="sortedLogs.length === 0"
            class="bg-cardBg pa-6 rounded-lg d-flex flex-column align-center"
            style="border: 1px solid #474747; box-shadow: none"
          >
            <v-icon size="48" color="textSecondary" class="mb-2">mdi-scale-bathroom</v-icon>
            <p class="text-body-2 text-textSecondary">{{ $t('weightLog.noEntries') }}</p>
          </v-card>

          <div v-else class="d-flex flex-column ga-2">
            <!-- Table header -->
            <div
              class="d-flex px-3 py-2"
              style="font-size: 11px; text-transform: uppercase; color: #9e9e9e"
            >
              <div style="flex: 2">{{ $t('common.date') }}</div>
              <div style="flex: 1.5; text-align: right">{{ $t('weightLog.weight') }}</div>
              <div style="flex: 1.5; text-align: right">{{ $t('weightLog.result') }}</div>
              <div style="flex: 1.5; text-align: right">{{ $t('common.total') }}</div>
              <div style="width: 36px"></div>
            </div>

            <!-- Table rows -->
            <v-card
              v-for="(entry, index) in sortedLogs"
              :key="entry.id"
              class="bg-cardBg px-3 py-2 rounded-lg d-flex align-center"
              style="border: 1px solid #474747; box-shadow: none"
            >
              <div style="flex: 2">
                <p class="text-body-2 text-textPrimary">{{ formatDate(entry.date) }}</p>
              </div>
              <div style="flex: 1.5; text-align: right">
                <p class="text-body-2 text-textPrimary">
                  {{ formatWeight(entry.weight) }}
                </p>
              </div>
              <div style="flex: 1.5; text-align: right">
                <p class="text-body-2" :class="changeColor(getResult(index))">
                  {{ formatChange(getResult(index)) }}
                </p>
              </div>
              <div style="flex: 1.5; text-align: right">
                <p class="text-body-2" :class="changeColor(getTotal(entry))">
                  {{ formatChange(getTotal(entry)) }}
                </p>
              </div>
              <div style="width: 36px" class="d-flex justify-end">
                <v-menu>
                  <template #activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" icon size="x-small" variant="text">
                      <v-icon size="16">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="openEditDialog(entry)">
                      <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="text-error" @click="confirmDelete(entry)">
                      <v-list-item-title>{{ $t('common.delete') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card>
          </div>
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>

  <!-- Add / Edit weight entry dialog -->
  <v-dialog v-model="entryDialogOpen" max-width="400" persistent>
    <v-card class="bg-cardBg rounded-lg" style="border: 1px solid #474747">
      <v-card-title class="text-h6 pa-4">
        {{ editingEntry ? $t('weightLog.editEntry') : $t('weightLog.addEntry') }}
      </v-card-title>
      <v-card-text class="px-4 pb-0">
        <v-text-field
          v-model="entryForm.date"
          :label="$t('common.date')"
          type="date"
          variant="outlined"
          class="mb-3"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model.number="entryForm.weight"
          :label="$t('weightLog.weight')"
          :suffix="weightUnit"
          type="number"
          step="0.1"
          variant="outlined"
          class="mb-3"
          :rules="[rules.required, rules.positive]"
        />
        <v-textarea
          v-model="entryForm.notes"
          :label="$t('weightLog.notes') + ' (' + $t('common.optional') + ')'"
          variant="outlined"
          rows="2"
        />
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="entryDialogOpen = false">{{ $t('common.cancel') }}</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="isSavingEntry"
          :disabled="!entryForm.weight || entryForm.weight <= 0"
          @click="saveEntry"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete confirmation dialog -->
  <v-dialog v-model="deleteDialogOpen" max-width="360">
    <v-card class="bg-cardBg rounded-lg" style="border: 1px solid #474747">
      <v-card-title class="text-h6 pa-4">{{ $t('weightLog.deleteEntry') }}</v-card-title>
      <v-card-text class="px-4">
        <p class="text-body-2 text-textSecondary">{{ $t('weightLog.deleteConfirm') }}</p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="deleteDialogOpen = false">{{ $t('common.cancel') }}</v-btn>
        <v-spacer />
        <v-btn color="error" :loading="isDeleting" @click="doDelete">{{
          $t('common.delete')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { useWeightLogStore } from '@/stores/weightLog.store'
import { useAuthStore } from '@/stores/auth.store'
import * as weightLogService from '@/services/weightLog.service'
import { updateUser } from '@/services/user.service'
import type { WeightLog } from '@/interfaces/WeightLog.interface'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const { t } = useI18n({ useScope: 'global' })

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'weight-updated': []
}>()

const authStore = useAuthStore()
const weightLogStore = useWeightLogStore()

const dialogOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const stats = computed(() => weightLogStore.stats)
const sortedLogs = computed(() => {
  // Already sorted DESC from API — newest first
  return [...weightLogStore.weightLogs]
})

const currentUser = computed(() => authStore.user)
const isImperial = computed(() => currentUser.value?.unitScale === 'imperial')
const weightUnit = computed(() => (isImperial.value ? 'lbs' : 'kg'))

// First-time setup
const showFirstTimeSetup = computed(() => {
  return (
    currentUser.value?.showWeightTracking &&
    !currentUser.value?.startWeight &&
    sortedLogs.value.length === 0
  )
})

const setupWeight = ref<number | null>(null)
const setupTargetWeight = ref<number | null>(null)
const setupGoalType = ref<string | null>(null)
const isSavingSetup = ref(false)

const goalTypeItems = computed(() => [
  { title: t('weightLog.goalLose'), value: 'lose' },
  { title: t('weightLog.goalGain'), value: 'gain' },
  { title: t('weightLog.goalMaintain'), value: 'maintain' },
])

// Convert display weight to kg for storage
const toKg = (val: number) => (isImperial.value ? val / 2.20462 : val)
const fromKg = (val: number) => (isImperial.value ? val * 2.20462 : val)

const formatWeight = (val?: number) => {
  if (val === undefined || val === null) return '—'
  const display = fromKg(val)
  return display.toFixed(1)
}

const formatChange = (val?: number) => {
  if (val === undefined || val === null) return '—'
  const display = fromKg(val)
  const sign = display > 0 ? '+' : ''
  return `${sign}${display.toFixed(1)}`
}

const changeColor = (val?: number) => {
  if (val === undefined || val === null || val === 0) return 'text-textPrimary'
  const goalType = stats.value?.weightGoalType
  if (goalType === 'lose') return val < 0 ? 'text-success' : 'text-error'
  if (goalType === 'gain') return val > 0 ? 'text-success' : 'text-error'
  return 'text-textPrimary'
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// Result: difference from the *next* (earlier) entry in the sorted (desc) list
const getResult = (index: number) => {
  if (index >= sortedLogs.value.length - 1) return undefined
  const current = Number(sortedLogs.value[index].weight)
  const previous = Number(sortedLogs.value[index + 1].weight)
  return Number((current - previous).toFixed(2))
}

// Total: difference from start weight
const getTotal = (entry: WeightLog) => {
  if (!stats.value?.startWeight) return undefined
  return Number((Number(entry.weight) - stats.value.startWeight).toFixed(2))
}

// Chart
const chartData = computed((): ChartData<'line'> | null => {
  if (sortedLogs.value.length < 2) return null

  // Reverse to get chronological order (oldest first)
  const chronological = [...sortedLogs.value].reverse()

  const labels = chronological.map(log => {
    const d = new Date(log.date)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  })

  const data = chronological.map(log => fromKg(Number(log.weight)))

  const datasets: ChartData<'line'>['datasets'] = [
    {
      label: t('weightLog.weight'),
      data,
      borderColor: '#abff1a',
      backgroundColor: 'rgba(171, 255, 26, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#abff1a',
      pointBorderColor: '#abff1a',
    },
  ]

  // Target weight dashed line
  if (stats.value?.targetWeight) {
    const targetVal = fromKg(stats.value.targetWeight)
    datasets.push({
      label: t('weightLog.targetWeight'),
      data: Array(labels.length).fill(targetVal),
      borderColor: '#ff6b6b',
      borderDash: [8, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
    })
  }

  return { labels, datasets }
})

const chartOptions = computed(
  (): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#fff',
        bodyColor: '#ccc',
        borderColor: '#474747',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#9e9e9e', maxRotation: 45 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#9e9e9e' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  })
)

// Entry dialog
const entryDialogOpen = ref(false)
const editingEntry = ref<WeightLog | null>(null)
const isSavingEntry = ref(false)
const entryForm = ref({ date: '', weight: null as number | null, notes: '' })

const rules = {
  required: (v: string | number | null) => !!v || t('weightLog.fieldRequired'),
  positive: (v: number) => (v && v > 0) || t('weightLog.mustBePositive'),
}

const openAddDialog = () => {
  editingEntry.value = null
  entryForm.value = {
    date: new Date().toISOString().split('T')[0],
    weight: null,
    notes: '',
  }
  entryDialogOpen.value = true
}

const openEditDialog = (entry: WeightLog) => {
  editingEntry.value = entry
  entryForm.value = {
    date: entry.date.split('T')[0],
    weight: Number(fromKg(Number(entry.weight)).toFixed(1)),
    notes: entry.notes || '',
  }
  entryDialogOpen.value = true
}

const saveEntry = async () => {
  if (!entryForm.value.weight || entryForm.value.weight <= 0) return
  isSavingEntry.value = true

  try {
    const weightInKg = Number(toKg(entryForm.value.weight).toFixed(2))

    if (editingEntry.value) {
      await weightLogService.updateWeightLog(editingEntry.value.id, {
        weight: weightInKg,
        notes: entryForm.value.notes || undefined,
      })
      toast.success(t('weightLog.entryUpdated'), { progressBar: true, duration: 1000 })
    } else {
      await weightLogService.createWeightLog({
        date: entryForm.value.date,
        weight: weightInKg,
        notes: entryForm.value.notes || undefined,
      })
      toast.success(t('weightLog.entryCreated'), { progressBar: true, duration: 1000 })
    }

    await weightLogStore.refreshAll()
    await authStore.refreshUser()
    emit('weight-updated')
    entryDialogOpen.value = false
  } catch (error) {
    console.error('Failed to save weight log:', error)
    toast.error(t('weightLog.failedToSave'), { progressBar: true, duration: 1000 })
  } finally {
    isSavingEntry.value = false
  }
}

// Delete
const deleteDialogOpen = ref(false)
const deletingEntry = ref<WeightLog | null>(null)
const isDeleting = ref(false)

const confirmDelete = (entry: WeightLog) => {
  deletingEntry.value = entry
  deleteDialogOpen.value = true
}

const doDelete = async () => {
  if (!deletingEntry.value) return
  isDeleting.value = true

  try {
    await weightLogService.deleteWeightLog(deletingEntry.value.id)
    toast.success(t('weightLog.entryDeleted'), { progressBar: true, duration: 1000 })
    await weightLogStore.refreshAll()
    await authStore.refreshUser()
    emit('weight-updated')
    deleteDialogOpen.value = false
  } catch (error) {
    console.error('Failed to delete weight log:', error)
    toast.error(t('weightLog.failedToDelete'), { progressBar: true, duration: 1000 })
  } finally {
    isDeleting.value = false
  }
}

// First-time setup save
const saveFirstTimeSetup = async () => {
  if (!setupWeight.value || setupWeight.value <= 0) return
  isSavingSetup.value = true

  try {
    const weightInKg = Number(toKg(setupWeight.value).toFixed(2))

    // Create the first weight log
    await weightLogService.createWeightLog({
      date: new Date().toISOString().split('T')[0],
      weight: weightInKg,
    })

    // Update user preferences
    const prefs: Record<string, unknown> = {}
    if (setupTargetWeight.value && setupTargetWeight.value > 0) {
      prefs.targetWeight = Number(toKg(setupTargetWeight.value).toFixed(2))
    }
    if (setupGoalType.value) {
      prefs.weightGoalType = setupGoalType.value
    }
    if (Object.keys(prefs).length > 0) {
      await updateUser(prefs)
    }

    await weightLogStore.refreshAll()
    await authStore.refreshUser()
    emit('weight-updated')
    toast.success(t('weightLog.trackingStarted'), { progressBar: true, duration: 1000 })
  } catch (error) {
    console.error('Failed to save first-time setup:', error)
    toast.error(t('weightLog.failedToSave'), { progressBar: true, duration: 1000 })
  } finally {
    isSavingSetup.value = false
  }
}

const close = () => {
  dialogOpen.value = false
}

// Load data when dialog opens
watch(dialogOpen, async open => {
  if (open) {
    await weightLogStore.refreshAll()
  }
})
</script>
