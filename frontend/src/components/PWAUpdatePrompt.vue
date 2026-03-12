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
  <v-snackbar
    v-model="showUpdateSnackbar"
    :timeout="-1"
    color="cardBg"
    location="bottom"
    class="pwa-update-snackbar"
  >
    <div class="d-flex align-center ga-2">
      <v-icon color="primary" size="small">mdi-update</v-icon>
      <span class="text-body-2">{{ $t('pwa.updateAvailable') }}</span>
    </div>
    <template #actions>
      <v-btn variant="text" size="small" @click="dismiss">
        {{ $t('pwa.dismiss') }}
      </v-btn>
      <v-btn color="primary" variant="flat" size="small" @click="update">
        {{ $t('pwa.update') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { usePWA } from '@/composables/usePWA'
import { toast } from 'vuetify-sonner'
import { useI18n } from 'vue-i18n'

const { offlineReady, needRefresh, updateServiceWorker, close } = usePWA()
const { t } = useI18n()

const showUpdateSnackbar = computed(() => needRefresh.value)

watch(offlineReady, ready => {
  if (ready) {
    toast(t('pwa.offlineReady'), { cardProps: { color: 'cardBg' } })
  }
})

function update() {
  updateServiceWorker()
}

function dismiss() {
  close()
}
</script>

<style scoped>
.pwa-update-snackbar {
  z-index: 10000;
}
</style>
