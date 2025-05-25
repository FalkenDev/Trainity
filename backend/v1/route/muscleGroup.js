import express from "express";
import muscleGroupModel from "../models/muscleGroupModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, muscleGroupModel.getMuscleGroupList);
router.post("/", auth, muscleGroupModel.createMuscleGroup);
router.get("/:id", auth, muscleGroupModel.getMuscleGroup);
router.put("/:id", auth, muscleGroupModel.updateMuscleGroup);
router.delete("/:id", auth, muscleGroupModel.deleteMuscleGroup);

export default router;
