<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card
      v-if="editableSet"
      class="d-flex flex-column"
    >
      <v-toolbar color="primary">
        <v-toolbar-title>{{ $t('session.editSetTitle', { set: editableSet.set }) }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="text"
          @click="onSave"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-5">
        <p class="text-grey-lighten-1 mb-2">
          {{ $t('session.weightLabel') }}
        </p>
        <v-text-field
          v-model.number="editableSet.weight"
          type="number"
          variant="solo-filled"
          flat
          :suffix="$t('units.kgShort')"
          class="mb-4"
          autofocus
          single-line
        />

        <p class="text-grey-lighten-1 mb-2">
          {{ $t('session.repetitionsLabel') }}
        </p>
        <v-text-field
          v-model.number="editableSet.reps"
          type="number"
          variant="solo-filled"
          flat
          :suffix="$t('units.repsShort')"
          single-line
        />
      </v-card-text>

      <v-spacer />

      <div class="pa-4">
        <v-btn
          block
          size="large"
          color="red"
          variant="outlined"
          @click="onDelete"
        >
          {{ $t('session.deleteSet') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';

// Define the structure for a workout set
interface WorkoutSet {
  set: number;
  previous: string;
  weight: number;
  reps: number;
  done: boolean;
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  set: {
    type: Object as PropType<WorkoutSet | null>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'save', 'delete']);

const editableSet = ref<WorkoutSet | null>(null);

watch(
  () => props.set,
  (newSet) => {
    editableSet.value = newSet ? JSON.parse(JSON.stringify(newSet)) : null;
  },
  { immediate: true },
);

function onSave() {
  if (editableSet.value) {
    emit('save', editableSet.value);
  }
  emit('update:modelValue', false);
}

function onDelete() {
  emit('delete');
  emit('update:modelValue', false);
}
</script>
