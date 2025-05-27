/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Styles
import "unfonts.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
