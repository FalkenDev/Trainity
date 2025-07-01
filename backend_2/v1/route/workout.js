import express from "express";
import workoutModel from "../models/workoutModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, workoutModel.getWorkoutList);
router.post("/", auth, workoutModel.createWorkout);
router.get("/:id", auth, workoutModel.getWorkout);
router.patch("/:id", auth, workoutModel.updateWorkout);
router.delete("/:id", auth, workoutModel.deleteWorkout);
router.post("/:id/exercise", auth, workoutModel.addExerciseToWorkout);
router.post("/:id/exercises", auth, workoutModel.addExercisesToWorkout);
router.delete(
  "/:id/exercise/:exerciseId",
  auth,
  workoutModel.removeExerciseFromWorkout
);
router.delete(
  "/:id/exercises",
  auth,
  workoutModel.removeExercisesFromWorkout
);

router.put(
  "/:id/exercise/:exerciseId",
  auth,
  workoutModel.updateExerciseInWorkout
);
router.post("/:id/duplicate", auth, workoutModel.duplicateWorkout);

export default router;
