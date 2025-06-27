import express from "express";
import exerciseModel from "../models/exerciseModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all exercises
router.get("/", auth, exerciseModel.getExerciseList);

// POST a new exercise
router.post("/", auth, exerciseModel.createExercise);

// GET a specific exercise by ID
router.get("/:id", auth, exerciseModel.getExercise);

// PUT (update) a specific exercise by ID
router.put("/:id", auth, exerciseModel.updateExercise);

// DELETE a specific exercise by ID
router.delete("/:id", auth, exerciseModel.deleteExercise);

export default router;
