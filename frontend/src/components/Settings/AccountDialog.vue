<template>
  <v-card class="d-flex flex-column">
    <BackHeader :title="$t('settings.editAccount')" @close="emit('close')" />

    <v-card-text class="pa-5 flex-grow-1 overflow-y-auto">
      <v-form ref="accountForm" @submit.prevent="saveAccount">
        <div class="mb-6">
          <p class="text-subtitle-1 mb-3">
            {{ $t('settings.profilePhoto') }}
          </p>
          <ImageUpload
            v-model="avatarFile"
            :existing-image-url="user?.avatar ? getImageUrl(user.avatar) : null"
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
      <v-btn variant="text" :disabled="isSaving" @click="emit('close')">
        {{ $t('common.cancel') }}
      </v-btn>
      <v-spacer />
      <v-btn color="primary" :loading="isSaving" @click="saveAccount">
        {{ $t('common.saveChanges') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import ImageUpload from '@/components/basicUI/ImageUpload.vue'
import { updateUser, uploadAvatar } from '@/services/user.service'
import type { User } from '@/interfaces/User.interface'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits<{
  close: []
  updated: [user: User]
}>()

const authStore = useAuthStore()
const { t } = useI18n({ useScope: 'global' })

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = apiUrl.replace('/v1', '')
  return `${baseUrl}${imagePath}`
}

const isImperial = computed(() => props.user?.unitScale === 'imperial')
const wtWeightUnit = computed(() => (isImperial.value ? 'lbs' : 'kg'))
const toKg = (val: number) => (isImperial.value ? val / 2.20462 : val)
const fromKg = (val: number | undefined | null): number | null => {
  if (val === undefined || val === null) return null
  return isImperial.value ? Number((val * 2.20462).toFixed(1)) : Number(Number(val).toFixed(1))
}

const isSaving = ref(false)
const accountForm = ref<VForm | null>(null)
const avatarFile = ref<File | null>(null)
const fullName = ref('')
const email = ref('')
const editStartWeight = ref<number | null>(null)
const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)

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

const initForm = () => {
  const user = props.user
  fullName.value = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  email.value = user?.email || ''
  editStartWeight.value = fromKg(user?.startWeight)
  avatarFile.value = null
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

// Initialise whenever the dialog opens with fresh user data
watch(() => props.user, initForm, { immediate: true })

const splitFullName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || ''
  const lastName = parts.join(' ')
  return { firstName, lastName }
}

const saveAccount = async () => {
  if (isSaving.value) return
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

  isSaving.value = true
  try {
    let updatedUser: User | null = null

    if (avatarFile.value) {
      updatedUser = (await uploadAvatar(avatarFile.value)) as User
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
    emit('updated', updatedUser)
    await authStore.refreshUser()

    toast.success(t('settings.accountUpdated'), { progressBar: true, duration: 1000 })
    emit('close')
  } catch (error) {
    console.error('Error saving account:', error)
    toast.error(t('settings.failedToUpdateAccount'), { progressBar: true, duration: 1000 })
  } finally {
    isSaving.value = false
  }
}
</script>
