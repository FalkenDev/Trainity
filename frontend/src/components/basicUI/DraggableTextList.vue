<template>
  <div>
    <div v-for="(item, index) in modelValue" :key="index" class="d-flex align-center ga-2 mb-2">
      <v-icon
        size="18"
        color="textSecondary"
        class="cursor-pointer"
        @mousedown.prevent="startDrag(index)"
        @touchstart.prevent="startDrag(index)"
      >
        mdi-drag
      </v-icon>
      <v-avatar v-if="numbered" color="avatarBg" size="24" class="text-primary text-caption">
        {{ index + 1 }}
      </v-avatar>
      <v-icon v-if="icon" :color="iconColor" size="20">{{ icon }}</v-icon>
      <p class="text-body-2 text-textSecondary flex-grow-1">{{ item }}</p>
      <v-icon size="18" color="textSecondary" class="cursor-pointer" @click="moveUp(index)">
        mdi-chevron-up
      </v-icon>
      <v-icon size="18" color="textSecondary" class="cursor-pointer" @click="moveDown(index)">
        mdi-chevron-down
      </v-icon>
      <v-icon size="18" color="error" class="cursor-pointer" @click="removeItem(index)">
        mdi-close
      </v-icon>
    </div>
    <div class="d-flex align-center ga-2 mt-2">
      <v-text-field
        v-model="newItem"
        :placeholder="placeholder"
        variant="outlined"
        hide-details
        density="compact"
        class="flex-grow-1"
        @keydown.enter="addItem"
      />
      <v-btn
        icon
        size="small"
        color="primary"
        variant="text"
        :disabled="!newItem.trim()"
        @click="addItem"
      >
        <v-icon>mdi-plus</v-icon>
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

const newItem = ref('')
const dragIndex = ref<number | null>(null)

const addItem = () => {
  const text = newItem.value.trim()
  if (!text) return
  emit('update:modelValue', [...props.modelValue, text])
  newItem.value = ''
}

const removeItem = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

const moveUp = (index: number) => {
  if (index === 0) return
  const updated = [...props.modelValue]
  ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
  emit('update:modelValue', updated)
}

const moveDown = (index: number) => {
  if (index >= props.modelValue.length - 1) return
  const updated = [...props.modelValue]
  ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
  emit('update:modelValue', updated)
}

const startDrag = (index: number) => {
  dragIndex.value = index
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
