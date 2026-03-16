# Database Seeding

The seeding system populates the database with initial data for development and testing purposes. It is designed to be idempotent: running it will clear existing data and reset the database to a known state.

## Directory Structure

```
seed/
├── seed.ts                      # Main entry point - orchestrates the seeding process
├── data/                        # Static data definitions
│   ├── users.data.ts            # Users to create
│   ├── muscleGroups.data.ts     # Muscle group definitions
│   ├── exercises.data.ts        # Exercises (seeded for the main user)
│   └── activities.data.ts       # Activities (seeded for the main user)
└── seeders/                     # Seeder logic
    ├── users.seeder.ts          # Creates users
    ├── muscleGroups.seeder.ts   # Creates muscle groups
    ├── exercises.seeder.ts      # Creates exercises linked to muscle groups/users
    └── activities.seeder.ts     # Creates activities linked to users
```

## Prerequisites

The seed script connects to your PostgreSQL database using the environment variables defined in your `.env` file or defaults. Ensure your database container is running.

- **Environment Variables**:
  - `DATABASE_HOST` (default: `postgres`)
  - `DATABASE_PORT` (default: `5432`)
  - `DATABASE_USER` (default: `user`)
  - `DATABASE_PASSWORD` (default: `password`)
  - `DATABASE_NAME` (default: `grindifydb`)

## Usage

You can run the seed script directly via npm from the `backend` directory:

```bash
# Run with ts-node (development)
npm run seed

# Build and run (production/deployments)
npm run seed:build
```

## How It Works

1. **Initialization**: Connects to the database using TypeORM.
2. **Cleanup**: Truncates all tables to remove existing data (Cascading deletes are handled).
3. **Execution**:
   - Creates users defined in `users.data.ts`.
   - Creates muscle groups defined in `muscleGroups.data.ts`.
   - Creates exercises for the **first user** based on `exercises.data.ts`, linking them to the appropriate muscle groups.
   - Creates activities for the **first user** based on `activities.data.ts`.

## Modifying Seed Data

To add or change the initial data, edit the files in the `src/v1/seed/data/` directory.

- **Users**: Add objects to `usersToSeed` in `users.data.ts`.
- **Exercises**: Add objects to `exercisesToSeed` in `exercises.data.ts`. Note that these exercises will be assigned to the first seeded user.
- **Muscle Groups**: Add objects to `muscleGroupsToSeed` in `muscleGroups.data.ts`.
