<!--
  - Copyright (c) 2026 FalkenDev
  -
  - This file is part of Grindify.
  -
  - Grindify is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of
  - the License, or (at your option) any later version.
  -
  - You should have received a copy of the GNU Affero General Public
  - License along with Grindify. If not, see
  - <https://www.gnu.org/licenses/>.
  -->

<template>
  <v-card class="d-flex flex-column bg-background fill-height">
    <BackHeader :title="$t('settings.versionHistory')" @close="emit('close')" />

    <v-progress-linear v-if="isRefreshing" color="primary" indeterminate />

    <v-card-text class="pa-5 d-flex flex-column ga-5 version-history-content">
      <v-card
        color="cardBg"
        class="pa-5 rounded-xl d-flex flex-column align-center text-center ga-4 version-history-hero"
        :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
      >
        <v-avatar size="88" color="avatarBg">
          <v-img :src="logoUrl" alt="Grindify logo" />
        </v-avatar>

        <div>
          <h2 class="text-h5 font-weight-bold">Grindify</h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('settings.versionHistorySubtitle') }}
          </p>
        </div>

        <div class="summary-grid w-100">
          <div class="summary-card">
            <p class="text-caption text-medium-emphasis text-uppercase">
              {{ $t('settings.installedOnThisDevice') }}
            </p>
            <p class="text-h6 font-weight-bold">{{ installedBuildInfo.version }}</p>
            <p class="text-body-2 text-medium-emphasis">
              {{ $t('settings.versionBuildDetails', {
                commit: formatShortSha(installedBuildInfo.gitSha),
                builtAt: formatExactTime(installedBuildInfo.builtAt),
              }) }}
            </p>
            <p class="text-body-2 text-medium-emphasis">
              {{ $t('settings.versionChannelLabel', { channel: formatChannel(installedBuildInfo.channel) }) }}
            </p>
          </div>

          <div class="summary-card">
            <p class="text-caption text-medium-emphasis text-uppercase">
              {{ $t('settings.deployedOnServer') }}
            </p>
            <p class="text-h6 font-weight-bold">{{ deployedVersionLabel }}</p>
            <p class="text-body-2 text-medium-emphasis">
              {{ deployedBuildInfo
                ? $t('settings.versionBuildDetails', {
                    commit: formatShortSha(deployedBuildInfo.gitSha),
                    builtAt: formatExactTime(deployedBuildInfo.builtAt),
                  })
                : $t('settings.versionStatusUnavailable') }}
            </p>
            <p v-if="deployedBuildInfo" class="text-body-2 text-medium-emphasis">
              {{ $t('settings.versionChannelLabel', { channel: formatChannel(deployedBuildInfo.channel) }) }}
            </p>
          </div>

          <div class="summary-card">
            <p class="text-caption text-medium-emphasis text-uppercase">
              {{ $t('settings.latestRelease') }}
            </p>
            <p class="text-h6 font-weight-bold">{{ latestReleaseLabel }}</p>
            <p class="text-body-2 text-medium-emphasis">
              {{ latestReleaseEntry
                ? formatReleaseStatusLine(latestReleaseEntry, true)
                : releaseHistory.message || $t('settings.versionStatusUnavailable') }}
            </p>
            <p v-if="releaseHistory.repo" class="text-body-2 text-medium-emphasis">
              {{ releaseHistory.repo }}
            </p>
          </div>
        </div>

        <div class="d-flex flex-wrap justify-center ga-3">
          <v-btn
            color="primary"
            :loading="isCheckingForUpdates || isRefreshing"
            @click="handleCheckForUpdates"
          >
            {{ $t('settings.checkForUpdates') }}
          </v-btn>
          <v-btn variant="outlined" :loading="isRefreshing" @click="refreshData">
            {{ $t('settings.refreshVersionStatus') }}
          </v-btn>
        </div>
      </v-card>

      <v-alert
        v-if="deviceStatus"
        class="status-alert"
        :type="deviceStatus.type"
        variant="tonal"
        prominent
      >
        {{ deviceStatus.message }}
      </v-alert>

      <v-alert
        v-if="releaseStatus"
        class="status-alert"
        :type="releaseStatus.type"
        variant="tonal"
        prominent
      >
        {{ releaseStatus.message }}
      </v-alert>

      <div class="d-flex flex-column ga-3">
        <div class="d-flex justify-space-between align-center ga-3 flex-wrap">
          <div>
            <h2 class="text-h6">{{ $t('settings.releaseHistory') }}</h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ $t('settings.versionHistoryFetchedAt', { time: formatExactTime(releaseHistory.fetchedAt) }) }}
            </p>
          </div>
        </div>

        <v-card
          v-for="(release, index) in releaseHistory.releases"
          :key="release.tagName"
          color="cardBg"
          class="pa-4 rounded-xl d-flex flex-column ga-3 release-card"
          :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
        >
          <div class="d-flex justify-space-between align-start ga-3 flex-wrap release-card-header">
            <div class="d-flex flex-column ga-1 release-card-copy">
              <h3 class="text-subtitle-1 font-weight-bold">{{ release.name || release.tagName }}</h3>
              <p class="text-body-2 text-medium-emphasis">
                {{ formatReleaseStatusLine(release, index === latestStableReleaseIndex) }}
              </p>
            </div>
            <v-chip class="release-card-tag" color="primary" variant="tonal">{{ release.tagName }}</v-chip>
          </div>

          <div class="text-body-2 release-notes" v-html="renderReleaseBody(release.body)" />

          <div v-if="release.htmlUrl" class="d-flex justify-end">
            <v-btn variant="text" color="primary" :href="release.htmlUrl" target="_blank">
              {{ $t('settings.viewReleaseOnGitHub') }}
            </v-btn>
          </div>
        </v-card>

        <v-card
          v-if="!releaseHistory.releases.length"
          color="cardBg"
          class="pa-4 rounded-xl"
          :style="{ border: '1px solid rgb(var(--v-theme-borderColor))' }"
        >
          <p class="text-body-2 text-medium-emphasis">{{ $t('settings.noReleaseHistory') }}</p>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useI18n } from 'vue-i18n'
