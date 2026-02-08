<template>
  <div class="mx-5">
    <v-card
      class="d-flex flex-column align-center justify-center py-5 my-5 rounded-lg"
      color="cardBg"
      style="border: 1px solid #474747"
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

      <div class="d-flex align-center w-100">
        <div class="d-flex flex-column align-center flex-1-0-0 min-w-0">
          <h1 class="text-h6">47</h1>
          <p class="text-subtitle-2 text-textSecondary text-center">Workouts</p>
        </div>

        <v-divider vertical class="flex-grow-0" color="textSecondary" :thickness="2" />

        <div class="d-flex flex-column align-center flex-1-0-0 min-w-0">
          <h1 class="text-h6">47</h1>
          <p class="text-subtitle-2 text-textSecondary text-center">Day streak</p>
        </div>

        <v-divider vertical class="flex-grow-0" color="textSecondary" :thickness="2" />

        <div class="d-flex flex-column align-center flex-1-0-0 min-w-0">
          <h1 class="text-h6">47</h1>
          <p class="text-subtitle-2 text-textSecondary text-center">Achievements</p>
        </div>
      </div>
    </v-card>
    <div class="d-flex flex-column ga-5">
      <div>
        <h1 class="text-h6">
          {{ $t('settings.content') }}
        </h1>
        <v-card
          v-for="item in contentList"
          :key="item.titleKey"
          class="mb-4 d-flex flex-row justify-space-between align-center pa-4 rounded-lg"
          color="cardBg"
          style="border: 1px solid #474747"
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
              <v-icon v-if="item.showArrow"> mdi-chevron-right </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <!-- Account Edit Dialog -->
    <v-dialog v-model="isAccountDialogOpen" fullscreen transition="slide-y-transition" persistent>
      <v-card class="d-flex flex-column">
        <BackHeader :title="$t('settings.editAccount')" @close="closeAccountDialog" />

        <v-card-text class="pa-5 flex-grow-1 overflow-y-auto">
          <v-form ref="accountForm" @submit.prevent="saveAccount">
            <div class="mb-6">
              <p class="text-subtitle-1 mb-3">
                {{ $t('settings.profilePhoto') }}
              </p>
              <ImageUpload
                v-model="avatarFile"
                :existing-image-url="currentUser?.avatar ? getImageUrl(currentUser.avatar) : null"
                :placeholder="$t('settings.avatarPlaceholder')"
                :helper-text="$t('settings.avatarHelper')"
                circular
              />
            </div>

            <div class="mb-6">
              <p class="text-subtitle-1 mb-3">
                {{ $t('settings.profileDetails') }}
              </p>
              <v-text-field
                v-model="fullName"
                autocomplete="name"
                class="mb-4"
                :label="$t('settings.fullName')"
                prepend-inner-icon="mdi-account-outline"
                required
                :rules="nameRules"
                variant="outlined"
              />

              <v-text-field
                v-model="email"
                autocomplete="email"
                class="mb-2"
                :label="$t('settings.email')"
                prepend-inner-icon="mdi-email-outline"
                required
                :rules="emailRules"
                type="email"
                variant="outlined"
              />
            </div>

            <div class="mb-6">
              <p class="text-subtitle-1 mb-3">
                {{ $t('weightLog.startWeight') }}
              </p>
              <v-text-field
                v-model.number="editStartWeight"
                :label="$t('weightLog.startWeight')"
                :suffix="wtWeightUnit"
                type="number"
                step="0.1"
                variant="outlined"
              />
            </div>

            <div>
              <p class="text-subtitle-1 mb-3">
                {{ $t('settings.changePassword') }}
              </p>
              <p class="text-body-2 text-grey-lighten-1 mt-n2 mb-4">
                {{ $t('settings.changePasswordHint') }}
              </p>

              <v-text-field
                v-model="currentPassword"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4"
                :label="$t('settings.currentPassword')"
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
              />

              <v-text-field
                v-model="newPassword"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4"
                :label="$t('settings.newPassword')"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-outline"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="newPasswordRules"
                @click:append-inner="showNewPassword = !showNewPassword"
              />

              <v-text-field
                v-model="confirmNewPassword"
                :append-inner-icon="showConfirmNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-2"
                :label="$t('settings.confirmNewPassword')"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="confirmNewPasswordRules"
                @click:append-inner="showConfirmNewPassword = !showConfirmNewPassword"
              />
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5">
          <v-btn variant="text" :disabled="isSavingAccount" @click="closeAccountDialog">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn color="primary" :loading="isSavingAccount" @click="saveAccount">
            {{ $t('common.saveChanges') }}
          </v-btn>
        </v-card-actions>
      </v-card>
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
      <v-card class="d-flex flex-column">
        <BackHeader :title="$t('settings.appearance')" @close="isAppearanceOpen = false" />

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

          <v-divider class="my-4" />

          <v-switch
            v-model="weightTrackingEnabled"
            color="primary"
            inset
            :label="$t('weightLog.enableTracking')"
            :loading="isSavingPreferences"
            @update:model-value="saveAppearancePreferences"
          />
          <p class="text-body-2 text-grey-lighten-1 mt-2">
            {{ $t('weightLog.enableTrackingHint') }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isLanguageDialogOpen" max-width="500" fullscreen>
      <v-card>
        <BackHeader :title="$t('settings.language')" @close="isLanguageDialogOpen = false" />
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item :active="locale === 'en'" @click="selectLanguage('en')">
              <v-list-item-title>{{ $t('settings.english') }}</v-list-item-title>
              <template #append>
                <v-icon v-if="locale === 'en'"> mdi-check </v-icon>
              </template>
            </v-list-item>
            <v-list-item :active="locale === 'sv'" @click="selectLanguage('sv')">
              <v-list-item-title>{{ $t('settings.swedish') }}</v-list-item-title>
              <template #append>
                <v-icon v-if="locale === 'sv'"> mdi-check </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Goals Dialog -->
    <v-dialog v-model="isGoalsDialogOpen" fullscreen transition="slide-y-transition" persistent>
      <v-card class="d-flex flex-column">
        <BackHeader :title="$t('settings.goals')" @close="isGoalsDialogOpen = false" />

        <v-card-text class="pa-5 flex-grow-1 overflow-y-auto">
          <h2 class="text-h6 mb-2">
            {{ $t('settings.weeklyWorkoutGoal') }}
          </h2>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            {{ $t('settings.weeklyWorkoutGoalDescription') }}
          </p>

          <div class="mb-6">
            <v-slider
              v-model="weeklyGoal"
              :min="1"
              :max="7"
              :step="1"
              thumb-label
              color="primary"
              :disabled="isSavingGoal"
            >
              <template #append>
                <v-text-field
                  v-model="weeklyGoal"
                  :disabled="isSavingGoal"
                  type="number"
                  :min="1"
                  :max="7"
                  style="width: 80px"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </template>
            </v-slider>
            <p class="text-body-2 text-grey-lighten-1 mt-2">
              {{ $t('settings.workoutsPerWeek', { count: weeklyGoal }) }}
            </p>
          </div>

          <v-btn color="primary" block :loading="isSavingGoal" @click="saveWeeklyGoal">
            {{ $t('common.saveChanges') }}
          </v-btn>

          <v-divider class="my-6" />

          <h2 class="text-h6 mb-2">
            {{ $t('settings.yourProgress') }}
          </h2>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            {{ $t('settings.currentStreak') }}:
            <strong>{{ streakInfo?.currentStreak || 0 }} {{ $t('settings.weeks') }}</strong>
          </p>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            {{ $t('settings.thisWeekProgress') }}: {{ streakInfo?.currentWeekWorkouts || 0 }} /
            {{ streakInfo?.weeklyWorkoutGoal || 3 }} {{ $t('settings.workouts') }}
          </p>

          <v-progress-linear
            :model-value="streakInfo?.progressPercentage || 0"
            color="success"
            height="20"
            rounded
          >
            <template #default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>

          <v-alert
            v-if="(streakInfo?.currentWeekWorkouts || 0) >= (streakInfo?.weeklyWorkoutGoal || 3)"
            type="success"
            variant="tonal"
            class="mt-4"
          >
            {{ $t('settings.goalReachedThisWeek') }}
          </v-alert>

          <template v-if="weightTrackingEnabled">
            <v-divider class="my-6" />

            <h2 class="text-h6 mb-2">{{ $t('weightLog.goalType') }}</h2>
            <p class="text-body-2 text-grey-lighten-1 mb-4">
              {{ $t('weightLog.goalTypeHint') }}
            </p>
            <v-select
              v-model="weightGoalType"
              :items="goalTypeItems"
              :label="$t('weightLog.goalType')"
              variant="outlined"
              clearable
              class="mb-4"
            />

            <v-text-field
              v-model.number="targetWeight"
              :label="$t('weightLog.targetWeight')"
              :suffix="wtWeightUnit"
              type="number"
              step="0.1"
              variant="outlined"
              class="mb-4"
            />

            <v-divider class="mb-6" />

            <h2 class="text-h6 mb-2">{{ $t('weightLog.editWeightTitle') }}</h2>
            <p class="text-body-2 text-grey-lighten-1 mb-4">
              {{ $t('weightLog.editWeightHint') }}
            </p>
            <v-text-field
              v-model.number="editWeight"
              :label="$t('weightLog.currentWeight')"
              :suffix="wtWeightUnit"
              type="number"
              step="0.1"
              variant="outlined"
              class="mb-4"
            />

            <v-btn color="primary" block :loading="isSavingWeightGoals" @click="saveWeightGoals">
              {{ $t('common.saveChanges') }}
            </v-btn>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import SessionList from '@/components/Settings/SessionList.vue'
import ImageUpload from '@/components/basicUI/ImageUpload.vue'
import {
  getCurrentUser,
  updateUser,
  uploadAvatar,
  getStreakInfo,
  updateWeeklyWorkoutGoal,
} from '@/services/user.service'
import type { User, StreakInfo } from '@/interfaces/User.interface'
import { toast } from 'vuetify-sonner'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import type { VForm } from 'vuetify/components'

const authStore = useAuthStore()
const appStore = useAppStore()
const { t, locale } = useI18n({ useScope: 'global' })
const isExerciseListOpen = ref(false)
const isActivityListOpen = ref(false)
const isSessionListOpen = ref(false)
const isWorkoutListOpen = ref(false)
const isAccountDialogOpen = ref(false)
const isSavingAccount = ref(false)
const isAppearanceOpen = ref(false)
const isLanguageDialogOpen = ref(false)
const isGoalsDialogOpen = ref(false)
const isSavingPreferences = ref(false)
const isSavingGoal = ref(false)
const avatarFile = ref<File | null>(null)
const currentUser = ref<User | null>(null)
const weeklyGoal = ref(3)
const streakInfo = ref<StreakInfo | null>(null)

const accountForm = ref<VForm | null>(null)
const fullName = ref('')
const email = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)

