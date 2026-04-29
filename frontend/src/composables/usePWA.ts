/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { useRegisterSW } from 'virtual:pwa-register/vue'
import { shallowRef } from 'vue'

const UPDATE_INTERVAL_MS = 60 * 60 * 1000 // Check for updates every 60 minutes

let swUrlRef = ''
let updateIntervalId: number | null = null
let isInitialized = false

const registrationRef = shallowRef<ServiceWorkerRegistration | null>(null)
const isCheckingForUpdates = shallowRef(false)

function startUpdatePolling() {
  if (updateIntervalId !== null || typeof window === 'undefined') return

  updateIntervalId = window.setInterval(() => {
    void runUpdateCheck()
  }, UPDATE_INTERVAL_MS)
}

async function runUpdateCheck(): Promise<boolean> {
  if (isCheckingForUpdates.value || !registrationRef.value || !swUrlRef) {
    return false
  }

  if (registrationRef.value.installing) {
    return false
  }

  if (typeof navigator !== 'undefined') {
    if ('connection' in navigator && !navigator.onLine) {
      return false
    }
  }

  isCheckingForUpdates.value = true

  try {
    const resp = await fetch(swUrlRef, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache' },
    })

    if (resp.status === 200) {
      await registrationRef.value.update()
      return true
    }

    return false
  } catch {
    return false
  } finally {
    isCheckingForUpdates.value = false
  }
}

export function usePWA() {
  const pwa = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return

      swUrlRef = swUrl
      registrationRef.value = registration
      startUpdatePolling()
    },
  })

  if (!isInitialized) {
    isInitialized = true
  }

  function close() {
    pwa.offlineReady.value = false
    pwa.needRefresh.value = false
  }

  return {
    offlineReady: pwa.offlineReady,
    needRefresh: pwa.needRefresh,
    updateServiceWorker: pwa.updateServiceWorker,
    checkForUpdates: runUpdateCheck,
    isCheckingForUpdates,
    close,
  }
}
