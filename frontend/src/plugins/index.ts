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

/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import pinia from '../stores';
import router from '../router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from './i18n';

// Types
import type { App } from 'vue';

export function registerPlugins (app: App) {
  app.use(vuetify).use(router).use(pinia).use(i18n);
  pinia.use(piniaPluginPersistedstate);
}
