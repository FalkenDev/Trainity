<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Trainity.
  -
  - Trainity is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Trainity. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <div class="login-page d-flex flex-column fill-height pa-0 background-background px-5 py-16">
    <v-btn icon color="textSecondary" variant="text" @click="navigateToLogin">
      <v-icon size="32">mdi-arrow-left</v-icon>
    </v-btn>
    <div class="my-5">
      <h1 class="text-textPrimary">{{ $t('auth.register') }}</h1>
      <p class="text-textSecondary">{{ $t('auth.registerSubtitle') }}</p>
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

      <div class="d-flex flex-column ga-2 mt-4 mb-4">
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">
            {{ $t('auth.personalizedPlans') }}
          </h1>
        </div>
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">
            {{ $t('auth.trackYourProgress') }}
          </h1>
        </div>
        <div class="d-flex align-cente">
          <v-avatar size="20" class="mr-2" color="iconBackground">
            <v-icon color="primary" size="14">mdi-check</v-icon>
          </v-avatar>
          <h1 class="text-textSecondary text-body-2 align-center d-flex">
            {{ $t('auth.joinCommunity') }}
          </h1>
        </div>
      </div>

      <!-- Consent checkboxes -->
      <div class="mb-2">
        <v-checkbox
          v-model="termsAccepted"
          color="primary"
          density="compact"
          hide-details="auto"
          :rules="termsRules"
        >
          <template #label>
            <span class="text-body-2">
              {{ $t('auth.agreeToThe') }}
              <a class="text-primary" @click.prevent.stop="showTermsDialog = true">{{
                $t('auth.termsAndConditions')
              }}</a>
            </span>
          </template>
        </v-checkbox>

        <v-checkbox
          v-model="privacyAccepted"
          color="primary"
          density="compact"
          hide-details="auto"
          :rules="privacyRules"
        >
          <template #label>
            <span class="text-body-2">
              {{ $t('auth.agreeToThe') }}
              <a class="text-primary" @click.prevent.stop="showPrivacyDialog = true">{{
                $t('auth.privacyPolicy')
              }}</a>
            </span>
          </template>
        </v-checkbox>
      </div>

      <v-btn
        block
        class="mb-6 mt-4 text-white"
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

    <TermsAndConditionsDialog v-model="showTermsDialog" />
    <PrivacyPolicyDialog v-model="showPrivacyDialog" />

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { VForm } from 'vuetify/components'
import { useI18n } from 'vue-i18n'
import TermsAndConditionsDialog from '@/components/legal/TermsAndConditionsDialog.vue'
import PrivacyPolicyDialog from '@/components/legal/PrivacyPolicyDialog.vue'

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
const showPrivacyDialog = ref(false)
const termsAccepted = ref(false)
const privacyAccepted = ref(false)

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
const termsRules = [(v: boolean) => !!v || t('auth.mustAgreeToTerms')]
const privacyRules = [(v: boolean) => !!v || t('auth.mustAgreeToPrivacy')]

const handleCreateAccount = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()

  if (password_new.value !== confirmPassword_new.value) {
    alert(t('auth.passwordsDoNotMatchAlert'))
    return
  }

  if (valid) {
    await authStore.createAccount({
      fullName: fullName.value,
      email: email.value,
      password: password_new.value,
    })
    // Navigation is handled inside authStore.createAccount
    // (verify-email page when verification is required, or auto-login to onboarding)
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
:deep(.v-field) {
  background-color: rgb(var(--v-theme-cardBg)) !important;
  border-radius: 12px !important;
}

:deep(.v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>
