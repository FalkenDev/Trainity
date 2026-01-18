<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      :title="$t('workoutForm.createTitle')"
      :is-loading="isLoading"
      @close="$emit('close')"
    />
    <v-form class="px-5 d-flex flex-column ga-5">
      <v-text-field
        v-model="createWorkoutData.title"
        variant="outlined"
        :label="$t('workoutForm.nameLabel')"
        required
        hide-details
      />
      <v-textarea
        v-model="createWorkoutData.description"
        variant="outlined"
        :label="$t('common.description')"
        rows="3"
        hide-details
      />
      <v-text-field
        v-model.number="createWorkoutData.time"
        variant="outlined"
        :label="$t('workoutForm.timeMinutesLabel')"
        type="number"
        hide-details
      />
      <!-- TODO: Add in weight and reps-->
      <v-btn
        class="w-100"
        color="primary"
        @click="saveWorkout"
      >
        {{ $t('workoutForm.createButton') }}
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { useWorkoutStore } from "@/stores/workout.store";
import { createWorkout } from "@/services/workout.service";
import { toast } from "vuetify-sonner";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

const isLoading = ref<boolean>(false);
const workoutStore = useWorkoutStore();
const router = useRouter();
const { t } = useI18n({ useScope: 'global' });

const createWorkoutData = ref ({
  title: "",
  time: 0,
  description: "",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const saveWorkout = async () => {

  isLoading.value = true;
  try {
    const response = await createWorkout(createWorkoutData.value);
    if (response) {
      workoutStore.setWorkouts(true);
      toast.success(t('workout.created'), { progressBar: true, duration: 1000 });
      await workoutStore.setCurrentWorkout(response.id);

      router.push(`/workout/${response.id}`);

      emit("close");
    } else {
      throw new Error('Failed to create workout');
    }
  } catch (error) {
    console.error("Error creating workout:", error);
    toast.error(t('workout.failedToCreate'), { progressBar: true, duration: 1000 });
  } finally {
    isLoading.value = false;
  }
};
</script>
