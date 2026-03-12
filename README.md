<p align="center">
  <!-- <img src="frontend/src/assets/logo.svg" width="120" alt="Trainity Logo" /> -->
</p>

<h1 align="center">Trainity</h1>

  <p align="center">A self-hosted fitness tracking web application built with NestJS and Vue 3.</p>
    <p align="center">
<a href="LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License" /></a>
<a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/backend-NestJS-E0234E.svg" alt="Backend" /></a>
<a href="https://vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/frontend-Vue.js-4FC08D.svg" alt="Frontend" /></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/database-PostgreSQL-336791.svg" alt="Database" /></a>
</p>

---

## Overview

Trainity is a full-stack workout application designed for users who want full ownership of their data without subscription fees or connectivity requirements. It offers a complete suite of tools to plan routines, log sessions in real-time, and visualize progress over time. The platform is designed to be mobile-first for gym usage while providing a robust desktop interface for planning and analysis.

## Features

- **Workout Management**: Create and organize custom workout routines with specific exercises, sets, and targets.
- **Session Tracking**: Log workouts in real-time with an interface optimized for mobile devices.
- **Exercise Library**: Manage a database of exercises with support for custom images and muscle group categorization.
- **Progress Analytics**: View detailed statistics including volume, frequency, and personal records per exercise.
- **Body Metrics**: Track weight logs and upload progress photos to monitor physical changes.
- **Privacy Focused**: Complete data ownership with no third-party tracking or external dependencies.

## Technology Stack

### Backend

- **Framework**: NestJS (v11)
- **Database**: PostgreSQL 17
- **ORM**: TypeORM
- **Authentication**: Passport.js (JWT & Local Strategies)
- **Validation**: class-validator & class-transformer
- **Media**: Sharp (Image processing) & Multer (File uploads)
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Library**: Vuetify 3
- **State Management**: Pinia (with persistence)
- **Visualization**: Chart.js & Vue-Chartjs
- **Routing**: Vue Router

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (Recommended)
- OR
- **Node.js** v18+
- **PostgreSQL** v15+

### Installation (Docker - Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/FalkenDev/Trainity.git
   cd Trainity
   ```

2. **Start the application**

   ```bash
   docker compose up -d --build
   ```

   The database migrations will run automatically on startup.

3. **Seed initial data** (optional)
   Population of default exercises and muscle groups:

   ```bash
   docker exec -it trainity_backend npm run seed
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **API Documentation**: http://localhost:1337/api
   - **Backend API**: http://localhost:1337

### Installation (Manual)

1. **Clone the repository**

   ```bash
   git clone https://github.com/FalkenDev/Trainity.git
   cd Trainity
   ```

2. **Configure Environment**
   Copy the example environment file and configure your database credentials:

   ```bash
   cp .env.example .env
   ```

3. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Ensure PostgreSQL is running and update .env with credentials

   npm run build
   npm run start:prod
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run build
   npm run preview
   ```

## Development

### Project Structure

```
Trainity/
├── backend/          # NestJS API application
│   ├── src/          # Source code
│   └── test/         # E2E tests
├── frontend/         # Vue 3 application
│   └── src/          # Source code
├── docker-compose.yml # Development orchestration
└── Dockerfile.*      # Container definitions
```

### Running in Development Mode

To start both services with hot-reload enabled:

```bash
docker compose -f docker-compose.yml up
```

- Backend changes will trigger a transparent restart.
- Frontend changes will be reflected instantly via Vite HMR.

## Contributing

Contributions are welcome. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a Pull Request.

By contributing to Trainity, you agree to our [Contributor License Agreement (CLA)](CLA.md).

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for details.

This software is provided "as is", without warranty of any kind.