import { toast } from 'vuetify-sonner'
import logoUrl from '@/assets/logo.png'
import { usePWA } from '@/composables/usePWA'
import type {
  AppBuildInfo,
  ReleaseHistoryEntry,
  ReleaseHistoryResponse,
} from '@/interfaces/Version.interface'
import {
  getDeployedBuildInfo,
  getInstalledBuildInfo,
  getReleaseHistory,
} from '@/services/version.service'

const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n({ useScope: 'global' })
const { needRefresh, checkForUpdates, isCheckingForUpdates } = usePWA()

const installedBuildInfo = getInstalledBuildInfo()
const deployedBuildInfo = ref<AppBuildInfo | null>(null)
const isRefreshing = ref(false)
const releaseHistory = ref<ReleaseHistoryResponse>({
  status: 'unavailable',
  source: 'github',
  repo: null,
  fetchedAt: new Date().toISOString(),
  latestReleaseVersion: null,
  releases: [],
  message: null,
})

const deployedVersionLabel = computed(() => deployedBuildInfo.value?.version ?? t('common.unknown'))

const latestReleaseEntry = computed(() => {
  if (!releaseHistory.value.latestReleaseVersion) return null
  return (
    releaseHistory.value.releases.find(
      release => release.tagName === releaseHistory.value.latestReleaseVersion,
    ) ?? null
  )
})

const latestReleaseLabel = computed(() => latestReleaseEntry.value?.tagName ?? t('common.unknown'))

const latestStableReleaseIndex = computed(() => {
  return releaseHistory.value.releases.findIndex(release => !release.prerelease)
})

const deviceStatus = computed(() => {
  if (!deployedBuildInfo.value) {
    return {
      type: 'info' as const,
      message: t('settings.versionHistoryMissingDeployedVersion'),
    }
  }

  const comparison = compareVersions(installedBuildInfo.version, deployedBuildInfo.value.version)
  if (comparison === 0) {
    return {
      type: 'success' as const,
      message: t('settings.versionHistoryDeviceCurrent'),
    }
  }

  if (comparison === -1) {
    return {
      type: 'warning' as const,
      message: t('settings.versionHistoryDeviceUpdateAvailable'),
    }
  }

  if (comparison === 1) {
    return {
      type: 'info' as const,
      message: t('settings.versionHistoryInstalledAhead'),
    }
  }

  return {
    type: 'info' as const,
    message: t('settings.versionHistoryVersionsDiffer'),
  }
})

