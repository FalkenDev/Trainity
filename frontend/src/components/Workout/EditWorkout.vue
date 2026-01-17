<template>
  <div class="h-100 w-100 bg-grey-darken-4">
    <BackHeader
      title="Edit Workout"
      show-menu
      :is-loading="isLoading"
      @close="$emit('close')"
    />
    <v-form class="px-5 d-flex flex-column ga-5">
      <v-text-field
        v-model="editWorkout.name"
        variant="outlined"
        label="Workout Name"
        required
        hide-details
      />
      <v-textarea
        v-model="editWorkout.description"
        variant="outlined"
        label="Description"
        rows="3"
        hide-details
      />
      <v-text-field
        v-model.number="editWorkout.time"
        variant="outlined"
        label="Time (minutes)"
        type="number"
        hide-details
      />
      <v-btn
        class="w-100"
        color="primary"
        @click="saveWorkout"
      >
        Save Workout
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { useWorkoutStore } from "@/stores/workout.store";
import { updateWorkout } from "@/services/workout.service";
import { toast } from "vuetify-sonner";

const isLoading = ref<boolean>(false);

const workoutStore = useWorkoutStore();

const selectedWorkout = computed(() => {
  return workoutStore.currentWorkout;
});

const editWorkout = {
  name: selectedWorkout.value?.title || "",
  description: selectedWorkout.value?.description || "",
  time: selectedWorkout.value?.time || 0,
};

const emit = defineEmits<{
  (e: "close"): void;
}>();

const saveWorkout = async () => {
  if (!selectedWorkout.value) return;

  isLoading.value = true;
  try {
    const response = await updateWorkout(selectedWorkout.value.id, {
      title: editWorkout.name,
      description: editWorkout.description,
      time: editWorkout.time,
      defaultWeightAndReps: selectedWorkout.value?.defaultWeightAndReps ?? "default",
    });
    if (response) {
      workoutStore.setWorkouts(true);
      toast.success("Workout updated successfully!", { progressBar: true, duration: 1000 });
      emit("close");
    } else {
      throw new Error("Failed to update workout");
    }
  } catch (error) {
    console.error("Error updating workout:", error);
    toast.error("Failed to update workout", { progressBar: true, duration: 1000 });
  } finally {
    isLoading.value = false;
  }
};
</script>
