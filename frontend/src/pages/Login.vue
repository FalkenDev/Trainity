<template>
  <v-container class="fill-height pa-0 primary-gradient-bg" fluid>
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
            <v-icon class="mr-2" color="primary" size="large">
              mdi-dumbbell
            </v-icon>
            Gym Access
          </v-card-title>
          <v-card-subtitle class="text-center mb-8">
            Welcome back! Fuel your journey.
          </v-card-subtitle>

          <v-form ref="form" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              class="mb-4"
              autocomplete="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              required
              :rules="emailRules"
              type="email"
              variant="outlined"
            />

            <v-text-field
              v-model="password"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="mb-4"
              label="Password"
              autocomplete="current-password"
              prepend-inner-icon="mdi-lock-outline"
              required
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="showPassword = !showPassword"
            />

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
              <v-icon class="mr-2" left>mdi-login-variant</v-icon>
              Login
            </v-btn>
          </v-form>

          <div class="text-center">
            <span class="text-grey-darken-1">Don't have an account?</span>
            <v-btn
              class="pl-1 text-capitalize"
              color="primary"
              size="small"
              variant="text"
              @click="navigateToCreateAccount"
            >
              Sign Up
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth.store';
  import type { VForm } from 'vuetify/components';
  import { useDisplay } from 'vuetify';

  const { smAndUp } = useDisplay();
  const router = useRouter();
  const authStore = useAuthStore();

  const form = ref<VForm | null>(null);
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);

  const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];
  const passwordRules = [(v: string) => !!v || 'Password is required'];

  const handleLogin = async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();

    if (valid) {
      const success = await authStore.login(email.value, password.value);
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  const navigateToCreateAccount = () => {
    router.push('/register');
  };
</script>

<style scoped>
.primary-gradient-bg {
  background: linear-gradient(135deg, rgb(#e3f2fd) 0%, rgb(#fff3e0) 100%);
}

.primary-gradient-bg {
  background: linear-gradient(135deg, #bbdefb 0%, #ffe0b2 100%);
}

.v-btn.bg-primary .v-btn__content {
  color: white;
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
