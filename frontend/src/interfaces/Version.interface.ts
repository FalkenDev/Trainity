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

export interface AppBuildInfo {
  version: string
  gitSha: string
  builtAt: string
  channel: string
}

export interface ReleaseHistoryEntry {
  tagName: string
  name: string
  publishedAt: string | null
  body: string
  prerelease: boolean
  htmlUrl: string | null
}

export interface ReleaseHistoryResponse {
  status: 'ok' | 'unconfigured' | 'unavailable'
  source: 'github'
  repo: string | null
  fetchedAt: string
  latestReleaseVersion: string | null
  releases: ReleaseHistoryEntry[]
  message: string | null
}
