<template>
  <div class="mx-5">
    <div class="d-flex justify-end py-3">
      <v-btn variant="text">
        {{ $t('settings.logout') }}
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
          {{ $t('settings.content') }}
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in contentList"
            :key="item.titleKey"
            class="px-0"
            :disabled="item.disabled"
            @click="setDialogToOpen(item.type)"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ $t(item.titleKey) }}</p>
              <v-icon v-if="item.showArrow">
                mdi-chevron-right
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <div>
        <h1 class="text-h6">
          {{ $t('settings.preferences') }}
        </h1>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in preferencesList"
            :key="item.titleKey"
            class="px-0"
            :disabled="item.disabled"
            @click="setPreferenceDialogToOpen(item.type)"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ $t(item.titleKey) }}</p>
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
          <span class="text-h6">{{ $t('settings.updateAvatar') }}</span>
        </v-card-title>
        <v-card-text>
          <ImageUpload
            v-model="avatarFile"
            :existing-image-url="currentUser?.avatar ? getImageUrl(currentUser.avatar) : null"
            :placeholder="$t('settings.avatarPlaceholder')"
            :helper-text="$t('settings.avatarHelper')"
            circular
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeAvatarDialog"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="isUploadingAvatar"
            :disabled="!avatarFile"
            @click="uploadAvatarImage"
          >
            {{ $t('common.upload') }}
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

    <v-dialog
      v-model="isAppearanceOpen"
      fullscreen
      transition="slide-y-transition"
      persistent
    >
      <v-card class="d-flex flex-column">
        <BackHeader
          :title="$t('settings.appearance')"
          @close="isAppearanceOpen = false"
        />

        <v-card-text class="pa-5">
          <v-switch
            v-model="useRpe"
            color="primary"
            inset
            :label="$t('settings.useRpe')"
            :loading="isSavingPreferences"
            @update:model-value="saveAppearancePreferences"
          />
          <p class="text-body-2 text-grey-lighten-1 mt-2">
            {{ $t('settings.useRpeHint') }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="isLanguageDialogOpen"
      max-width="500"
      fullscreen
    >
      <v-card>
        <BackHeader
          :title="$t('settings.language')"
          @close="isLanguageDialogOpen = false"
        />
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item
              :active="locale === 'en'"
              @click="selectLanguage('en')"
            >
              <v-list-item-title>{{ $t('settings.english') }}</v-list-item-title>
              <template #append>
                <v-icon v-if="locale === 'en'">
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
            <v-list-item
              :active="locale === 'sv'"
              @click="selectLanguage('sv')"
            >
              <v-list-item-title>{{ $t('settings.swedish') }}</v-list-item-title>
              <template #append>
                <v-icon v-if="locale === 'sv'">
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import SessionList from '@/components/Settings/SessionList.vue';
import ImageUpload from '@/components/basicUI/ImageUpload.vue';
import { getCurrentUser, updateUser, uploadAvatar } from '@/services/user.service';
import type { User } from '@/interfaces/User.interface';
import { toast } from 'vuetify-sonner';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app';

const authStore = useAuthStore();
const appStore = useAppStore();
const { t, locale } = useI18n({ useScope: 'global' });
const isExerciseListOpen = ref(false);
const isSessionListOpen = ref(false);
const isWorkoutListOpen = ref(false);
const isAvatarDialogOpen = ref(false);
const isUploadingAvatar = ref(false);
const isAppearanceOpen = ref(false);
const isLanguageDialogOpen = ref(false);
const isSavingPreferences = ref(false);
const avatarFile = ref<File | null>(null);
const currentUser = ref<User | null>(null);

const useRpe = ref(true);

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
    useRpe.value = user.showRpe ?? true;
  } catch (error) {
    console.error('Error loading user data:', error);
    toast.error(t('settings.errorLoadingUserData'), { progressBar: true, duration: 1000 });
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
    toast.success(t('settings.avatarUpdated'), { progressBar: true, duration: 1000 });
    closeAvatarDialog();
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast.error(t('settings.failedToUploadAvatar'), { progressBar: true, duration: 1000 });
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

const setPreferenceDialogToOpen = (type?: string) => {
  switch (type) {
    case 'appearance':
      isAppearanceOpen.value = true;
      break;
    case 'language':
      isLanguageDialogOpen.value = true;
      break;
    default:
      return;
  }
};

const selectLanguage = (nextLocale: 'en' | 'sv') => {
  appStore.setLocale(nextLocale);
  locale.value = nextLocale;
  isLanguageDialogOpen.value = false;
};

const saveAppearancePreferences = async () => {
  if (isSavingPreferences.value) return;
  isSavingPreferences.value = true;
  try {
    const updated = await updateUser({ showRpe: useRpe.value });
    currentUser.value = updated;
    await authStore.refreshUser();
    toast.success(t('settings.preferencesSaved'), { progressBar: true, duration: 1000 });
  } catch (error) {
    console.error('Failed saving preferences:', error);
    toast.error(t('settings.failedToSavePreferences'), { progressBar: true, duration: 1000 });
    // rollback UI to last known good value
    useRpe.value = currentUser.value?.showRpe ?? true;
  } finally {
    isSavingPreferences.value = false;
  }
};

const contentList = [
  { titleKey: 'settings.exercises', showArrow: true, type: 'exercises', disabled: false },
  { titleKey: 'settings.workouts', showArrow: true, type: 'workouts', disabled: false },
  { titleKey: 'settings.sessions', showArrow: true, type: 'sessions', disabled: false },
];
const preferencesList  = [
  { titleKey: 'settings.settings', showArrow: true, disabled: true },
  { titleKey: 'settings.account', showArrow: true, disabled: true  },
  { titleKey: 'settings.appearance', showArrow: true, disabled: false, type: 'appearance' },
  { titleKey: 'settings.units', showArrow: true, disabled: true   },
  { titleKey: 'settings.language', showArrow: true, disabled: false, type: 'language'   },
  { titleKey: 'settings.help', showArrow: true, disabled: true   }
];

onMounted(() => {
  locale.value = appStore.locale;
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