const releaseStatus = computed(() => {
  if (releaseHistory.value.status !== 'ok') {
    return {
      type: 'info' as const,
      message:
        releaseHistory.value.message ||
        (releaseHistory.value.status === 'unconfigured'
          ? t('settings.versionHistoryReleaseProxyUnconfigured')
          : t('settings.versionHistoryReleaseProxyUnavailable')),
    }
  }

  if (!deployedBuildInfo.value || !releaseHistory.value.latestReleaseVersion) {
    return null
  }

  const comparison = compareVersions(
    deployedBuildInfo.value.version,
    releaseHistory.value.latestReleaseVersion,
  )

  if (comparison === 0) {
    return {
      type: 'success' as const,
      message: t('settings.versionHistoryServerCurrent'),
    }
  }

  if (comparison === -1) {
    return {
      type: 'info' as const,
      message: t('settings.versionHistoryServerBehindLatest'),
    }
  }

  if (comparison === 1) {
    return {
      type: 'info' as const,
      message: t('settings.versionHistoryDeployedAheadOfRelease'),
    }
  }

  return {
    type: 'info' as const,
    message: t('settings.versionHistoryReleaseMismatch'),
  }
})

function parseSemver(version: string | null | undefined) {
  if (!version) return null
  const match = version.trim().match(/^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/)
  if (!match) return null
  return match.slice(1, 4).map(value => Number(value))
}

function compareVersions(left: string | null | undefined, right: string | null | undefined) {
  if (!left || !right) return null
  if (left === right) return 0

  const leftSemver = parseSemver(left)
  const rightSemver = parseSemver(right)
  if (!leftSemver || !rightSemver) return null

  for (let index = 0; index < leftSemver.length; index += 1) {
    if (leftSemver[index] < rightSemver[index]) return -1
    if (leftSemver[index] > rightSemver[index]) return 1
  }

  return 0
}

function formatExactTime(value: string | null | undefined) {
  if (!value) return t('common.unknown')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('common.unknown')

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) return t('common.unknown')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('common.unknown')

  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  const formatter = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })

  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(diffInSeconds) >= secondsPerUnit) {
      return formatter.format(Math.round(diffInSeconds / secondsPerUnit), unit)
    }
  }

  return formatter.format(diffInSeconds, 'second')
}

function formatShortSha(value: string) {
  return value && value !== 'unknown' ? value.slice(0, 7) : t('common.unknown')
}

function formatChannel(channel: string) {
  switch (channel) {
    case 'stable':
      return t('settings.versionChannelStable')
    case 'edge':
      return t('settings.versionChannelEdge')
    case 'local':
      return t('settings.versionChannelLocal')
    default:
      return channel
  }
}

function formatReleaseStatusLine(release: ReleaseHistoryEntry, isLatestStableRelease: boolean) {
  const parts: string[] = []

  if (isLatestStableRelease && !release.prerelease) {
    parts.push(t('settings.latestRelease'))
  }

  if (release.prerelease) {
    parts.push(t('settings.versionHistoryPrerelease'))
  }

  if (release.publishedAt) {
    parts.push(formatRelativeTime(release.publishedAt))
    parts.push(formatExactTime(release.publishedAt))
  }

  return parts.join(' • ')
}

function renderReleaseBody(body: string) {
  const markdown = body.trim() || t('settings.noReleaseNotes')
  const html = marked.parse(markdown, {
    gfm: true,
    breaks: true,
  }) as string

  const sanitizedHtml = DOMPurify.sanitize(html)

  if (typeof DOMParser === 'undefined') {
    return sanitizedHtml
  }

  const documentFragment = new DOMParser().parseFromString(sanitizedHtml, 'text/html')

  documentFragment.querySelectorAll('a').forEach(anchor => {
    const href = anchor.getAttribute('href') ?? ''
    const text = anchor.textContent?.trim() ?? ''

    anchor.setAttribute('target', '_blank')
    anchor.setAttribute('rel', 'noopener noreferrer')

    if (href && text === href) {
      anchor.textContent = formatLinkLabel(href)
    }
  })

  return documentFragment.body.innerHTML
}

