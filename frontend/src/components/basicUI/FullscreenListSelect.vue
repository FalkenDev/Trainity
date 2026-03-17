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
  <div
    v-bind="$attrs"
    class="fullscreen-list-select"
    :class="{ 'fullscreen-list-select--disabled': disabled }"
    @click="!disabled && (isOpen = true)"
  >
    <!-- Multi mode: label above + chip container -->
    <template v-if="multiple">
      <p class="text-body-2 text-medium-emphasis mb-2">{{ label }}</p>
      <div class="chip-activator">
        <div class="d-flex flex-wrap ga-1 flex-grow-1">
          <v-chip
            v-for="item in selectedItems"
            :key="String(item.value)"
            size="small"
          >
            {{ item.title }}
          </v-chip>
        </div>
        <v-icon class="chip-activator__icon" size="20">mdi-menu-down</v-icon>
      </div>
    </template>

    <!-- Single mode: text field -->
    <v-text-field
      v-else
      :model-value="displayText"
      :label="label"
      variant="outlined"
      readonly
      :disabled="disabled"
      append-inner-icon="mdi-menu-down"
      hide-details="auto"
      class="pointer-field"
    />

    <!-- Full-screen dialog (inside root so inheritAttrs works) -->
    <v-dialog v-model="isOpen" fullscreen>
      <div class="d-flex flex-column fill-height bg-background">
        <BackHeader :title="label" :show-menu="false" @close="isOpen = false">
          <template v-if="multiple || (clearable && hasSelection)" #right>
            <div class="d-flex align-center ga-1">
              <v-btn
                v-if="clearable && hasSelection"
                variant="text"
                color="error"
                density="compact"
                @click="clearSelection"
              >
                {{ $t('common.clear') }}
              </v-btn>
              <v-btn
                v-if="multiple"
                variant="flat"
                color="primary"
                density="compact"
                @click="isOpen = false"
              >
                {{ $t('common.done') }}
              </v-btn>
            </div>
          </template>
          <template v-else #right>
            <div style="width: 40px" />
          </template>
        </BackHeader>

        <!-- List -->
        <!-- Note: do NOT add pa-0 or pt-0/px-0 via Vuetify helper classes as pa-0 uses !important
             and will override the pb-safe env() value. Use px-0 pt-0 instead if padding removal needed. -->
        <v-list class="flex-grow-1 overflow-y-auto pb-safe px-0 pt-0 bg-background">
          <v-list-item
            v-for="item in props.items"
            :key="String(item.value)"
            :title="item.title"
            class="border-b-sm py-3"
            @click="selectItem(item)"
          >
            <template #append>
              <v-checkbox-btn
                v-if="multiple"
                :model-value="isItemSelected(item)"
                color="primary"
                hide-details
                density="compact"
              />
              <v-icon v-else-if="isItemSelected(item)" color="primary">
                mdi-check
              </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts" generic="T">
defineOptions({ inheritAttrs: false })
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

const selectedValues = computed<unknown[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? (props.modelValue as unknown[]) : []
  return props.modelValue != null ? [props.modelValue] : []
})

const selectedItems = computed(() =>
  props.items.filter(i => selectedValues.value.includes(i.value))
)

const hasSelection = computed(() => selectedValues.value.length > 0)

function isItemSelected(item: { title: string; value: unknown }): boolean {
  return selectedValues.value.includes(item.value)
}

const displayText = computed(() => {
  if (props.multiple) return ''
  return selectedItems.value[0]?.title ?? ''
})

function selectItem(item: { title: string; value: unknown }) {
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
    isOpen.value = false
  }
}
</script>

<style scoped>
.fullscreen-list-select--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.chip-activator {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid rgb(var(--v-theme-borderColor));
  border-radius: 4px;
  padding: 10px 12px;
  min-height: 52px;
  cursor: pointer;
}

.chip-activator__icon {
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.6;
}

.pointer-field :deep(input) {
  cursor: pointer;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
