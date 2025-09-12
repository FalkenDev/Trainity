<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      title="Create Workout"
      :is-loading="isLoading"
      @close="$emit('close')"
    />
    <v-form class="px-5 d-flex flex-column ga-5">
      <v-text-field
        v-model="createWorkoutData.title"
        variant="outlined"
        label="Workout Name"
        required
        hide-details
      />
      <v-textarea
        v-model="createWorkoutData.description"
        variant="outlined"
        label="Description"
        rows="3"
        hide-details
      />
      <v-text-field
        v-model.number="createWorkoutData.time"
        variant="outlined"
        label="Time (minutes)"
        type="number"
        hide-details
      />
      <!-- TODO: Add in weight and reps-->
      <v-btn
        class="w-100"
        color="primary"
        @click="saveWorkout"
      >
        Create Workout
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { useWorkoutStore } from "@/stores/workout.store";
import { createWorkout } from "@/services/workout.service";
import { toast } from "vuetify-sonner";
import { useRouter } from "vue-router";

const isLoading = ref<boolean>(false);
const workoutStore = useWorkoutStore();
const router = useRouter();

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
      toast.success("Workout updated successfully!", { progressBar: true });
      await workoutStore.setCurrentWorkout(response.id);

      router.push(`/workout/${response.id}`);

      emit("close");
    } else {
      throw new Error("Failed to update workout");
    }
  } catch (error) {
    console.error("Error updating workout:", error);
    toast.error("Failed to update workout", { progressBar: true });
  } finally {
    isLoading.value = false;
  }
};
</script>
