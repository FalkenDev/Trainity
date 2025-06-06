import mongoose from "mongoose";
import dotenv from "dotenv";

import MuscleGroup from "../v1/schemas/MuscleGroupSchema.js";
import Exercise from "../v1/schemas/ExerciseSchema.js";
import Workout from "../v1/schemas/WorkoutSchema.js";
import User from "../v1/schemas/UserSchema.js";

dotenv.config();

const usersToSeed = [
  {
    email: "test@test.com",
    password: "test1234",
  },
];

const muscleGroupsToSeed = [
  { name: "Chest" },
  { name: "Back" },
  { name: "Shoulders" },
  { name: "Biceps" },
  { name: "Triceps" },
  { name: "Legs" },
  { name: "Abs" },
  { name: "Forearms" },
];

const exercisesToSeed = [
  {
    name: "Bench Press",
    description: "A compound exercise for the upper body.",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 60,
  },
  {
    name: "Pull Up",
    description: "A compound exercise for the back and biceps.",
    muscleGroups: ["Back", "Biceps"],
    defaultSets: 3,
    defaultReps: 8,
    defaultPauseSeconds: 75,
  },
  {
    name: "Squat",
    description: "The king of all leg exercises.",
    muscleGroups: ["Legs"],
    defaultSets: 4,
    defaultReps: 12,
    defaultPauseSeconds: 90,
  },
  {
    name: "Overhead Press",
    description: "A compound exercise for the shoulders.",
    muscleGroups: ["Shoulders", "Triceps"],
    defaultSets: 3,
    defaultReps: 10,
    defaultPauseSeconds: 60,
  },
  {
    name: "Plank",
    description: "A core stability exercise.",
    muscleGroups: ["Abs"],
    defaultSets: 3,
    defaultReps: 1,
    defaultPauseSeconds: 45,
  },
];

const workoutsToSeed = [
  {
    title: "Full Body Strength A",
    description: "A balanced workout hitting all major muscle groups.",
    time: 60,
    exercises: [
      {
        exerciseName: "Squat",
        order: 1,
        sets: 4,
        reps: 10,
        weight: 60,
        pauseSeconds: 90,
      },
      {
        exerciseName: "Bench Press",
        order: 2,
        sets: 3,
        reps: 10,
        weight: 50,
        pauseSeconds: 60,
      },
      {
        exerciseName: "Pull Up",
        order: 3,
        sets: 3,
        reps: 8,
        weight: 0,
        pauseSeconds: 75,
      },
    ],
  },
  {
    title: "Upper Body Focus",
    description: "Focus on building upper body strength and size.",
    time: 45,
    exercises: [
      {
        exerciseName: "Overhead Press",
        order: 1,
        sets: 3,
        reps: 8,
        weight: 30,
        pauseSeconds: 60,
      },
      {
        exerciseName: "Pull Up",
        order: 2,
        sets: 4,
        reps: 6,
        weight: 0,
        pauseSeconds: 75,
      },
      {
        exerciseName: "Bench Press",
        order: 3,
        sets: 3,
        reps: 12,
        weight: 45,
        pauseSeconds: 60,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DBURI);
    console.log("✅ Connection successful.");

    // --- Clean up existing data ---
    console.log("🧹 Clearing old data...");
    await Workout.deleteMany({});
    await Exercise.deleteMany({});
    await MuscleGroup.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Old data cleared.");

    // --- Seed User ---
    console.log("👤 Seeding user...");
    const createdUsers = await User.insertMany(usersToSeed);
    const mainUserId = createdUsers[0]._id;
    console.log(`✅ User seeded with ID: ${mainUserId}`);

    // --- Seed Muscle Groups ---
    console.log("💪 Seeding muscle groups...");
    const createdMuscleGroups = await MuscleGroup.insertMany(
      muscleGroupsToSeed
    );
    console.log("✅ Muscle groups seeded.");

    // Create a lookup map for muscle group names to IDs
    const muscleGroupMap = createdMuscleGroups.reduce((map, group) => {
      map[group.name] = group._id;
      return map;
    }, {});

    // --- Seed Exercises ---
    console.log("🏋️ Seeding exercises...");
    const exercisesToInsert = exercisesToSeed.map((exercise) => {
      const muscleGroupIds = exercise.muscleGroups.map(
        (name) => muscleGroupMap[name]
      );
      return {
        ...exercise,
        muscleGroups: muscleGroupIds,
        createdBy: mainUserId,
      };
    });
    const createdExercises = await Exercise.insertMany(exercisesToInsert);
    console.log("✅ Exercises seeded.");

    // Create a lookup map for exercise names to IDs
    const exerciseMap = createdExercises.reduce((map, exercise) => {
      map[exercise.name] = exercise._id;
      return map;
    }, {});

    // --- Seed Workouts ---
    console.log("📅 Seeding workouts...");
    const workoutsToInsert = workoutsToSeed.map((workout) => {
      const workoutExercises = workout.exercises.map((ex) => ({
        ...ex,
        exerciseId: exerciseMap[ex.exerciseName], // Replace name with ID
      }));
      return { ...workout, exercises: workoutExercises, createdBy: mainUserId };
    });
    await Workout.insertMany(workoutsToInsert);
    console.log("✅ Workouts seeded.");

    console.log("\n🎉🎉🎉 Database has been successfully seeded! 🎉🎉🎉");
  } catch (error) {
    console.error("\n❌❌❌ An error occurred during seeding: ❌❌❌");
    console.error(error);
  } finally {
    console.log("\nDisconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("✅ Disconnected.");
  }
};

seedDatabase();
