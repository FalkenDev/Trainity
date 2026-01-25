<template>
  <div class="login-page d-flex flex-column fill-height pa-0 background-background px-5">
    <div class="d-flex flex-column justify-center align-center mt-16">
      <div
        class="bg-primary d-flex justify-center align-center rounded"
        style="width: 60px; height: 60px"
      >
        <v-icon size="38" color="black">mdi-dumbbell</v-icon>
      </div>
      <h1 class="text-h4 font-weight-bold text-center text-textPrimary mt-3">Trainity</h1>
      <v-card-subtitle class="text-center mb-8"> Your fitness journey starts here </v-card-subtitle>
    </div>

    <v-form ref="form" class="flex-grow-1" @submit.prevent="handleLogin">
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
        v-model="password"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        class="mb-4"
        :label="$t('auth.password')"
        autocomplete="current-password"
        prepend-inner-icon="mdi-lock-outline"
        required
        :rules="passwordRules"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        hide-details
        @click:append-inner="showPassword = !showPassword"
      />

      <div class="d-flex justify-end">
        <v-btn
          class="mb-4 text-body"
          color="primary"
          size="small"
          variant="text"
          @click="router.push('/forgot-password')"
        >
          {{ $t('auth.forgotPassword') }}
        </v-btn>
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
        {{ $t('auth.login') }}
      </v-btn>

      <v-divider>
        <span class="text-textSecondary text-body-2r">{{ $t('auth.orContinueWith') }}</span>
      </v-divider>

      <div class="d-flex flex-row ga-5 w-100 justify-center mt-4">
        <v-btn color="cardBg" class="border-sm flex-grow-1" variant="flat">
          <v-icon size="24" class="me-2">mdi-google</v-icon>
          <span>Google</span>
        </v-btn>

        <v-btn color="cardBg" class="border-sm flex-grow-1" variant="flat">
          <v-icon size="24" class="me-2">mdi-github</v-icon>
          <span>GitHub</span>
        </v-btn>
      </div>
    </v-form>

    <div class="footer text-center mt-auto mb-4">
      <span class="text-grey-darken-1">{{ $t('auth.dontHaveAccount') }}</span>
      <v-btn
        class="pl-1 text-capitalize"
        color="primary"
        size="small"
        variant="text"
        @click="navigateToCreateAccount"
      >
        {{ $t('auth.signUp') }}
      </v-btn>
    </div>
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
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const emailRules = [
  (v: string) => !!v || t('auth.emailRequired'),
  (v: string) => /.+@.+\..+/.test(v) || t('auth.emailValid'),
]
const passwordRules = [(v: string) => !!v || t('auth.passwordRequired')]

const handleLogin = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()

  if (valid) {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      router.push('/dashboard')
    }
  }
}

const navigateToCreateAccount = () => {
  router.push('/register')
}
</script>

<style scoped>
:deep(.v-input__control) {
  background-color: #15181e !important;
  border-radius: 6px;
}
</style>
