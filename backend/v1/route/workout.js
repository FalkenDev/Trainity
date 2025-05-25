import express from "express";
import workoutModel from "../models/workoutModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, workoutModel.getWorkoutList);
router.post("/", auth, workoutModel.createWorkout);
router.get("/:id", auth, workoutModel.getWorkout);
router.put("/:id", auth, workoutModel.updateWorkout);
router.delete("/:id", auth, workoutModel.deleteWorkout);

export default router;
