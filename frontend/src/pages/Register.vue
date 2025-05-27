<template>
  <v-container fluid class="fill-height pa-0 primary-gradient-bg">
    <v-row
      class="fill-height ma-0 background-image"
      :class="smAndUp ? 'align-center' : 'align-end'"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="5"
        xl="4"
        :class="smAndUp ? '' : 'pa-0'"
      >
        <v-card
          class="pa-sm-8 pa-md-10 pa-6 mx-auto"
          :class="smAndUp ? 'rounded-xl' : 'rounded-t-xl'"
          elevation="12"
        >
          <v-card-title
            class="text-h4 font-weight-bold text-center mb-2 primary--text"
          >
            <v-icon size="large" color="primary" class="mr-2">
              mdi-account-plus-outline
            </v-icon>
            Join The Movement
          </v-card-title>
          <v-card-subtitle class="text-center mb-8">
            Create your account to start your fitness journey.
          </v-card-subtitle>

          <v-form ref="form" @submit.prevent="handleCreateAccount">
            <v-text-fieldcd
              v-model="fullName"
              label="Full Name"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              :rules="nameRules"
              required
              class="mb-4"
              autocomplete="name"
            ></v-text-fieldcd>

            <v-text-field
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              type="email"
              :rules="emailRules"
              required
              class="mb-4"
              autocomplete="email"
            ></v-text-field>

            <v-text-field
              v-model="password_new"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              :rules="passwordRules"
              required
              class="mb-4"
              autocomplete="new-password"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword_new"
              label="Confirm Password"
              prepend-inner-icon="mdi-lock-check-outline"
              :append-inner-icon="
                showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
              "
              :type="showConfirmPassword ? 'text' : 'password'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              variant="outlined"
              :rules="confirmPasswordRules"
              required
              class="mb-4"
              autocomplete="new-password"
            ></v-text-field>

            <v-checkbox
              v-model="agreeToTerms"
              :rules="[(v: boolean) => !!v || 'You must agree to continue!']"
              required
              class="mb-2"
            >
              <template v-slot:label>
                <div class="text-body-2">
                  I agree to the
                  <a href="#" @click.prevent="showTermsDialog = true"
                    >Terms & Conditions</a
                  >
                </div>
              </template>
            </v-checkbox>

            <v-btn
              :loading="authStore.loading"
              :disabled="authStore.loading"
              type="submit"
              block
              color="primary"
              size="large"
              class="mb-6 mt-2 text-white"
              rounded="lg"
            >
              <v-icon left class="mr-2">mdi-check-circle-outline</v-icon>
              Create Account
            </v-btn>
          </v-form>

          <div class="text-center">
            <span class="text-grey-darken-1">Already have an account?</span>
            <v-btn
              variant="text"
              color="primary"
              @click="navigateToLogin"
              class="pl-1 text-capitalize"
              size="small"
            >
              Login
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showTermsDialog" max-width="600px">
      <v-card rounded="lg">
        <v-card-title class="text-h5 primary--text"
          >Terms & Conditions</v-card-title
        >
        <v-card-text>
          <p class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
          <p>Please read carefully before agreeing.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showTermsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type { VForm } from "vuetify/components";
import { useDisplay } from "vuetify";

const { smAndUp } = useDisplay();

const router = useRouter();
const authStore = useAuthStore();

const form = ref<VForm | null>(null);
const fullName = ref("");
const email = ref("");
const password_new = ref("");
const confirmPassword_new = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeToTerms = ref(false);
const showTermsDialog = ref(false);

const nameRules = [(v: string) => !!v || "Full name is required"];
const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 8 || "Password must be at least 8 characters",
];
const confirmPasswordRules = computed(() => [
  (v: string) => !!v || "Confirm password is required",
  (v: string) => v === password_new.value || "Passwords do not match",
]);

const handleCreateAccount = async () => {
  if (!form.value) return;
  const { valid } = await form.value.validate();

  if (password_new.value !== confirmPassword_new.value) {
    alert("Passwords do not match!");
    return;
  }

  if (valid) {
    const success = await authStore.createAccount({
      fullName: fullName.value,
      email: email.value,
      password: password_new.value,
    });
    if (success) {
      // Optionally show a success message before navigating
      alert("Account created successfully! Please login."); // Replace with a VSnackbar or VDialog
      router.push("/login");
    }
  }
};

const navigateToLogin = () => {
  router.push("/login");
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
