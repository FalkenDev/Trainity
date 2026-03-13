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

import { onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'

export function useBackgroundSync() {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'BACKGROUND_SYNC_SUCCESS') {
      toast.success('Workout synced!')
    }
  }

  onMounted(() => {
    navigator.serviceWorker?.addEventListener('message', handleMessage)
  })

  onUnmounted(() => {
    navigator.serviceWorker?.removeEventListener('message', handleMessage)
  })
}
