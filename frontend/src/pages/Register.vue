<template>
  <v-container
    class="fill-height pa-0 primary-gradient-bg"
    fluid
  >
    <v-row
      class="fill-height ma-0 background-image"
      :class="smAndUp ? 'align-center' : 'align-end'"
      justify="center"
    >
      <v-col
        :class="smAndUp ? '' : 'pa-0'"
        cols="12"
        lg="5"
        md="8"
        sm="10"
        xl="4"
      >
        <v-card
          class="pa-sm-8 pa-md-10 pa-6 mx-auto"
          :class="smAndUp ? 'rounded-xl' : 'rounded-t-xl'"
          elevation="12"
        >
          <v-card-title
            class="text-h4 font-weight-bold text-center mb-2 primary--text"
          >
            <v-icon
              class="mr-2"
              color="primary"
              size="large"
            >
              mdi-account-plus-outline
            </v-icon>
            {{ $t('auth.joinMovement') }}
          </v-card-title>
          <v-card-subtitle class="text-center mb-8">
            {{ $t('auth.createAccountSubtitle') }}
          </v-card-subtitle>

          <v-form
            ref="form"
            @submit.prevent="handleCreateAccount"
          >
            <v-text-field
              v-model="fullName"
              autocomplete="name"
              class="mb-4"
              :label="$t('auth.fullName')"
              prepend-inner-icon="mdi-account-outline"
              required
              :rules="nameRules"
              variant="outlined"
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
              @click:append-inner="showPassword = !showPassword"
            />

            <v-text-field
              v-model="confirmPassword_new"
              :append-inner-icon="
                showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
              "
              class="mb-4"
              :label="$t('auth.confirmPassword')"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-check-outline"
              required
              :rules="confirmPasswordRules"
              :type="showConfirmPassword ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
            />

            <v-checkbox
              v-model="agreeToTerms"
              class="mb-2"
              required
              :rules="[(v: boolean) => !!v || t('auth.mustAgreeToContinue')]"
            >
              <template #label>
                <div class="text-body-2">
                  {{ $t('auth.agreeToThe') }}
                  <a
                    href="#"
                    @click.prevent="showTermsDialog = true"
                  >{{ $t('auth.termsAndConditions') }}</a>
                </div>
              </template>
            </v-checkbox>

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
              <v-icon
                class="mr-2"
                left
              >
                mdi-check-circle-outline
              </v-icon>
              {{ $t('auth.createAccount') }}
            </v-btn>
          </v-form>

          <div class="text-center">
            <span class="text-grey-darken-1">{{ $t('auth.alreadyHaveAccount') }}</span>
            <v-btn
              class="pl-1 text-capitalize"
              color="primary"
              size="small"
              variant="text"
              @click="navigateToLogin"
            >
              {{ $t('auth.login') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showTermsDialog"
      max-width="600px"
    >
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
          <v-btn
            color="primary"
            text
            @click="showTermsDialog = false"
          >
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth.store';
  import type { VForm } from 'vuetify/components';
  import { useDisplay } from 'vuetify';
  import { useI18n } from 'vue-i18n';

  const { smAndUp } = useDisplay();

  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useI18n({ useScope: 'global' });

  const form = ref<VForm | null>(null);
  const fullName = ref('');
  const email = ref('');
  const password_new = ref('');
  const confirmPassword_new = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const agreeToTerms = ref(false);
  const showTermsDialog = ref(false);

  const nameRules = [(v: string) => !!v || t('auth.fullNameRequired')];
  const emailRules = [
    (v: string) => !!v || t('auth.emailRequired'),
    (v: string) => /.+@.+\..+/.test(v) || t('auth.emailValid'),
  ];
  const passwordRules = [
    (v: string) => !!v || t('auth.passwordRequired'),
    (v: string) => v.length >= 8 || t('auth.passwordMinLength'),
  ];
  const confirmPasswordRules = computed(() => [
    (v: string) => !!v || t('auth.confirmPasswordRequired'),
    (v: string) => v === password_new.value || t('auth.passwordsDoNotMatch'),
  ]);

  const handleCreateAccount = async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();

    if (password_new.value !== confirmPassword_new.value) {
      alert(t('auth.passwordsDoNotMatchAlert'));
      return;
    }

    if (valid) {
      const success = await authStore.createAccount({
        fullName: fullName.value,
        email: email.value,
        password: password_new.value,
      });
      if (success) {
        // Registration auto-logs in via the auth store.
        router.push('/');
      }
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };
</script>

<style scoped>
.v-btn.bg-primary .v-btn__content {
  color: white;
}

/* Style for the terms link */
.v-label a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}
.v-label a:hover {
  text-decoration: underline;
}

.background-image {
  background-image: url("@/assets/gym.jpg");
  background-size: cover;
  background-position: center;
  background-blend-mode: darken;
  background-color: rgba(0, 0, 0, 0.5);
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>
