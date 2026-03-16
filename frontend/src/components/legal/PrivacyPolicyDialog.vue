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
        <v-toolbar-title>{{ $t('auth.privacyPolicyTitle') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <p class="text-caption text-textSecondary mb-6">Last updated: March 2026</p>

        <h3 class="text-h6 mb-2">1. Data Controller</h3>
        <p class="text-body-2 mb-4">
          FalkenDev is the data controller for personal data processed through Grindify.
          Contact: <strong>{{ contactEmail }}</strong>
        </p>

        <h3 class="text-h6 mb-2">2. Personal Data We Collect</h3>
        <p class="text-body-2 mb-2">We collect and process the following personal data:</p>
        <ul class="text-body-2 mb-4 pl-4">
          <li><strong>Account data:</strong> Name, email address, password (hashed)</li>
          <li><strong>Profile data:</strong> Date of birth, gender, body weight, height</li>
          <li>
            <strong>Fitness data:</strong> Workout sessions, exercise logs, sets, reps, weights,
            RPE, goals, and progress
          </li>
          <li><strong>Usage data:</strong> Login timestamps, app activity</li>
          <li><strong>Consent records:</strong> Date and version of accepted Terms & Privacy Policy</li>
        </ul>

        <h3 class="text-h6 mb-2">3. Legal Basis for Processing (GDPR)</h3>
        <p class="text-body-2 mb-2">We process your data on the following legal bases:</p>
        <ul class="text-body-2 mb-4 pl-4">
          <li>
            <strong>Art. 6(1)(b) — Contract performance:</strong> Processing necessary to provide
            the Service you signed up for (account management, storing your workout data)
          </li>
          <li>
            <strong>Art. 6(1)(a) — Consent:</strong> Processing based on your explicit agreement
            at registration (e.g., optional health-related data such as body metrics)
          </li>
          <li>
            <strong>Art. 6(1)(f) — Legitimate interests:</strong> Security, fraud prevention, and
            service improvement
          </li>
        </ul>

        <h3 class="text-h6 mb-2">4. Purpose of Processing</h3>
        <p class="text-body-2 mb-2">Your data is used to:</p>
        <ul class="text-body-2 mb-4 pl-4">
          <li>Create and manage your account</li>
          <li>Provide and improve the fitness tracking features</li>
          <li>Display your personal progress and statistics</li>
          <li>Ensure the security and integrity of the Service</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h3 class="text-h6 mb-2">5. Data Retention</h3>
        <p class="text-body-2 mb-4">
          We retain your personal data for as long as your account is active. When you delete
          your account, all associated personal data is permanently deleted within 30 days,
          except where retention is required by law.
        </p>

        <h3 class="text-h6 mb-2">6. Your Rights Under GDPR</h3>
        <p class="text-body-2 mb-2">You have the following rights regarding your personal data:</p>
        <ul class="text-body-2 mb-4 pl-4">
          <li><strong>Right of access (Art. 15):</strong> Request a copy of your data</li>
          <li><strong>Right to rectification (Art. 16):</strong> Correct inaccurate data</li>
          <li>
            <strong>Right to erasure (Art. 17):</strong> Request deletion of your data
            ("right to be forgotten")
          </li>
          <li>
            <strong>Right to restriction (Art. 18):</strong> Request limited processing of
            your data
          </li>
          <li>
            <strong>Right to data portability (Art. 20):</strong> Receive your data in a
            machine-readable format
          </li>
          <li>
            <strong>Right to object (Art. 21):</strong> Object to processing based on
            legitimate interests
          </li>
          <li>
            <strong>Right to withdraw consent:</strong> Withdraw consent at any time without
            affecting prior processing
          </li>
        </ul>
        <p class="text-body-2 mb-4">
          To exercise your rights, contact us at <strong>{{ contactEmail }}</strong>.
          We will respond within 30 days.
        </p>

        <h3 class="text-h6 mb-2">7. Data Sharing</h3>
        <p class="text-body-2 mb-4">
          We do not sell, rent, or share your personal data with third parties for marketing
          purposes. Data may be shared only with service providers necessary to operate the
          Service (e.g., hosting), who are bound by data processing agreements under GDPR Art. 28.
        </p>

        <h3 class="text-h6 mb-2">8. Right to Lodge a Complaint</h3>
        <p class="text-body-2 mb-4">
          If you believe we have not handled your personal data in accordance with GDPR, you have
          the right to lodge a complaint with the Swedish supervisory authority:
          <br /><br />
          <strong>Integritetsskyddsmyndigheten (IMY)</strong><br />
          Website: <strong>imy.se</strong><br />
          Phone: +46 8 657 61 00
        </p>

        <h3 class="text-h6 mb-2">9. Contact</h3>
        <p class="text-body-2 mb-4">
          For privacy-related inquiries, contact our Data Protection point of contact at:
          <strong>{{ contactEmail }}</strong>
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
</script>
