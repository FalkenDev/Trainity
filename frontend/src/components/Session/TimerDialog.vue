<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
    @update:model-value="closeDialog"
  >
    <v-card class="d-flex flex-column text-center">
      <v-toolbar color="transparent">
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-toolbar>

      <v-card-text class="d-flex flex-grow-1 justify-center align-center">
        <div class="timer-container">
          <v-progress-circular
            :model-value="progressPercentage"
            :size="300"
            :width="12"
            color="primary"
            class="progress-circle"
          />

          <div class="time-text-container">
            <span class="time-text">{{ formattedTime }}</span>
          </div>
        </div>
      </v-card-text>

      <div class="pa-5 d-flex ga-4">
        <v-btn
          size="large"
          :color="isRunning ? 'orange' : 'green'"
          class="font-weight-bold flex-grow-1"
          @click="toggleTimer"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </v-btn>
        <v-btn
          size="large"
          color="grey"
          class="font-weight-bold flex-grow-1"
          @click="resetTimer"
        >
          Reset
        </v-btn>
      </div>
      <v-btn
        size="large"
        variant="outlined"
        class="mb-10 mx-5"
        @click="closeDialog"
      >
        Close Timer
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  duration: { type: Number, required: true },
});

const emit = defineEmits(['update:modelValue']);

const remainingTime = ref(props.duration);
const timerId = ref<ReturnType<typeof setInterval> | null>(null);

const isRunning = computed(() => timerId.value !== null);

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const progressPercentage = computed(() => {
  if (props.duration === 0) return 0;
  const elapsed = props.duration - remainingTime.value;
  return (elapsed / props.duration) * 100;
});

function startTimer() {
  if (isRunning.value || remainingTime.value <= 0) return;
  timerId.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      pauseTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
}

function toggleTimer() {
  isRunning.value ? pauseTimer() : startTimer();
}

function resetTimer() {
  pauseTimer();
  remainingTime.value = props.duration;
}

function closeDialog() {
  emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  (isVisible) => {
    if (isVisible) {
      resetTimer();
    } else {
      pauseTimer();
    }
  },
);
</script>

<style scoped>
.timer-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.time-text-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.time-text {
  font-size: 5rem;
  font-weight: 500;
  font-family: 'Roboto Mono', monospace;
}

.progress-circle {
  transition: all 0.2s ease-in-out;
}
</style>
