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
  <div class="px-2 py-4 bg-cardBg rounded-lg" style="border: 1px solid rgb(var(--v-theme-borderColor)); box-shadow: none">
    <div
      v-for="(item, index) in localItems"
      :key="index"
      class="d-flex align-center ga-2 mb-2 drag-item"
      :class="{ 'drag-over': dragOverIndex === index }"
      draggable="true"
      @dragstart="onDragStart(index, $event)"
      @dragover.prevent="onDragOver(index)"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop(index)"
      @dragend="onDragEnd"
      @touchstart="onTouchStart(index, $event)"
      @touchmove.prevent="onTouchMove($event)"
      @touchend="onTouchEnd"
    >
      <v-icon size="34" color="textSecondary" class="cursor-grab drag-handle"> mdi-drag </v-icon>
      <v-avatar v-if="numbered" color="avatarBg" size="34" class="text-primary text-body-1">
        {{ index + 1 }}
      </v-avatar>
      <v-text-field
        :model-value="localItems[index]"
        :placeholder="placeholder"
        variant="outlined"
        hide-details
        density="compact"
        class="flex-grow-1"
        @update:model-value="updateItem(index, $event)"
        @keydown.enter.prevent="addItem"
      />
      <v-icon size="24" color="error" class="cursor-pointer" @click="removeItem(index)">
        mdi-trash-can-outline
      </v-icon>
    </div>
    <div class="d-flex align-center ga-2" :class="localItems.length <= 0 ? 'mt-0' : 'mt-6'">
      <v-btn class="w-100 rounded-xl" color="primary" variant="outlined" @click="addItem">
        <v-icon size="20">mdi-plus</v-icon>
        Add
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  placeholder?: string
  icon?: string
  iconColor?: string
  numbered?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const localItems = ref<string[]>([...props.modelValue])

watch(
  () => props.modelValue,
  val => {
    localItems.value = [...val]
  }
)

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// Touch drag state
const touchStartY = ref(0)
const touchCurrentElement = ref<Element | null>(null)

const updateItem = (index: number, value: string) => {
  const updated = [...localItems.value]
  updated[index] = value
  emit('update:modelValue', updated)
}

const addItem = () => {
  emit('update:modelValue', [...localItems.value, ''])
  nextTick(() => {
    // Focus the newly added text field
    const fields = document.querySelectorAll('.drag-item .v-text-field input')
    const lastField = fields[fields.length - 1] as HTMLInputElement
    lastField?.focus()
  })
}

const removeItem = (index: number) => {
  const updated = [...localItems.value]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

/** Filter out empty strings — call from parent before saving */
const getNonEmpty = () => localItems.value.filter(s => s.trim() !== '')

const moveItem = (from: number, to: number) => {
  if (from === to) return
  const updated = [...localItems.value]
  const [moved] = updated.splice(from, 1)
  updated.splice(to, 0, moved)
  emit('update:modelValue', updated)
}

// --- HTML5 Drag & Drop (mouse) ---
const onDragStart = (index: number, e: DragEvent) => {
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

const onDragOver = (index: number) => {
  dragOverIndex.value = index
}

const onDragLeave = () => {
  dragOverIndex.value = null
}

const onDrop = (index: number) => {
  if (dragIndex.value !== null) {
    moveItem(dragIndex.value, index)
  }
  dragIndex.value = null
  dragOverIndex.value = null
}

const onDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}

// --- Touch-based drag (mobile) ---
const onTouchStart = (index: number, e: TouchEvent) => {
  dragIndex.value = index
  touchStartY.value = e.touches[0].clientY
}

const onTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0]
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
  if (!elementBelow) return

  const dragItem = elementBelow.closest('.drag-item')
  if (dragItem) {
    const items = Array.from(dragItem.parentElement?.querySelectorAll('.drag-item') || [])
    const overIndex = items.indexOf(dragItem)
    if (overIndex !== -1) {
      dragOverIndex.value = overIndex
      touchCurrentElement.value = dragItem
    }
  }
}

const onTouchEnd = () => {
  if (dragIndex.value !== null && dragOverIndex.value !== null) {
    moveItem(dragIndex.value, dragOverIndex.value)
  }
  dragIndex.value = null
  dragOverIndex.value = null
  touchCurrentElement.value = null
}

defineExpose({ getNonEmpty })
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

.drag-item {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.drag-over {
  border-top: 2px solid rgb(var(--v-theme-primary));
  border-radius: 4px;
}
</style>
