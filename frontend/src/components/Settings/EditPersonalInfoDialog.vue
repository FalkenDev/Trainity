<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Grindify.
  -
  - Grindify is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Grindify. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card class="d-flex flex-column bg-background fill-height">
    <BackHeader
      :title="$t('settings.editPersonalInformation')"
      show-save
      @close="emit('close')"
      @save="save"
    />

    <v-card-text class="pa-5 flex-grow-1 overflow-y-auto">
      <v-form ref="formRef" @submit.prevent="save">
        <v-text-field
          v-model="fullName"
          :label="$t('settings.fullName')"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          class="mb-4"
          :rules="[(v: string) => !!v?.trim() || $t('auth.fullNameRequired')]"
        />

        <v-text-field
          v-model="email"
          :label="$t('settings.email')"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          type="email"
          autocomplete="email"
          class="mb-4"
          :rules="emailRules"
        />

        <v-text-field
          v-model="dateOfBirth"
          :label="$t('settings.dateOfBirth')"
          prepend-inner-icon="mdi-calendar"
          variant="outlined"
          type="date"
          class="mb-4"
        />

        <v-text-field
          :model-value="weightStr"
          :label="$t('settings.weight')"
          prepend-inner-icon="mdi-scale-bathroom"
          :suffix="weightUnit"
          variant="outlined"
          type="text"
          inputmode="decimal"
          class="mb-4"
          @update:model-value="weightStr = normalizeDecimalStr($event)"
        />

        <v-text-field
          :model-value="heightStr"
          :label="$t('settings.height')"
          prepend-inner-icon="mdi-human-male-height"
          :suffix="heightUnit"
          variant="outlined"
          type="text"
          inputmode="decimal"
          class="mb-4"
          @update:model-value="heightStr = normalizeDecimalStr($event)"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { User } from '@/interfaces/User.interface'
import { updateUser } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'
import type { VForm } from 'vuetify/components'
import { parseDecimalInput, normalizeDecimalStr, formatDecimalDisplay } from '@/utils/decimalInput'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated', user: User): void
}>()

const authStore = useAuthStore()
const { t } = useI18n({ useScope: 'global' })

const formRef = ref<VForm | null>(null)
const isSaving = ref(false)

const isImperial = computed(() => props.user?.unitScale === 'imperial')
const weightUnit = computed(() => (isImperial.value ? 'lbs' : 'kg'))
const heightUnit = computed(() => (isImperial.value ? 'in' : 'cm'))
const toKg = (val: number) => (isImperial.value ? val / 2.20462 : val)
const fromKg = (val: number | undefined | null): number | null => {
  if (val == null) return null
  return isImperial.value ? Number((val * 2.20462).toFixed(1)) : Number(Number(val).toFixed(1))
}
const toCm = (val: number) => (isImperial.value ? val * 2.54 : val)
const fromCm = (val: number | undefined | null): number | null => {
  if (val == null) return null
  return isImperial.value ? Number((val / 2.54).toFixed(1)) : Number(Number(val).toFixed(1))
}

const firstName = ref('')
const lastName = ref('')
const fullName = ref('')
const email = ref('')
const dateOfBirth = ref('')
const weightStr = ref('')
const heightStr = ref('')

const emailRules = [
  (v: string) => !!v || t('auth.emailRequired'),
  (v: string) => /.+@.+\..+/.test(v) || t('auth.emailValid'),
]

const initForm = () => {
  const u = props.user
  firstName.value = u.firstName || ''
  lastName.value = u.lastName || ''
  fullName.value = `${u.firstName || ''} ${u.lastName || ''}`.trim()
  email.value = u.email || ''
  dateOfBirth.value = u.dateOfBirth ? u.dateOfBirth.substring(0, 10) : ''
  weightStr.value = formatDecimalDisplay(fromKg(u.weight))
  heightStr.value = formatDecimalDisplay(fromCm(u.height))
}

watch(() => props.user, initForm, { immediate: true })

const save = async () => {
  if (isSaving.value) return
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    const parts = fullName.value.trim().split(/\s+/).filter(Boolean)
    const fName = parts.shift() || ''
    const lName = parts.join(' ')

    const payload: Record<string, unknown> = {
      firstName: fName,
      lastName: lName,
      email: email.value.trim(),
    }

    if (dateOfBirth.value) {
      payload.dateOfBirth = dateOfBirth.value
    }
    const parsedWeight = parseDecimalInput(weightStr.value)
    if (parsedWeight > 0) {
      payload.weight = Number(toKg(parsedWeight).toFixed(2))
    }
    const parsedHeight = parseDecimalInput(heightStr.value)
    if (parsedHeight > 0) {
      payload.height = Number(toCm(parsedHeight).toFixed(2))
    }

    const updated = (await updateUser(payload as Partial<User>)) as User
    await authStore.refreshUser()
    emit('updated', updated)
    toast.success(t('settings.accountUpdated'), { progressBar: true, duration: 1000 })
    emit('close')
  } catch (error) {
    console.error('Error saving personal info:', error)
    toast.error(t('settings.failedToUpdateAccount'), { progressBar: true, duration: 1000 })
  } finally {
    isSaving.value = false
  }
}
</script>
