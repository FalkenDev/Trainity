<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="closeDialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card class="d-flex flex-column text-center">
      <v-toolbar color="transparent">
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-toolbar>

      <v-card-text class="d-flex flex-grow-1 justify-center align-center">
        <div class="timer-container">
          <v-progress-circular
            :model-value="progressPercentage"
            :size="300"
            :width="12"
            color="primary"
            class="progress-circle"
          ></v-progress-circular>

          <div class="time-text-container">
            <span class="time-text">{{ formattedTime }}</span>
          </div>
        </div>
      </v-card-text>

      <div class="pa-5">
        <v-btn
          block
          size="x-large"
          :color="isRunning ? 'orange' : 'green'"
          @click="toggleTimer"
          class="font-weight-bold"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </v-btn>
      </div>
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
const timerId = ref<NodeJS.Timeout | null>(null);

const isRunning = computed(() => timerId.value !== null);

// Formats time to MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// NEW: Calculates the progress for the circle (0-100)
const progressPercentage = computed(() => {
  if (props.duration === 0) return 0;
  // This calculates how much of the circle should be filled
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
/* This container holds both the circle and the text */
.timer-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* This positions the time text absolutely in the center of the container */
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
  font-family:
    'Roboto Mono', monospace; /* A monospaced font looks good for timers */
}

/* Ensure the progress circle has a smooth transition */
.progress-circle {
  transition: all 0.2s ease-in-out;
}
</style>
