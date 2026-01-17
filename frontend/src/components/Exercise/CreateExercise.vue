<template>
  <div class="d-flex flex-column fill-height bg-grey-darken-4 content-scroll">
    <BackHeader
      title="Create Exercises"
      :show-menu="false"
      @close="emit('close')"
    />
    <v-form class="mx-5">
      <ImageUpload
        v-model="imageFile"
        placeholder="Add exercise image (optional)"
        helper-text="Add a reference image for this exercise"
        class="mb-4"
      />
      
      <v-text-field
        v-model="newExercise.name"
        label="Exercise Name"
        required
        variant="outlined"
      />
      <v-textarea
        v-model="newExercise.description"
        label="Description"
        rows="2"
        variant="outlined"
      />
      <v-select
        v-model="newExercise.muscleGroupIds"
        label="Muscle Group"
        :items="muscleGroupItems"
        required
        class="mt-3"
        multiple
        item-title="name"
        item-value="id"
        variant="outlined"
        :menu-props="{ maxHeight: '200px' }"
      />
      <v-text-field
        v-model="newExercise.defaultSets"
        label="Sets"
        type="number"
        min="1"
        required
        class="mt-3"
        variant="outlined"
      />
      <v-text-field
        v-model="newExercise.defaultReps"
        label="Reps"
        type="number"
        min="1"
        required
        class="mt-3"
        variant="outlined"
      />
      <v-text-field
        v-model="newExercise.defaultPauseSeconds"
        label="Pause Seconds"
        type="number"
        min="0"
        required
        class="mt-3"
        variant="outlined"
      />
      <v-btn
        color="primary"
        class="w-100"
        :loading="isCreating"
        @click="createNewExercise"
      >
        Create Exercise
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { createExercise, uploadExerciseImage } from "@/services/exercise.service";
import type { CreateExercise } from "@/interfaces/Exercise.interface";
import { useMuscleGroupStore } from "@/stores/muscleGroup.store";
import { useExerciseStore } from "@/stores/exercise.store";
import { toast } from "vuetify-sonner";
import type { MuscleGroup } from "@/interfaces/MuscleGroup.interface";
import ImageUpload from "@/components/basicUI/ImageUpload.vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const exerciseStore = useExerciseStore();
const muscleGroupStore = useMuscleGroupStore();
const isCreating = ref(false);
const imageFile = ref<File | null>(null);

const newExercise = ref<CreateExercise>({
  name: "",
  description: "",
  muscleGroupIds: [] as number[],
  defaultSets: 1,
  defaultReps: 1,
  defaultPauseSeconds: 0,
});


const muscleGroupItems = computed(() =>
  muscleGroupStore.muscleGroups.map((group: MuscleGroup) => ({
    ...group,
    name: group.name,
    id: group.id,
  }))
);

const createNewExercise = async () => {
  isCreating.value = true;
  try {
    const response = await createExercise(newExercise.value);
    
    if (response) {
      if (imageFile.value) {
        try {
          await uploadExerciseImage(response.id, imageFile.value);
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          toast.warning("Exercise created but image upload failed", { progressBar: true, duration: 1000 });
        }
      }
      
      toast.success("Exercise created successfully!", { progressBar: true, duration: 1000 });
      
      newExercise.value = {
        name: "",
        description: "",
        muscleGroupIds: [],
        defaultSets: 1,
        defaultReps: 1,
        defaultPauseSeconds: 0,
      };
      imageFile.value = null;
      
      exerciseStore.setExercises(true);
      emit("close");
    } else {
      toast.error("Failed to create exercise.", { progressBar: true, duration: 1000 });
    }
  } catch (error) {
    console.error("Error creating exercise:", error);
    toast.error("An error occurred while creating the exercise.", { progressBar: true, duration: 1000 });
  } finally {
    isCreating.value = false;
  }
};
</script>
<style>
.content-scroll {
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
}
</style>