const useRpe = ref(true)

// Weight tracking
const isSavingWeightGoals = ref(false)
const weightTrackingEnabled = ref(false)
const weightGoalType = ref<string | null>(null)
const targetWeight = ref<number | null>(null)
const editWeight = ref<number | null>(null)
const editStartWeight = ref<number | null>(null)

const isImperial = computed(() => currentUser.value?.unitScale === 'imperial')
const wtWeightUnit = computed(() => (isImperial.value ? 'lbs' : 'kg'))
const toKg = (val: number) => (isImperial.value ? val / 2.20462 : val)
const fromKg = (val: number | undefined | null) => {
  if (val === undefined || val === null) return null
  return isImperial.value ? Number((val * 2.20462).toFixed(1)) : Number(Number(val).toFixed(1))
}

const goalTypeItems = computed(() => [
  { title: t('weightLog.goalLose'), value: 'lose' },
  { title: t('weightLog.goalGain'), value: 'gain' },
  { title: t('weightLog.goalMaintain'), value: 'maintain' },
])

const openGoalsDialog = () => {
  const user = currentUser.value
  weightGoalType.value = user?.weightGoalType ?? null
  targetWeight.value = fromKg(user?.targetWeight)
  editWeight.value = fromKg(user?.weight)
  isGoalsDialogOpen.value = true
}

