<template>
  <div class="mx-5 mb-5">
    <v-card
      class="d-flex flex-column align-center justify-center py-5 my-5 rounded-lg"
      color="cardBg"
      :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
    >
      <div class="avatar-wrapper">
        <v-avatar class="mb-4" size="100" color="primary" @click="openAccountDialog">
          <v-img
            v-if="currentUser?.avatar"
            :src="getImageUrl(currentUser.avatar)"
            alt="User avatar"
            cover
          />
          <v-icon v-else size="48"> mdi-account </v-icon>
        </v-avatar>
        <v-btn icon size="small" color="primary" class="edit-avatar-btn" @click="openAccountDialog">
          <v-icon size="16"> mdi-camera </v-icon>
        </v-btn>
      </div>
      <div class="mb-2 text-center">
        <h1 class="text-h5 white--text">
          {{ currentUser?.firstName || '' }} {{ currentUser?.lastName || '' }}
        </h1>
        <p class="text-textSecondary text-subtitle-1">Member since Jan 2024</p>
      </div>
    </v-card>
    <div class="d-flex flex-column ga-5">
      <div>
        <h1 class="text-h6 mb-3">
          {{ $t('settings.content') }}
        </h1>
        <v-card
          v-for="item in contentList"
          :key="item.titleKey"
          class="mb-4 d-flex flex-row justify-space-between align-center pa-4 rounded-lg"
          color="cardBg"
          :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
          :disabled="item.disabled"
          @click="setDialogToOpen(item.type)"
        >
          <div class="d-flex align-center ga-2">
            <v-avatar color="avatarBg" size="40">
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-avatar>
            <p>{{ $t(item.titleKey) }}</p>
          </div>
          <v-icon v-if="item.showArrow"> mdi-chevron-right </v-icon>
        </v-card>
      </div>
      <div>
        <h1 class="text-h6 mb-3">Data</h1>
        <v-card
          v-for="item in dataList"
          :key="item.titleKey"
          class="mb-4 d-flex flex-row justify-space-between align-center pa-4 rounded-lg"
          color="cardBg"
          :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
          :disabled="item.disabled"
          @click="setDialogToOpen(item.type)"
        >
          <div class="d-flex align-center ga-2">
            <v-avatar color="avatarBg" size="40">
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-avatar>
            <p>{{ $t(item.titleKey) }}</p>
          </div>
          <v-icon v-if="item.showArrow"> mdi-chevron-right </v-icon>
        </v-card>
      </div>
      <div>
        <h1 class="text-h6 mb-3">Preferences</h1>
        <v-list
          class="bg-cardBg rounded-lg"
          :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
        >
          <v-list-item
            v-for="item in preferencesList"
            :key="item.titleKey"
            class="px-5"
            :class="{ 'border-b': item !== preferencesList[preferencesList.length - 1] }"
            :disabled="item.disabled"
            @click="setPreferenceDialogToOpen(item.type)"
          >
            <v-list-item-title class="d-flex flex-row justify-space-between align-center">
              <p>{{ $t(item.titleKey) }}</p>
              <v-icon v-if="item.showArrow"> mdi-chevron-right </v-icon>
              <v-switch
                v-if="item.type === 'darkMode'"
                v-model="isDarkMode"
                color="primary"
                class="d-flex align-center pr-2"
                @update:model-value="toggleDarkMode"
                @click.stop
              />
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <!-- Account Edit Dialog -->
    <v-dialog v-model="isAccountDialogOpen" fullscreen transition="slide-y-transition" persistent>
      <AccountDialog
        :user="currentUser"
        @close="isAccountDialogOpen = false"
        @updated="onUserUpdated"
      />
    </v-dialog>

    <v-dialog v-model="isExerciseListOpen" fullscreen transition="slide-y-transition" persistent>
      <ExerciseList @close="isExerciseListOpen = false" />
    </v-dialog>
    <v-dialog v-model="isActivityListOpen" fullscreen transition="slide-y-transition" persistent>
      <ActivityList @close="isActivityListOpen = false" />
    </v-dialog>
    <v-dialog v-model="isSessionListOpen" fullscreen transition="slide-y-transition" persistent>
      <SessionList @close="isSessionListOpen = false" />
    </v-dialog>
    <v-dialog v-model="isWorkoutListOpen" fullscreen transition="slide-y-transition" persistent>
      <WorkoutList @close="isWorkoutListOpen = false" />
    </v-dialog>

    <v-dialog v-model="isAppearanceOpen" fullscreen transition="slide-y-transition" persistent>
      <AppearanceDialog
        :user="currentUser"
        @close="isAppearanceOpen = false"
        @updated="onUserUpdated"
      />
    </v-dialog>

    <v-dialog v-model="isLanguageDialogOpen" max-width="500" fullscreen>
      <LanguageDialog @close="isLanguageDialogOpen = false" />
    </v-dialog>

    <!-- Goals Dialog -->
    <v-dialog v-model="isGoalsDialogOpen" fullscreen transition="slide-y-transition" persistent>
      <GoalsDialog
        :user="currentUser"
        :weight-tracking-enabled="weightTrackingEnabled"
        @close="isGoalsDialogOpen = false"
        @updated="onUserUpdated"
      />
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentUser, getStreakInfo } from '@/services/user.service'
import type { User, StreakInfo } from '@/interfaces/User.interface'
import { toast } from 'vuetify-sonner'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useTheme } from 'vuetify'

