<template>
  <div class="login-page d-flex flex-column fill-height pa-0 background-background px-5 py-16">
    <v-btn icon color="textSecondary" variant="text" @click="navigateToLogin">
      <v-icon size="32">mdi-arrow-left</v-icon>
    </v-btn>
    <div class="my-5">
      <h1 class="text-textPrimary">Register</h1>
      <p class="text-textSecondary">Start your fitness transformation today</p>
    </div>

    <v-form ref="form" @submit.prevent="handleCreateAccount">
      <v-text-field
        v-model="fullName"
        autocomplete="name"
        class="mb-4"
        :label="$t('auth.fullName')"
        prepend-inner-icon="mdi-account-outline"
        required
        :rules="nameRules"
        variant="outlined"
        hide-details
      />

      <v-text-field
        v-model="email"
        class="mb-4"
        autocomplete="email"
        :label="$t('auth.emailAddress')"
        prepend-inner-icon="mdi-email-outline"
        required
        :rules="emailRules"
        type="email"
        variant="outlined"
        hide-details
      />

      <v-text-field
        v-model="password_new"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        class="mb-4"
        :label="$t('auth.password')"
        autocomplete="new-password"
        prepend-inner-icon="mdi-lock-outline"
        required
        :rules="passwordRules"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details
        @click:append-inner="showPassword = !showPassword"
      />

      <v-text-field
        v-model="confirmPassword_new"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        class="mb-4"
        :label="$t('auth.confirmPassword')"
        autocomplete="new-password"
        prepend-inner-icon="mdi-lock-check-outline"
        required
        :rules="confirmPasswordRules"
        :type="showConfirmPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />

      <div class="d-flex flex-column ga-2 mt-4 mb-6">
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">
            Personalized workout plans
          </h1>
        </div>
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">Track your progress</h1>
        </div>
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">Join the community</h1>
        </div>
      </div>

      <v-btn
        block
        class="mb-6 mt-2 text-white"
        color="primary"
        :disabled="authStore.loading"
        :loading="authStore.loading"
        rounded="lg"
        size="large"
        type="submit"
      >
        {{ $t('auth.createAccount') }}
      </v-btn>
    </v-form>

    <div class="text-center">
      <span class="text-grey-darken-1 text-body-2">
        {{ $t('auth.bySigningUp') }}
        <a href="#" class="text-primary" @click.prevent="showTermsDialog = true">{{
          $t('auth.termsAndConditions')
        }}</a>
        {{ $t('common.and') }}
        <a href="#" class="text-primary" @click.prevent="showTermsDialog = true">{{
          $t('auth.privacyPolicy')
        }}</a>
      </span>
    </div>

    <v-dialog v-model="showTermsDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="text-h5 primary--text">
          {{ $t('auth.termsAndConditions') }}
        </v-card-title>
        <v-card-text>
          <p class="mb-4">
            {{ $t('auth.termsPlaceholder') }}
          </p>
          <p>{{ $t('auth.termsReadCarefully') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showTermsDialog = false">
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { VForm } from 'vuetify/components'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n({ useScope: 'global' })

const form = ref<VForm | null>(null)
const fullName = ref('')
const email = ref('')
const password_new = ref('')
const confirmPassword_new = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showTermsDialog = ref(false)

const nameRules = [(v: string) => !!v || t('auth.fullNameRequired')]
const emailRules = [
  (v: string) => !!v || t('auth.emailRequired'),
  (v: string) => /.+@.+\..+/.test(v) || t('auth.emailValid'),
]
const passwordRules = [
  (v: string) => !!v || t('auth.passwordRequired'),
  (v: string) => v.length >= 8 || t('auth.passwordMinLength'),
]
const confirmPasswordRules = computed(() => [
  (v: string) => !!v || t('auth.confirmPasswordRequired'),
  (v: string) => v === password_new.value || t('auth.passwordsDoNotMatch'),
])

const handleCreateAccount = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()

  if (password_new.value !== confirmPassword_new.value) {
    alert(t('auth.passwordsDoNotMatchAlert'))
    return
  }

  if (valid) {
    const success = await authStore.createAccount({
      fullName: fullName.value,
      email: email.value,
      password: password_new.value,
    })
    if (success) {
      // Registration auto-logs in via the auth store, then redirect to onboarding
      router.push('/onboarding')
    }
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
:deep(.v-field) {
  background-color: #15181e !important;
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>