function formatLinkLabel(href: string) {
  try {
    const url = new URL(href)
    const path = url.pathname.length > 28 ? `${url.pathname.slice(0, 28)}...` : url.pathname
    return `${url.hostname}${path}`
  } catch {
    return href.length > 48 ? `${href.slice(0, 48)}...` : href
  }
}

async function refreshData() {
  if (isRefreshing.value) return

  isRefreshing.value = true

  try {
    const [deployed, releases] = await Promise.all([getDeployedBuildInfo(), getReleaseHistory()])
    deployedBuildInfo.value = deployed
    releaseHistory.value = releases
  } finally {
    isRefreshing.value = false
  }
}

async function handleCheckForUpdates() {
  const attempted = await checkForUpdates()

  if (!attempted) {
    toast.info(t('settings.versionHistoryUpdateCheckUnavailable'), {
      progressBar: true,
      duration: 2500,
    })
    return
  }

  if (needRefresh.value) {
    toast.success(t('settings.versionHistoryUpdateReady'), {
      progressBar: true,
      duration: 2500,
    })
  } else {
    toast.info(t('settings.versionHistoryNoUpdateFound'), {
      progressBar: true,
      duration: 2500,
    })
  }

  await refreshData()
}

onMounted(() => {
  void refreshData()
})
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-auto-rows: max-content;
  gap: 12px;
  align-items: start;
}

.version-history-content {
  flex: 1 1 auto;
  min-block-size: 0;
  overflow-y: auto;
  align-items: stretch;
}

.version-history-hero {
  flex-shrink: 0;
  height: auto !important;
}

.summary-card {
  border: 1px solid rgb(var(--v-theme-borderColor));
  border-radius: 16px;
  padding: 16px;
  text-align: left;
  background: rgba(var(--v-theme-surface), 0.4);
  block-size: fit-content;
  flex-shrink: 0;
}

.release-card {
  inline-size: 100%;
  flex-shrink: 0;
  height: auto !important;
}

.release-card-header {
  inline-size: 100%;
}

.release-card-copy {
  flex: 1 1 260px;
  min-inline-size: 0;
}

.release-card-copy > * {
  overflow-wrap: anywhere;
}

.release-card-tag {
  flex: 0 0 auto;
  align-self: flex-start;
}

.release-notes {
  min-inline-size: 0;
  white-space: normal;
  line-height: 1.6;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.release-notes :deep(p),
.release-notes :deep(ul),
.release-notes :deep(ol),
.release-notes :deep(pre),
.release-notes :deep(blockquote) {
  margin-block: 0 12px;
}

.release-notes :deep(p:last-child),
.release-notes :deep(ul:last-child),
.release-notes :deep(ol:last-child),
.release-notes :deep(pre:last-child),
.release-notes :deep(blockquote:last-child) {
  margin-bottom: 0;
}

.release-notes :deep(ul),
.release-notes :deep(ol) {
  padding-inline-start: 20px;
}

.release-notes :deep(li + li) {
  margin-top: 6px;
}

.release-notes :deep(h1),
.release-notes :deep(h2),
.release-notes :deep(h3),
.release-notes :deep(h4) {
  font-size: 1rem;
  font-weight: 700;
  margin-block: 0 10px;
}

.release-notes :deep(code) {
  font-family: monospace;
  font-size: 0.9em;
  background: rgba(var(--v-theme-surface-variant), 0.45);
  padding: 2px 6px;
  border-radius: 6px;
}

.release-notes :deep(pre) {
  overflow-x: auto;
  white-space: pre-wrap;
  padding: 12px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.35);
}

.release-notes :deep(pre code) {
  background: transparent;
  padding: 0;
}

.release-notes :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.release-notes :deep(a:hover) {
  text-decoration: underline;
}

.status-alert {
  min-block-size: 72px;
  flex-shrink: 0;
}

.status-alert :deep(.v-alert__content),
.status-alert :deep(.v-alert__prepend),
.status-alert :deep(.v-alert__append),
.status-alert :deep(.v-alert__close) {
  align-self: center;
}

@media (min-width: 840px) {
  .summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>