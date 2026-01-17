<template>
  <div class="image-upload-container">
    <div 
      class="upload-area"
      :class="{ 'has-image': previewUrl }"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style="display: none"
        @change="handleFileSelect"
      >
      
      <div
        v-if="!previewUrl"
        class="upload-placeholder"
      >
        <v-icon
          size="48"
          color="grey-lighten-1"
        >
          mdi-camera-plus
        </v-icon>
        <p class="text-body-2 mt-2 text-grey-lighten-1">
          {{ placeholderText }}
        </p>
      </div>

      <div
        v-else
        class="preview-container"
      >
        <img 
          :src="previewUrl" 
          :alt="altTextComputed"
          :class="{ 'circular': circular }"
        >
        <v-btn
          icon
          size="small"
          color="error"
          class="remove-btn"
          @click.stop="removeImage"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    
    <p
      v-if="helperTextComputed"
      class="text-caption text-grey mt-2"
    >
      {{ helperTextComputed }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue?: File | null;
  existingImageUrl?: string | null;
  placeholder?: string;
  helperText?: string;
  altText?: string;
  circular?: boolean;
  maxSizeMB?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  existingImageUrl: null,
  placeholder: undefined,
  helperText: undefined,
  altText: undefined,
  circular: false,
  maxSizeMB: 10,
});

const { t } = useI18n({ useScope: 'global' });

const placeholderText = computed(() => props.placeholder ?? t('imageUpload.placeholder'));
const helperTextComputed = computed(() => props.helperText ?? t('imageUpload.helper', { maxSizeMB: props.maxSizeMB }));
const altTextComputed = computed(() => props.altText ?? t('imageUpload.previewAlt'));

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(props.existingImageUrl || null);

watch(() => props.existingImageUrl, (newUrl) => {
  if (newUrl) {
    previewUrl.value = newUrl;
  }
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert(t('imageUpload.invalidType'));
    return;
  }

  const maxSize = props.maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    alert(t('imageUpload.maxSize', { maxSizeMB: props.maxSizeMB }));
    return;
  }

  const compressedFile = await compressImage(file);
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(compressedFile);

  emit('update:modelValue', compressedFile);
};

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = () => {
  previewUrl.value = null;
  emit('update:modelValue', null);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.upload-area {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
}

.upload-area:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.08);
}

.upload-area.has-image {
  border: none;
  min-height: auto;
}

.upload-placeholder {
  text-align: center;
  padding: 20px;
}

.preview-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.preview-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}

.preview-container img.circular {
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

:deep(.v-btn) {
  width: 32px !important;
  height: 32px !important;
}
</style>
