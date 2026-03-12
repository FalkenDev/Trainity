<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1 align="center">Trainity API</h1>
</p>

<p align="center">The backend services for <a href="../README.md">Trainity</a>, built with NestJS.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://github.com/nestjs/nest/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/database-PostgreSQL-336791.svg" alt="Database" /></a>
</p>

## Overview

The Trainity API handles all business logic, data persistence, file management, and user authentication for the platform. It is architected as a modular monolith using **NestJS (v11)** and **TypeORM**, backed by a **PostgreSQL 17** database.

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: Passport.js (JWT & Local Strategy)
- **Validation**: class-validator & class-transformer
- **API Documentation**: OpenAPI (Swagger)
- **File Uploads**: Multer
- **Image Processing**: Sharp
- **Testing**: Jest (Unit & E2E)

## Prerequisites

- **Node.js** v20+
- **PostgreSQL** v17+ (Running locally or via Docker)
- **npm** or **yarn**

## Installation

```bash
$ npm install
```

## Configuration

1. Copy the environment file example (if available) or create a `.env` file in the root directory.
2. Configure your database connection and JWT secrets.

## Running the Application

### Development

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug
```

### Production

```bash
$ npm run build
$ npm run start:prod
```

### Database Seeding

To populate the database with initial data:

```bash
$ npm run seed
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

You can run the entire backend service alongside the database using Docker Compose from the root directory:

```bash
$ docker compose up --build backend
```
