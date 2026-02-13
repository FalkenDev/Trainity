<template>
  <div>
    <v-text-field
      v-model="inputValue"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      hide-details
      density="compact"
      @keydown.enter.prevent="addChip"
    >
      <template #append-inner>
        <v-icon v-if="inputValue.trim()" size="20" color="primary" @click="addChip">
          mdi-plus
        </v-icon>
      </template>
    </v-text-field>
    <div v-if="modelValue.length > 0" class="d-flex flex-wrap ga-2 mt-2">
      <v-chip
        v-for="(item, index) in modelValue"
        :key="index"
        closable
        color="primary"
        variant="outlined"
        size="small"
        @click:close="removeChip(index)"
      >
        {{ item }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const inputValue = ref('')

const addChip = () => {
  const text = inputValue.value.trim()
  if (!text) return
  if (props.modelValue.includes(text)) {
    inputValue.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, text])
  inputValue.value = ''
}

const removeChip = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}
</script>