const authStore = useAuthStore()
const appStore = useAppStore()
const { t, locale } = useI18n({ useScope: 'global' })
const theme = useTheme()

const isDarkMode = ref(appStore.darkMode)

const toggleDarkMode = (value: boolean | null) => {
  const isDark = value ?? true
  isDarkMode.value = isDark
  appStore.setDarkMode(isDark)
  theme.global.name.value = isDark ? 'dark' : 'light'
}

const isExerciseListOpen = ref(false)
const isActivityListOpen = ref(false)
const isSessionListOpen = ref(false)
const isWorkoutListOpen = ref(false)
const isAccountDialogOpen = ref(false)
const isAppearanceOpen = ref(false)
const isLanguageDialogOpen = ref(false)
const isGoalsDialogOpen = ref(false)
const currentUser = ref<User | null>(null)
const weightTrackingEnabled = ref(false)
const streakInfo = ref<StreakInfo | null>(null)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${imagePath}`
}

const onUserUpdated = (user: User) => {
  currentUser.value = user
  weightTrackingEnabled.value = user.showWeightTracking ?? false
}

const loadUserData = async () => {
  try {
    const user = await getCurrentUser()
    currentUser.value = user
    weightTrackingEnabled.value = user.showWeightTracking ?? false
  } catch (error) {
    console.error('Error loading user data:', error)
    toast.error(t('settings.errorLoadingUserData'), { progressBar: true, duration: 1000 })
  }
}

const openAccountDialog = () => {
  isAccountDialogOpen.value = true
}

const setDialogToOpen = (type: string) => {
  switch (type) {
    case 'exercises':
      isExerciseListOpen.value = true
      break
    case 'activities':
      isActivityListOpen.value = true
      break
    case 'workouts':
      isWorkoutListOpen.value = true
      break
    case 'sessions':
      isSessionListOpen.value = true
      break
    default:
      return
  }
}

const setPreferenceDialogToOpen = async (type?: string) => {
  switch (type) {
    case 'account':
      openAccountDialog()
      break
    case 'appearance':
      isAppearanceOpen.value = true
      break
    case 'goals':
      isGoalsDialogOpen.value = true
      break
    case 'language':
      isLanguageDialogOpen.value = true
      break
    case 'logout':
      await authStore.logout()
      break
    default:
      return
  }
}

const contentList = [
  {
    titleKey: 'settings.exercises',
    showArrow: true,
    type: 'exercises',
    disabled: false,
    icon: 'mdi-dumbbell',
  },
  {
    titleKey: 'settings.workouts',
    showArrow: true,
    type: 'workouts',
    disabled: false,
    icon: 'mdi-calendar-check',
  },
  {
    titleKey: 'settings.activities',
    showArrow: true,
    type: 'activities',
    disabled: false,
    icon: 'mdi-run',
  },
]
const dataList = [
  {
    titleKey: 'settings.sessions',
    showArrow: true,
    type: 'sessions',
    disabled: false,
    icon: 'mdi-timer',
  },
  {
    titleKey: 'settings.weightAndProgression',
    showArrow: false,
    type: 'weightAndProgression',
    disabled: true,
    icon: 'mdi-scale-balance',
  },
  {
    titleKey: 'settings.achievements',
    showArrow: false,
    type: 'achievements',
    disabled: true,
    icon: 'mdi-trophy',
  },
]
const preferencesList = [
  { titleKey: 'settings.userInformation', showArrow: true, disabled: false, type: 'account' },
  { titleKey: 'settings.appearance', showArrow: true, disabled: false, type: 'appearance' },
  { titleKey: 'settings.goals', showArrow: true, disabled: false, type: 'goals' },
  { titleKey: 'settings.darkMode', showArrow: false, disabled: false, type: 'darkMode' },
  { titleKey: 'settings.language', showArrow: true, disabled: false, type: 'language' },
  { titleKey: 'settings.helpAndSupport', showArrow: true, disabled: true },
  { titleKey: 'settings.logout', showArrow: false, disabled: false, type: 'logout' },
]

onMounted(() => {
  locale.value = appStore.locale
  loadUserData()
  getStreakInfo()
    .then(info => {
      streakInfo.value = info
    })
    .catch(() => {})
})
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
  height: 32px !important;
  width: 32px !important;
}
</style>
