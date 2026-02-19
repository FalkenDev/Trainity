<template>
  <v-card>
    <BackHeader :title="$t('settings.language')" @close="emit('close')" />
    <v-card-text class="pa-0">
      <v-list>
        <v-list-item :active="currentLocale === 'en'" @click="selectLanguage('en')">
          <v-list-item-title>{{ $t('settings.english') }}</v-list-item-title>
          <template #append>
            <v-icon v-if="currentLocale === 'en'"> mdi-check </v-icon>
          </template>
        </v-list-item>
        <v-list-item :active="currentLocale === 'sv'" @click="selectLanguage('sv')">
          <v-list-item-title>{{ $t('settings.swedish') }}</v-list-item-title>
          <template #append>
            <v-icon v-if="currentLocale === 'sv'"> mdi-check </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

const emit = defineEmits<{
  close: []
}>()

const appStore = useAppStore()
const { locale } = useI18n({ useScope: 'global' })

const currentLocale = computed(() => locale.value)

const selectLanguage = (nextLocale: 'en' | 'sv') => {
  appStore.setLocale(nextLocale)
  locale.value = nextLocale
  emit('close')
}
</script>
