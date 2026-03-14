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
  <v-dialog :model-value="modelValue" fullscreen @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-toolbar color="surface" flat>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('auth.termsAndConditions') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <p class="text-caption text-textSecondary mb-6">Last updated: March 2026</p>

        <h3 class="text-h6 mb-2">1. Acceptance of Terms</h3>
        <p class="text-body-2 mb-4">
          By creating an account and using Trainity ("the Service"), you agree to be bound by these
          Terms & Conditions. If you do not agree, you may not use the Service.
        </p>

        <h3 class="text-h6 mb-2">2. Description of Service</h3>
        <p class="text-body-2 mb-4">
          Trainity is a fitness tracking application that allows you to plan workouts, log exercise
          sessions, track progress, and set fitness goals. The Service is provided by FalkenDev
          ("we", "us", "our").
        </p>

        <h3 class="text-h6 mb-2">3. Account Registration & Security</h3>
        <p class="text-body-2 mb-4">
          You must provide accurate and complete information when registering. You are responsible
          for maintaining the confidentiality of your account credentials and for all activity
          that occurs under your account. You must notify us immediately of any unauthorized use.
          You must be at least 16 years old to use the Service.
        </p>

        <h3 class="text-h6 mb-2">4. User Data & Content</h3>
        <p class="text-body-2 mb-4">
          You retain ownership of the data you enter into the Service (workouts, measurements,
          goals, etc.). By using the Service, you grant us a limited license to store and process
          this data solely for the purpose of providing the Service to you. We do not sell your
          personal data to third parties.
        </p>

        <h3 class="text-h6 mb-2">5. Prohibited Conduct</h3>
        <p class="text-body-2 mb-2">You agree not to:</p>
        <ul class="text-body-2 mb-4 pl-4">
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to other accounts or systems</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Share your account credentials with others</li>
          <li>Use automated tools to scrape or extract data from the Service</li>
        </ul>

        <h3 class="text-h6 mb-2">6. Intellectual Property</h3>
        <p class="text-body-2 mb-4">
          The Service, including its design, software, and content (excluding user-provided data),
          is owned by FalkenDev and protected under applicable copyright and intellectual property
          laws. Trainity is open-source software licensed under the GNU Affero General Public
          License v3 (AGPL-3.0).
        </p>

        <h3 class="text-h6 mb-2">7. Disclaimers & Limitation of Liability</h3>
        <p class="text-body-2 mb-4">
          The Service is provided "as is" without warranties of any kind. Trainity is not a
          medical service. Content within the app does not constitute medical advice. Always
          consult a qualified healthcare professional before starting any fitness programme.
          To the extent permitted by applicable law, FalkenDev shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of the Service.
        </p>

        <h3 class="text-h6 mb-2">8. Service Availability</h3>
        <p class="text-body-2 mb-4">
          We do not guarantee uninterrupted or error-free operation of the Service. We may
          suspend, modify, or discontinue the Service at any time with reasonable notice where
          possible.
        </p>

        <h3 class="text-h6 mb-2">9. Termination</h3>
        <p class="text-body-2 mb-4">
          You may delete your account at any time. We reserve the right to suspend or terminate
          your access if you violate these Terms. Upon termination, your data will be deleted in
          accordance with our Privacy Policy.
        </p>

        <h3 class="text-h6 mb-2">10. Changes to Terms</h3>
        <p class="text-body-2 mb-4">
          We may update these Terms from time to time. We will notify you of material changes
          via email or an in-app notification. Continued use of the Service after changes take
          effect constitutes acceptance of the revised Terms.
        </p>

        <h3 class="text-h6 mb-2">11. Governing Law</h3>
        <p class="text-body-2 mb-4">
          These Terms are governed by the laws of Sweden and the European Union. Any disputes
          shall be subject to the exclusive jurisdiction of Swedish courts.
        </p>

        <h3 class="text-h6 mb-2">12. Contact</h3>
        <p class="text-body-2 mb-4">
          For questions regarding these Terms, please contact us at:
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
