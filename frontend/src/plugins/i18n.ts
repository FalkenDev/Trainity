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
