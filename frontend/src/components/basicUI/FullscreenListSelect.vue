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
  <!-- Activator field -->
  <div
    class="fullscreen-list-select"
    :class="{ 'fullscreen-list-select--disabled': disabled }"
    @click="!disabled && (isOpen = true)"
  >
    <v-text-field
      :model-value="displayText"
      :label="label"
      variant="outlined"
      readonly
      :disabled="disabled"
      append-inner-icon="mdi-menu-down"
      hide-details="auto"
      class="pointer-field"
    >
      <!-- Chips for multi mode -->
      <template v-if="multiple && selectedItems.length" #prepend-inner>
        <div class="d-flex flex-wrap ga-1 my-1">
          <v-chip
            v-for="item in selectedItems"
            :key="String(item.value)"
            size="small"
          >
            {{ item.title }}
          </v-chip>
        </div>
      </template>
    </v-text-field>
  </div>

  <!-- Full-screen dialog -->
  <v-dialog v-model="isOpen" fullscreen>
    <v-card class="d-flex flex-column bg-background" style="height: 100%">
      <!-- Header -->
      <v-toolbar color="background" class="flex-shrink-0">
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ label }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          v-if="clearable && hasSelection"
          variant="text"
          color="error"
          @click="clearSelection"
        >
          {{ $t('common.clear') }}
        </v-btn>
        <v-btn
          v-if="multiple"
          variant="text"
          color="primary"
          @click="isOpen = false"
        >
          {{ $t('common.done') }}
        </v-btn>
      </v-toolbar>

      <v-divider />

      <!-- List -->
      <!-- Note: do NOT add pa-0 or pt-0/px-0 via Vuetify helper classes as pa-0 uses !important
           and will override the pb-safe env() value. Use px-0 pt-0 instead if padding removal needed. -->
      <v-list class="flex-grow-1 overflow-y-auto pb-safe px-0 pt-0">
        <v-list-item
          v-for="item in normalizedItems"
          :key="String(item.value)"
          :title="item.title"
          class="border-b-sm py-1"
          @click="selectItem(item)"
        >
          <template #append>
            <v-checkbox-btn
              v-if="multiple"
              :model-value="isItemSelected(item)"
              color="primary"
              hide-details
              density="compact"
              @click.stop="selectItem(item)"
            />
            <v-icon v-else-if="isItemSelected(item)" color="primary">
              mdi-check
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts" generic="T">
type NormalizedItem = { title: string; value: unknown }

const props = withDefaults(
  defineProps<{
    modelValue: T
    items: readonly { title: string; value: unknown }[]
    label?: string
    multiple?: boolean
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    label: '',
    multiple: false,
    clearable: false,
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const isOpen = ref(false)

const normalizedItems = computed<NormalizedItem[]>(() =>
  props.items.map(item => ({ title: item.title, value: item.value }))
)

const selectedValues = computed<unknown[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? (props.modelValue as unknown[]) : []
  return props.modelValue != null ? [props.modelValue] : []
})

const selectedItems = computed(() =>
  normalizedItems.value.filter(i => selectedValues.value.includes(i.value))
)

const hasSelection = computed(() => selectedValues.value.length > 0)

function isItemSelected(item: NormalizedItem): boolean {
  return selectedValues.value.includes(item.value)
}

const displayText = computed(() => {
  if (props.multiple) return ''
  return selectedItems.value[0]?.title ?? ''
})

function selectItem(item: NormalizedItem) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? (props.modelValue as unknown[]) : []
    const isSelected = current.includes(item.value)
    const next = isSelected
      ? current.filter(v => v !== item.value)
      : [...current, item.value]
    emit('update:modelValue', next as T)
  } else {
    emit('update:modelValue', item.value as T)
    isOpen.value = false
  }
}

function clearSelection() {
  if (props.multiple) {
    emit('update:modelValue', [] as unknown as T)
  } else {
    emit('update:modelValue', null as T)
  }
}
</script>

<style scoped>
.fullscreen-list-select--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.pointer-field :deep(input) {
  cursor: pointer;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
