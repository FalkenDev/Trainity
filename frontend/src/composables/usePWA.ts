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

import { useRegisterSW } from 'virtual:pwa-register/vue'

const UPDATE_INTERVAL_MS = 60 * 60 * 1000 // Check for updates every 60 minutes

export function usePWA() {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return

      // Periodically check for service worker updates
      setInterval(async () => {
        if (registration.installing || !navigator) return

        // Check if we're online before checking for updates
        if ('connection' in navigator && !navigator.onLine) return

        try {
          const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: { 'cache-control': 'no-cache' },
          })

          if (resp?.status === 200) {
            await registration.update()
          }
        } catch {
          // Network error — skip this update check
        }
      }, UPDATE_INTERVAL_MS)
    },
  })

  function close() {
    offlineReady.value = false
    needRefresh.value = false
  }

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    close,
  }
}
