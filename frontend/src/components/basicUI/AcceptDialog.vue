<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="onDialogUpdate"
    @close="emit('update:modelValue', false)"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <p>{{ description }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          @click="handleCancel"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          @click="handleAccept"
        >
          {{ $t('common.accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
  title: string;
  description: string;
}>();

const emit = defineEmits<{
  (e: "accept"): void;
  (e: "cancel"): void;
  (e: "update:modelValue", value: boolean): void;
}>();

function onDialogUpdate(newValue: boolean) {
  emit("update:modelValue", newValue);
}

function handleAccept() {
  emit("accept");
  emit("update:modelValue", false);
}

function handleCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}
</script>
