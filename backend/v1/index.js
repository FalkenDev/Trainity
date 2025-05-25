import express from "express";
import path from "path";
import routeUser from "./route/user.js";
import routeExercise from "./route/exercise.js";
import routeMuscleGroup from "./route/muscleGroup.js";
import routeWorkout from "./route/workout.js";
import routeWorkoutSession from "./route/workoutSession.js";

const router = express.Router();

// Route to documentation
router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/documentation/documentation.html"))
);

// Routes
router.use("/users", routeUser);
router.use("/exercises", routeExercise);
router.use("/musclegroups", routeMuscleGroup);
router.use("/workouts", routeWorkout);
router.use("/workoutsessions", routeWorkoutSession);

router.use(function (req, res) {
  return res.status(404).json({
    errors: {
      status: 404,
      source: req.path,
      title: "Not found",
      detail: "Could not find path: " + req.path,
    },
  });
});

export default router;