const saveWeightGoals = async () => {
  if (isSavingWeightGoals.value) return
  isSavingWeightGoals.value = true
  try {
    const payload: Record<string, unknown> = {}
    if (weightGoalType.value) payload.weightGoalType = weightGoalType.value
    if (targetWeight.value && targetWeight.value > 0) {
      payload.targetWeight = Number(toKg(targetWeight.value).toFixed(2))
    }
    if (editWeight.value && editWeight.value > 0) {
      payload.weight = Number(toKg(editWeight.value).toFixed(2))
    }
    const updated = await updateUser(payload as Partial<User>)
    currentUser.value = updated
    await authStore.refreshUser()
    toast.success(t('settings.goalUpdated'), { progressBar: true, duration: 1000 })
  } catch (error) {
    console.error('Failed saving weight goals:', error)
    toast.error(t('settings.failedToUpdateGoal'), { progressBar: true, duration: 1000 })
  } finally {
    isSavingWeightGoals.value = false
  }
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // Remove /v1 from API URL for static assets
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${imagePath}`
}

const loadUserData = async () => {
  try {
    const user = await getCurrentUser()
    currentUser.value = user
    useRpe.value = user.showRpe ?? true
    weeklyGoal.value = user.weeklyWorkoutGoal ?? 3
    weightTrackingEnabled.value = user.showWeightTracking ?? false

    // Load streak info
    const streak = await getStreakInfo()
    streakInfo.value = streak
  } catch (error) {
    console.error('Error loading user data:', error)
    toast.error(t('settings.errorLoadingUserData'), { progressBar: true, duration: 1000 })
  }
}

const nameRules = [(v: string) => !!v?.trim() || t('auth.fullNameRequired')]
const emailRules = [
  (v: string) => !!v || t('auth.emailRequired'),
  (v: string) => /.+@.+\..+/.test(v) || t('auth.emailValid'),
]
const newPasswordRules = computed(() => [
  (v: string) => !v || v.length >= 8 || t('auth.passwordMinLength'),
])
const confirmNewPasswordRules = computed(() => [
  (v: string) =>
    !newPassword.value || (!!v && v === newPassword.value) || t('auth.passwordsDoNotMatch'),
])

const openAccountDialog = () => {
  const user = currentUser.value
  fullName.value = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  email.value = user?.email || ''
  editStartWeight.value = fromKg(user?.startWeight)
  avatarFile.value = null
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
  isAccountDialogOpen.value = true
}

const closeAccountDialog = () => {
  isAccountDialogOpen.value = false
  avatarFile.value = null
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

const splitFullName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || ''
  const lastName = parts.join(' ')
  return { firstName, lastName }
}

const saveAccount = async () => {
  if (isSavingAccount.value) return
  if (!accountForm.value) return

  const { valid } = await accountForm.value.validate()
  if (!valid) return

  if (newPassword.value && newPassword.value !== confirmNewPassword.value) {
    toast.error(t('auth.passwordsDoNotMatchAlert'), { progressBar: true, duration: 1000 })
    return
  }

  if (newPassword.value && !currentPassword.value) {
    toast.error(t('settings.currentPasswordRequired'), { progressBar: true, duration: 1000 })
    return
  }

  isSavingAccount.value = true
  try {
    let updatedUser: User | null = null

    if (avatarFile.value) {
      updatedUser = (await uploadAvatar(avatarFile.value)) as User
      currentUser.value = updatedUser
    }

    const { firstName, lastName } = splitFullName(fullName.value)
    const payload: Record<string, unknown> = {
      firstName,
      lastName,
      email: email.value,
    }

    if (editStartWeight.value && editStartWeight.value > 0) {
      payload.startWeight = Number(toKg(editStartWeight.value).toFixed(2))
    }

    if (newPassword.value) {
      payload.currentPassword = currentPassword.value
      payload.newPassword = newPassword.value
    }

    updatedUser = (await updateUser(payload as Partial<User>)) as User
    currentUser.value = updatedUser
    await authStore.refreshUser()

    toast.success(t('settings.accountUpdated'), { progressBar: true, duration: 1000 })
    closeAccountDialog()
  } catch (error) {
    console.error('Error saving account:', error)
    toast.error(t('settings.failedToUpdateAccount'), { progressBar: true, duration: 1000 })
  } finally {
    isSavingAccount.value = false
  }
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
      openGoalsDialog()
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

const selectLanguage = (nextLocale: 'en' | 'sv') => {
  appStore.setLocale(nextLocale)
  locale.value = nextLocale
  isLanguageDialogOpen.value = false
}

const saveAppearancePreferences = async () => {
  if (isSavingPreferences.value) return
  isSavingPreferences.value = true
  try {
    const updated = await updateUser({
      showRpe: useRpe.value,
      showWeightTracking: weightTrackingEnabled.value,
    })
    currentUser.value = updated
    await authStore.refreshUser()
    toast.success(t('settings.preferencesSaved'), { progressBar: true, duration: 1000 })
  } catch (error) {
    console.error('Failed saving preferences:', error)
    toast.error(t('settings.failedToSavePreferences'), { progressBar: true, duration: 1000 })
    // rollback UI to last known good value
    useRpe.value = currentUser.value?.showRpe ?? true
    weightTrackingEnabled.value = currentUser.value?.showWeightTracking ?? false
  } finally {
    isSavingPreferences.value = false
  }
}

const saveWeeklyGoal = async () => {
  if (isSavingGoal.value) return
  if (weeklyGoal.value < 1 || weeklyGoal.value > 7) {
    toast.error(t('settings.invalidGoalValue'), { progressBar: true, duration: 1000 })
    return
  }

  isSavingGoal.value = true
  try {
    const updated = await updateWeeklyWorkoutGoal(weeklyGoal.value)
    currentUser.value = updated
    await authStore.refreshUser()

    // Refresh streak info
    const streak = await getStreakInfo()
    streakInfo.value = streak

    toast.success(t('settings.goalUpdated'), { progressBar: true, duration: 1000 })
  } catch (error) {
    console.error('Failed saving weekly goal:', error)
    toast.error(t('settings.failedToUpdateGoal'), { progressBar: true, duration: 1000 })
    // rollback UI to last known good value
    weeklyGoal.value = currentUser.value?.weeklyWorkoutGoal ?? 3
  } finally {
    isSavingGoal.value = false
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
  { titleKey: 'settings.darkMode', showArrow: false, disabled: true, type: 'darkMode' },
  { titleKey: 'settings.language', showArrow: true, disabled: false, type: 'language' },
  { titleKey: 'settings.helpAndSupport', showArrow: true, disabled: true },
  { titleKey: 'settings.logout', showArrow: false, disabled: false, type: 'logout' },
]

onMounted(() => {
  locale.value = appStore.locale
  loadUserData()
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
