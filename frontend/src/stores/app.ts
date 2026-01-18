// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'en' as 'en' | 'sv',
  }),
  actions: {
    setLocale (locale: 'en' | 'sv') {
      this.locale = locale
    },
  },
  persist: {
    pick: ['locale'],
  },
})
