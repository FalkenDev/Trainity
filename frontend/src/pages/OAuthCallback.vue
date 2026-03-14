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
  <div class="d-flex flex-column fill-height align-center justify-center">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n({ useScope: 'global' })

onMounted(() => {
  try {
    const userParam = route.query.user as string
    const redirect = (route.query.redirect as string) || '/'

    if (!userParam) throw new Error('Missing user data')

    const user = JSON.parse(atob(userParam.replace(/-/g, '+').replace(/_/g, '/')))

    authStore.setUserFromOAuth(user)
    router.replace(redirect)
  } catch {
    toast.error(t('auth.oauthFailed'))
    router.replace('/login')
  }
})
</script>
