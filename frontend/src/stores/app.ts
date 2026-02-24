// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'en' as 'en' | 'sv',
    darkMode: true,
  }),
  actions: {
    setLocale(locale: 'en' | 'sv') {
      this.locale = locale
    },
    setDarkMode(value: boolean) {
      this.darkMode = value
    },
  },
  persist: {
    pick: ['locale', 'darkMode'],
  },
})
