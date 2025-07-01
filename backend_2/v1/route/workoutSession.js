import express from "express";
import workoutSessionModel from "../models/workoutSessionModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, workoutSessionModel.getWorkoutSessionList);
router.post("/", auth, workoutSessionModel.createWorkoutSession);
router.get("/:id", auth, workoutSessionModel.getWorkoutSession);
router.put("/:id", auth, workoutSessionModel.updateWorkoutSession);
router.delete("/:id", auth, workoutSessionModel.deleteWorkoutSession);
router.post("/:id/finish", auth, workoutSessionModel.finishWorkoutSession);
router.post("/:id/abandon", auth, workoutSessionModel.abandonWorkoutSession);

export default router;
