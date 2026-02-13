<template>
  <div>
    <div class="upload-area rounded-lg pa-4 text-center cursor-pointer" @click="triggerFileInput">
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,video/mp4"
        multiple
        style="display: none"
        @change="handleFileSelect"
      />
      <v-icon size="32" color="textSecondary">mdi-cloud-upload-outline</v-icon>
      <p class="text-body-2 text-textSecondary mt-1">
        {{ $t('exerciseForm.supportedFormats') }}
      </p>
    </div>

    <div v-if="allItems.length > 0" class="d-flex flex-wrap ga-2 mt-3">
      <v-card
        v-for="(item, index) in allItems"
        :key="item.key"
        class="media-thumb rounded-lg bg-cardBg position-relative"
        style="border: 1px solid #474747; box-shadow: none"
      >
        <img
          v-if="item.type === 'image'"
          :src="item.preview"
          class="media-thumb-img rounded-lg"
          alt=""
        />
        <div v-else class="media-thumb-video d-flex align-center justify-center rounded-lg">
          <v-icon size="24" color="primary">mdi-play-circle-outline</v-icon>
        </div>
        <v-btn
          icon
          size="x-small"
          color="error"
          variant="flat"
          class="remove-btn"
          @click.stop="removeItem(index)"
        >
          <v-icon size="14">mdi-close</v-icon>
        </v-btn>
        <div class="order-controls d-flex flex-column">
          <v-icon
            v-if="index > 0"
            size="14"
            color="white"
            class="cursor-pointer"
            @click.stop="moveItem(index, index - 1)"
          >
            mdi-chevron-left
          </v-icon>
          <v-icon
            v-if="index < allItems.length - 1"
            size="14"
            color="white"
            class="cursor-pointer"
            @click.stop="moveItem(index, index + 1)"
          >
            mdi-chevron-right
          </v-icon>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseMedia } from '@/interfaces/Exercise.interface'

export interface MediaItem {
  key: string
  type: 'image' | 'video'
  preview: string
  file?: File
  existingId?: number
  existingUrl?: string
}

const props = defineProps<{
  modelValue: MediaItem[]
  existingMedia?: ExerciseMedia[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MediaItem[]): void
  (e: 'removeExisting', mediaId: number): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getMediaUrl = (url: string) => {
  if (url.startsWith('http')) return url
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${url}`
}

const existingItems = computed<MediaItem[]>(() =>
  (props.existingMedia || []).map(m => ({
    key: `existing-${m.id}`,
    type: m.type,
    preview: m.type === 'image' ? getMediaUrl(m.url) : '',
    existingId: m.id,
    existingUrl: m.url,
  }))
)

const allItems = computed<MediaItem[]>(() => [...existingItems.value, ...props.modelValue])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  const newItems: MediaItem[] = []
  for (const file of Array.from(files)) {
    const isVideo = file.type === 'video/mp4'
    const item: MediaItem = {
      key: `new-${Date.now()}-${Math.random()}`,
      type: isVideo ? 'video' : 'image',
      file,
      preview: '',
    }

    if (!isVideo) {
      item.preview = URL.createObjectURL(file)
    }

    newItems.push(item)
  }

  emit('update:modelValue', [...props.modelValue, ...newItems])

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeItem = (index: number) => {
  const item = allItems.value[index]
  if (item.existingId) {
    emit('removeExisting', item.existingId)
  } else {
    const newIndex = index - existingItems.value.length
    const updated = [...props.modelValue]
    // Revoke object URL to prevent memory leak
    if (updated[newIndex]?.preview) {
      URL.revokeObjectURL(updated[newIndex].preview)
    }
    updated.splice(newIndex, 1)
    emit('update:modelValue', updated)
  }
}

const moveItem = (from: number, to: number) => {
  // Only support reordering among new items for simplicity
  const existingCount = existingItems.value.length
  if (from < existingCount || to < existingCount) return

  const newFrom = from - existingCount
  const newTo = to - existingCount
  const updated = [...props.modelValue]
  const [moved] = updated.splice(newFrom, 1)
  updated.splice(newTo, 0, moved)
  emit('update:modelValue', updated)
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: rgba(171, 255, 26, 0.4);
}

.media-thumb {
  width: 80px;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.media-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-thumb-video {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
}

.remove-btn {
  position: absolute !important;
  top: 2px;
  right: 2px;
  width: 20px !important;
  height: 20px !important;
}

.order-controls {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
