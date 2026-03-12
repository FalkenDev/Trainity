/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
