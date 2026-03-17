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
  <v-dialog :model-value="modelValue" fullscreen @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-toolbar color="surface" flat>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('settings.imprint') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <p class="text-caption text-textSecondary mb-6">Last updated: March 2026</p>

        <h3 class="text-h6 mb-2">Service Operator</h3>
        <p class="text-body-2 mb-4">
          <strong>{{ operatorName }}</strong><br />
          {{ operatorCity }}, {{ operatorCountry }}<br />
          Email: <strong>{{ contactEmail }}</strong>
        </p>

        <h3 class="text-h6 mb-2">About This Service</h3>
        <p class="text-body-2 mb-4">
          Grindify is a personal fitness tracking application provided for personal and
          beta use. The service is operated by an individual developer and is not a
          commercial entity.
        </p>

        <h3 class="text-h6 mb-2">Supervisory Authority</h3>
        <p class="text-body-2 mb-4">
          For privacy-related complaints, you may contact the Swedish data protection
          supervisory authority:
          <br /><br />
          <strong>Integritetsskyddsmyndigheten (IMY)</strong><br />
          Website: <strong>imy.se</strong><br />
          Phone: +46 8 657 61 00<br />
          Address: Box 8114, 104 20 Stockholm, Sweden
        </p>

        <h3 class="text-h6 mb-2">Open Source License</h3>
        <p class="text-body-2 mb-4">
          Grindify is free software licensed under the GNU Affero General Public License
          v3 (AGPL-3.0). Source code is available at the project repository.
        </p>

        <h3 class="text-h6 mb-2">Contact</h3>
        <p class="text-body-2 mb-4">
          For any inquiries, including GDPR data requests (access, erasure, portability),
          contact: <strong>{{ contactEmail }}</strong>
        </p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn block color="primary" rounded="lg" size="large" @click="$emit('update:modelValue', false)">
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL ?? 'contact@example.com'
const operatorName = import.meta.env.VITE_OPERATOR_NAME ?? 'FalkenDev'
const operatorCity = import.meta.env.VITE_OPERATOR_CITY ?? 'Sweden'
const operatorCountry = import.meta.env.VITE_OPERATOR_COUNTRY ?? ''
</script>
