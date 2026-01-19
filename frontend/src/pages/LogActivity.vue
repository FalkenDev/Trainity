<template>
  <div>
    <BackHeader :title="$t('activity.logActivity')" />
    <div class="px-5 py-4">
      <v-form
        ref="formRef"
        @submit.prevent="handleSubmit"
      >
        <!-- Activity Selection -->
        <v-select
          v-model="formData.activityId"
          :items="activityItems"
          :label="$t('activity.selectActivity')"
          :rules="[rules.required]"
          item-title="name"
          item-value="id"
          variant="outlined"
          class="mb-4"
        />

        <!-- Date Picker -->
        <v-text-field
          v-model="formData.date"
          :label="$t('activity.date')"
          :rules="[rules.required]"
          type="date"
          variant="outlined"
          class="mb-4"
        />

        <!-- Duration (required) -->
        <v-text-field
          v-model.number="formData.duration"
          :label="$t('activity.duration')"
          :rules="[rules.required, rules.positive]"
          type="number"
          suffix="min"
          variant="outlined"
          class="mb-4"
        />

        <!-- Conditional fields based on selected activity -->
        <template v-if="selectedActivity">
          <!-- Distance -->
          <v-text-field
            v-if="selectedActivity.trackDistance"
            v-model.number="formData.distance"
            :label="$t('activity.distance')"
            type="number"
            step="0.1"
            suffix="km"
            variant="outlined"
            class="mb-4"
          />

          <!-- Calculated Pace (read-only) -->
          <v-text-field
            v-if="selectedActivity.trackPace && calculatedPace"
            :model-value="calculatedPace"
            :label="$t('activity.pace')"
            readonly
            suffix="/km"
            variant="outlined"
            class="mb-4"
          />

          <!-- Elevation Gain -->
          <v-text-field
            v-if="selectedActivity.trackElevation"
            v-model.number="formData.elevationGain"
            :label="$t('activity.elevationGain')"
            type="number"
            suffix="m"
            variant="outlined"
            class="mb-4"
          />

          <!-- Max Elevation -->
          <v-text-field
            v-if="selectedActivity.trackElevation"
            v-model.number="formData.maxElevation"
            :label="$t('activity.maxElevation')"
            type="number"
            suffix="m"
            variant="outlined"
            class="mb-4"
          />

          <!-- Calories -->
          <v-text-field
            v-if="selectedActivity.trackCalories"
            v-model.number="formData.calories"
            :label="$t('activity.calories')"
            type="number"
            suffix="kcal"
            variant="outlined"
            class="mb-4"
          />
        </template>

        <!-- Notes -->
        <v-textarea
          v-model="formData.notes"
          :label="$t('activity.notes')"
          variant="outlined"
          rows="3"
          class="mb-4"
        />

        <!-- Submit Button -->
        <v-btn
          :loading="isSubmitting"
          type="submit"
          size="large"
          color="primary"
          block
        >
          {{ $t('activity.save') }}
        </v-btn>
      </v-form>

      <!-- Manage Activities Link -->
      <v-btn
        variant="text"
        color="secondary"
        class="mt-4"
        block
        @click="$router.push('/settings?tab=activities')"
      >
        {{ $t('activity.manageActivities') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useActivityStore } from '@/stores/activity.store';
import { createActivityLog } from '@/services/activityLog.service';
import type { CreateActivityLogDto } from '@/interfaces/Activity.interface';

const router = useRouter();
const activityStore = useActivityStore();
const formRef = ref();

const formData = ref<CreateActivityLogDto>({
  activityId: null as unknown as number,
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  duration: null as unknown as number,
  distance: undefined,
  elevationGain: undefined,
  maxElevation: undefined,
  calories: undefined,
  notes: undefined,
});

const isSubmitting = ref(false);

const rules = {
  required: (v: string | number | null) => !!v || 'This field is required',
  positive: (v: number) => v > 0 || 'Must be greater than 0',
};

const activityItems = computed(() => activityStore.activities);

const selectedActivity = computed(() => {
  return activityStore.activities.find((a) => a.id === formData.value.activityId);
});

// Calculate pace from duration and distance
const calculatedPace = computed(() => {
  if (!formData.value.duration || !formData.value.distance) {
    return null;
  }
  const paceMinutes = formData.value.duration / formData.value.distance;
  const minutes = Math.floor(paceMinutes);
  const seconds = Math.round((paceMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Reset conditional fields when activity changes
watch(
  () => formData.value.activityId,
  () => {
    if (selectedActivity.value) {
      if (!selectedActivity.value.trackDistance) {
        formData.value.distance = undefined;
      }
      if (!selectedActivity.value.trackElevation) {
        formData.value.elevationGain = undefined;
        formData.value.maxElevation = undefined;
      }
      if (!selectedActivity.value.trackCalories) {
        formData.value.calories = undefined;
      }
    }
  },
);

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSubmitting.value = true;
  try {
    await createActivityLog(formData.value);
    await activityStore.fetchActivityLogs(true);
    router.push('/');
  } catch (error) {
    console.error('Error creating activity log:', error);
    alert('Failed to create activity log');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
