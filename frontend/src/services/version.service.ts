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

import type { AppBuildInfo, ReleaseHistoryResponse } from '@/interfaces/Version.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

const releaseHistoryFallback: ReleaseHistoryResponse = {
  status: 'unavailable',
  source: 'github',
  repo: null,
  fetchedAt: new Date().toISOString(),
  latestReleaseVersion: null,
  releases: [],
  message: 'Release history is currently unavailable.',
}

export function getInstalledBuildInfo(): AppBuildInfo {
  return {
    ...__APP_BUILD_INFO__,
  }
}

export async function getDeployedBuildInfo(): Promise<AppBuildInfo | null> {
  try {
    const response = await fetch('/version.json', {
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return (await response.json()) as AppBuildInfo
  } catch (error) {
    console.error('Error fetching deployed build info:', error)
    return null
  }
}

export async function getReleaseHistory(): Promise<ReleaseHistoryResponse> {
  try {
    const response = await fetch(`${apiUrl}/releases`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return (await response.json()) as ReleaseHistoryResponse
  } catch (error) {
    console.error('Error fetching release history:', error)
    return {
      ...releaseHistoryFallback,
      fetchedAt: new Date().toISOString(),
    }
  }
}