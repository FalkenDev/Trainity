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

import { createI18n } from 'vue-i18n';

import en from '@/locales/en';
import sv from '@/locales/sv';

export type AppLocale = 'en' | 'sv';

const STORAGE_KEY = 'app';

function readPersistedLocale(): AppLocale | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { locale?: unknown };
    if (parsed?.locale === 'en' || parsed?.locale === 'sv') return parsed.locale;
    return null;
  } catch {
    return null;
  }
}

function defaultLocale(): AppLocale {
  const persisted = typeof window !== 'undefined' ? readPersistedLocale() : null;
  if (persisted) return persisted;

  const browser = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return browser.toLowerCase().startsWith('sv') ? 'sv' : 'en';
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    sv,
  },
});

export default i18n;
