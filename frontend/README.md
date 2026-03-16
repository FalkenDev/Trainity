<p align="center">
  <img src="public/logo.svg" width="120" alt="Grindify Logo" />
  <h1 align="center">Grindify Frontend</h1>
</p>

<p align="center">The mobile-first accessible web interface for <a href="../README.md">Grindify</a>.</p>

<p align="center">
<a href="https://vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/vue-3.x-green.svg" alt="Vue 3" /></a>
<a href="https://vuetifyjs.com/" target="_blank"><img src="https://img.shields.io/badge/vuetify-3.x-1867C0.svg" alt="Vuetify 3" /></a>
<a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/vite-5.x-646CFF.svg" alt="Vite" /></a>
<a href="https://pinia.vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/pinia-2.x-yellow.svg" alt="Pinia" /></a>
</p>

## Overview

The Grindify frontend is a Single Page Application (SPA) built with **Vue 3** and **Vite**. It utilizes **Vuetify 3** for a Material Design-compliant interface that works seamlessly across desktop and mobile devices.

## Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, Script Setup)
- **UI Component Library**: [Vuetify 3](https://vuetifyjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (w/ Persistence)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Internationalization**: [Vue I18n](https://kazupon.github.io/vue-i18n/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & vue-chartjs
- **Notifications**: [Vue Sonner](https://vue-sonner.vercel.app/)
- **Linter/Formatter**: ESLint 9 + Prettier

## Prerequisites

- **Node.js** v20+
- **npm** or **yarn**

## Installation

```bash
$ npm install
```

## Running Development Server

To start the development server with Hot Module Replacement (HMR):

```bash
$ npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) (or whichever port Vite assigns).

## Building for Production

To build the application for production:

```bash
$ npm run build
```

To preview the production build locally:

```bash
$ npm run preview
```

## Linting and Formatting

```bash
# Run linter
$ npm run lint

# Run type check
$ npm run type-check
```

## File Structure

- `src/components`: Reusable UI components
- `src/pages`: Application views/routes
- `src/stores`: Pinia state stores
- `src/services`: API service integraions
- `src/locales`: I18n translation files
- `src/interfaces`: TypeScript interfaces and types
