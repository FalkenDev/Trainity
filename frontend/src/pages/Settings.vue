<template>
  <div class="mx-5">
    <div class="d-flex justify-end py-3">
      <v-btn variant="text">
        Logout
      </v-btn>
    </div>
    <div class="d-flex flex-column align-center justify-center pb-5">
      <div class="avatar-wrapper">
        <v-avatar
          class="mb-4"
          size="100"
          color="primary"
          @click="openAvatarDialog"
        >
          <v-img
            v-if="currentUser?.avatar"
            :src="getImageUrl(currentUser.avatar)"
            alt="User avatar"
            cover
          />
          <v-icon
            v-else
            size="48"
          >
            mdi-account
          </v-icon>
        </v-avatar>
        <v-btn
          icon
          size="small"
          color="primary"
          class="edit-avatar-btn"
          @click="openAvatarDialog"
        >
          <v-icon size="16">
            mdi-camera
          </v-icon>
        </v-btn>
      </div>
      <h1 class="text-h5 white--text">
        {{ currentUser?.firstName || '' }} {{ currentUser?.lastName || '' }}
      </h1>
    </div>
    <div class="d-flex flex-column ga-5">
      <div>
        <h1 class="text-h6">
          Content
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in contentList"
            :key="item.title"
            class="px-0"
            :disabled="item.disabled"
            @click="setDialogToOpen(item.type)"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ item.title }}</p>
              <v-icon v-if="item.showArrow">
                mdi-chevron-right
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <div>
        <h1 class="text-h6">
          Preferences
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in preferencesList"
            :key="item.title"
            class="px-0"
            :disabled="item.disabled"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ item.title }}</p>
              <v-icon v-if="item.showArrow">
                mdi-chevron-right
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
    
    <!-- Avatar Upload Dialog -->
    <v-dialog
      v-model="isAvatarDialogOpen"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">Update Avatar</span>
        </v-card-title>
        <v-card-text>
          <ImageUpload
            v-model="avatarFile"
            :existing-image-url="currentUser?.avatar ? getImageUrl(currentUser.avatar) : null"
            placeholder="Click to upload avatar"
            helper-text="JPEG, PNG, or WebP. Recommended: 400x400px"
            circular
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeAvatarDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="isUploadingAvatar"
            :disabled="!avatarFile"
            @click="uploadAvatarImage"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="isExerciseListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <ExerciseList
        @close="isExerciseListOpen = false"
      />
    </v-dialog>
    <v-dialog
      v-model="isSessionListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <SessionList @close="isSessionListOpen = false" />
    </v-dialog>
    <v-dialog
      v-model="isWorkoutListOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <WorkoutList @close="isWorkoutListOpen = false" />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import SessionList from '@/components/Settings/SessionList.vue';
import ImageUpload from '@/components/basicUI/ImageUpload.vue';
import { getCurrentUser, uploadAvatar } from '@/services/user.service';
import type { User } from '@/interfaces/User.interface';
import { toast } from 'vuetify-sonner';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const isExerciseListOpen = ref(false);
const isSessionListOpen = ref(false);
const isWorkoutListOpen = ref(false);
const isAvatarDialogOpen = ref(false);
const isUploadingAvatar = ref(false);
const avatarFile = ref<File | null>(null);
const currentUser = ref<User | null>(null);

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Remove /v1 from API URL for static assets
  const baseUrl = apiUrl.replace('/v1', '');
  return `${baseUrl}${imagePath}`;
};

const loadUserData = async () => {
  try {
    const user = await getCurrentUser();
    currentUser.value = user;
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

const openAvatarDialog = () => {
  isAvatarDialogOpen.value = true;
};

const closeAvatarDialog = () => {
  isAvatarDialogOpen.value = false;
  avatarFile.value = null;
};

const uploadAvatarImage = async () => {
  if (!avatarFile.value) return;

  isUploadingAvatar.value = true;
  try {
    const updatedUser = await uploadAvatar(avatarFile.value) as User;
    currentUser.value = updatedUser;

    await authStore.refreshUser();
    toast.success('Avatar updated successfully!');
    closeAvatarDialog();
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast.error('Failed to upload avatar');
  } finally {
    isUploadingAvatar.value = false;
  }
};

const setDialogToOpen = (type: string) => {
  switch (type) {
    case 'exercises':
      isExerciseListOpen.value = true;
      break;
    case 'workouts':
      isWorkoutListOpen.value = true;
      break;
    case 'sessions':
      isSessionListOpen.value = true;
      break;
    default:
      return
  }
};

const contentList = [
  { title: 'Exercises', showArrow: true, type: 'exercises', disabled: false },
  { title: 'Workouts', showArrow: true, type: 'workouts', disabled: false },
  { title: 'Sessions', showArrow: true, type: 'sessions', disabled: false },
];
const preferencesList  = [
  { title: 'Settings', showArrow: true, disabled: true },
  { title: 'Account', showArrow: true, disabled: true  },
  { title: 'Appearance', showArrow: true, disabled: true   },
  { title: 'Units', showArrow: true, disabled: true   },
  { title: 'Language', showArrow: true, disabled: true   },
  { title: 'Help', showArrow: true, disabled: true   }
];

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 12px;
  right: -4px;
}
</style>