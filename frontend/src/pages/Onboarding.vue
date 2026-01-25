<template>
  <div class="onboarding-page d-flex flex-column fill-height pa-0 background-background px-5 py-8">
    <!-- Step 1: Personal Information -->
    <div v-if="currentStep === 1" class="step-content mt-8">
      <div class="mb-6">
        <h1 class="text-h4 text-textPrimary mb-2">{{ $t('onboarding.welcome') }}</h1>
        <p class="text-textSecondary">{{ $t('onboarding.personalInfoDescription') }}</p>
      </div>

      <v-form ref="personalInfoForm" @submit.prevent="nextStep">
        <div class="mb-4">
          <p class="text-body-2 text-textSecondary mb-2">{{ $t('onboarding.unitScale') }}</p>
          <v-btn-toggle
            v-model="formData.unitScale"
            mandatory
            color="primary"
            class="w-100"
            divided
          >
            <v-btn value="metric" class="flex-grow-1">
              {{ $t('onboarding.metric') }}
            </v-btn>
            <v-btn value="imperial" class="flex-grow-1">
              {{ $t('onboarding.imperial') }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <v-text-field
          v-model.number="formData.weight"
          class="mb-4"
          :label="`${$t('onboarding.weight')} (${$t('common.optional')})`"
          :suffix="formData.unitScale === 'metric' ? 'kg' : 'lbs'"
          type="number"
          step="0.1"
          variant="outlined"
          hide-details
        />

        <v-text-field
          v-model.number="formData.height"
          class="mb-4"
          :label="`${$t('onboarding.height')} (${$t('common.optional')})`"
          :suffix="formData.unitScale === 'metric' ? 'cm' : 'in'"
          type="number"
          step="0.1"
          variant="outlined"
          hide-details
        />

        <v-text-field
          v-model="formData.dateOfBirth"
          class="mb-4"
          :label="$t('onboarding.dateOfBirth')"
          :rules="[v => !!v || t('onboarding.dateOfBirthRequired')]"
          type="date"
          variant="outlined"
        />

        <v-select
          v-model="formData.gender"
          class="mb-6"
          :items="genderOptions"
          :label="$t('onboarding.gender')"
          :rules="[v => !!v || t('onboarding.genderRequired')]"
          variant="outlined"
        />

        <v-btn block class="text-white" color="primary" rounded="lg" size="large" type="submit">
          {{ $t('common.next') }}
        </v-btn>
      </v-form>
    </div>

    <!-- Step 2: Goals -->
    <div v-if="currentStep === 2" class="step-content mt-8">
      <div class="mb-6">
        <h1 class="text-h4 text-textPrimary mb-2">{{ $t('onboarding.goals') }}</h1>
        <p class="text-textSecondary">{{ $t('onboarding.goalsDescription') }}</p>
      </div>

      <v-form ref="goalsForm" @submit.prevent="completeOnboarding">
        <v-select
          v-model="formData.primaryGoal"
          class="mb-4"
          :items="goalOptions"
          :label="$t('onboarding.primaryGoal')"
          :rules="[v => !!v || t('onboarding.primaryGoalRequired')]"
          variant="outlined"
        />

        <div class="mb-4">
          <label class="text-body-2 text-textSecondary mb-2 d-block">
            {{ $t('onboarding.weeklyTrainingGoal') }}
          </label>
          <v-slider
            v-model="formData.weeklyWorkoutGoal"
            :min="1"
            :max="7"
            :step="1"
            color="primary"
            thumb-label
            show-ticks
            class="mt-4"
          >
            <template #thumb-label="{ modelValue }">
              {{ modelValue }} {{ modelValue === 1 ? $t('common.day') : $t('common.days') }}
            </template>
          </v-slider>
          <p class="text-center text-caption text-textSecondary">
            {{ formData.weeklyWorkoutGoal }}
            {{ formData.weeklyWorkoutGoal === 1 ? $t('common.day') : $t('common.days') }}
            {{ $t('common.perWeek') }}
          </p>
        </div>

        <v-text-field
          v-model.number="formData.targetWeight"
          class="mb-4"
          :label="`${$t('onboarding.targetWeight')} (${$t('common.optional')})`"
          :suffix="formData.unitScale === 'metric' ? 'kg' : 'lbs'"
          type="number"
          step="0.1"
          variant="outlined"
          hide-details
        />

        <v-select
          v-model="formData.goalTimeframe"
          class="mb-6"
          :items="timeframeOptions"
          :label="`${$t('onboarding.timeframe')} (${$t('common.optional')})`"
          variant="outlined"
          hide-details
        />

        <v-btn
          block
          class="mb-3"
          color="textSecondary"
          variant="outlined"
          rounded="lg"
          size="large"
          @click="goBack"
        >
          {{ $t('common.back') }}
        </v-btn>

        <v-btn
          block
          class="text-white"
          color="primary"
          rounded="lg"
          size="large"
          type="submit"
          :loading="loading"
          :disabled="loading"
        >
          {{ $t('onboarding.saveAndContinue') }}
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store'
import { updateUserPreferences } from '@/services/user.service'
import { toast } from 'vuetify-sonner'
import type { VForm } from 'vuetify/components'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const currentStep = ref(1)
const loading = ref(false)
const personalInfoForm = ref<VForm | null>(null)
const goalsForm = ref<VForm | null>(null)

const formData = ref({
  unitScale: 'metric',
  weight: undefined as number | undefined,
  height: undefined as number | undefined,
  dateOfBirth: undefined as string | undefined,
  gender: undefined as string | undefined,
  primaryGoal: undefined as string | undefined,
  weeklyWorkoutGoal: 3,
  targetWeight: undefined as number | undefined,
  goalTimeframe: undefined as number | undefined,
})

const genderOptions = computed(() => [
  { title: t('onboarding.male'), value: 'male' },
  { title: t('onboarding.female'), value: 'female' },
  { title: t('onboarding.other'), value: 'other' },
  { title: t('onboarding.preferNotToSay'), value: 'prefer_not_to_say' },
])

const goalOptions = computed(() => [
  { title: t('onboarding.buildMuscle'), value: 'build_muscle' },
  { title: t('onboarding.loseWeight'), value: 'lose_weight' },
  { title: t('onboarding.gainWeight'), value: 'gain_weight' },
  { title: t('onboarding.improveEndurance'), value: 'improve_endurance' },
  { title: t('onboarding.generalFitness'), value: 'general_fitness' },
  { title: t('onboarding.increaseStrength'), value: 'increase_strength' },
  { title: t('onboarding.noSpecificGoal'), value: 'no_specific_goal' },
])

const timeframeOptions = computed(() => [
  { title: t('onboarding.fourWeeks'), value: 4 },
  { title: t('onboarding.eightWeeks'), value: 8 },
  { title: t('onboarding.twelveWeeks'), value: 12 },
  { title: t('onboarding.sixMonths'), value: 24 },
  { title: t('onboarding.oneYear'), value: 52 },
])

const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!personalInfoForm.value) return
    const { valid } = await personalInfoForm.value.validate()
    if (!valid) return
    currentStep.value = 2
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const completeOnboarding = async () => {
  if (!goalsForm.value) return
  const { valid } = await goalsForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const preferences = {
      ...formData.value,
      onboardingCompleted: true,
    }

    const updatedUser = await updateUserPreferences(preferences)

    // Update user in auth store
    if (authStore.user) {
      authStore.user = updatedUser
    }

    toast.success(t('onboarding.completed'))
    router.push('/')
  } catch (error) {
    console.error('Error completing onboarding:', error)
    toast.error(t('onboarding.errorSaving'))
  } finally {
    loading.value = false
  }
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

.step-content {
  flex: 1;
  overflow-y: auto;
}
</style>
