# Seed Structure

The seed system has been organized into separate modules for better maintainability and control.

## Directory Structure

```
seed/
├── seed.ts                      # Main seed orchestrator
├── data/                        # Data definitions
│   ├── users.data.ts           # User accounts to seed
│   ├── muscleGroups.data.ts    # Muscle group definitions
│   ├── exercises.data.ts       # Global exercise catalog
│   └── activities.data.ts      # Default activity templates
└── seeders/                     # Seeder functions
    ├── users.seeder.ts         # Seeds users
    ├── muscleGroups.seeder.ts  # Seeds muscle groups
    ├── exercises.seeder.ts     # Seeds global exercises
    └── activities.seeder.ts    # Seeds default activities
```

## How It Works

1. **Data Files** (`data/` directory)
   - Contains the raw data definitions
   - Easy to modify without touching seeder logic
   - Each file exports a constant with the data array

2. **Seeder Functions** (`seeders/` directory)
   - Contains the logic for inserting data into the database
   - Each seeder is a standalone function
   - Can be reused or called independently

3. **Main Seed File** (`seed.ts`)
   - Orchestrates all seeders in the correct order
   - Handles database connection and transactions
   - Clears existing data before seeding

## Running the Seed

```bash
npm run seed
```

## Adding New Data

### To add a new user:
Edit `data/users.data.ts` and add to the `usersToSeed` array.

### To add a new exercise:
Edit `data/exercises.data.ts` and add to the `exercisesToSeed` array.

### To add a new activity:
Edit `data/activities.data.ts` and add to the `activitiesToSeed` array.

### To add a new muscle group:
Edit `data/muscleGroups.data.ts` and add to the `muscleGroupsToSeed` array.

## Creating a New Seeder

1. Create a data file in `data/` directory
2. Create a seeder function in `seeders/` directory
3. Import and call the seeder in `seed.ts`

Example:
```typescript
// data/workouts.data.ts
export const workoutsToSeed = [
  { name: 'Push Day', description: '...' },
];

// seeders/workouts.seeder.ts
import { DataSource } from 'typeorm';
import { Workout } from '../../workout/workout.entity';
import { workoutsToSeed } from '../data/workouts.data';

export async function seedWorkouts(dataSource: DataSource, user: User): Promise<void> {
  const workoutRepo = dataSource.getRepository(Workout);
  
  for (const workout of workoutsToSeed) {
    const w = workoutRepo.create({ ...workout, createdBy: user });
    await workoutRepo.save(w);
  }
  
  console.log(`💪 Seeded ${workoutsToSeed.length} workout(s)`);
}

// seed.ts
import { seedWorkouts } from './seeders/workouts.seeder';

// In the seed() function:
await seedWorkouts(AppDataSource, mainUser);
```
