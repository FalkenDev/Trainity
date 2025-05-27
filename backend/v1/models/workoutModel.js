import Workout from "../schemas/WorkoutSchema.js";
import mongoose from "mongoose";
import WorkoutSession from "../schemas/WorkoutSessionSchema.js";

const workoutModel = {
  getWorkoutList: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const workouts = await Workout.find({ createdBy: req.user.id }).populate(
        "exercises.exerciseId"
      );

      const result = workouts.map((workout) => ({
        ...workout.toObject(),
        exercises: workout.exercises.map((e) => ({
          _id: e._id,
          order: e.order,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          pauseSeconds: e.pauseSeconds,
          exercise: e.exerciseId ? e.exerciseId.toObject() : null,
        })),
      }));

      res.status(200).json(result); // <-- return the transformed data!
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWorkout: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const newWorkout = new Workout({ ...req.body, createdBy: req.user.id });
      await newWorkout.save();
      res.status(201).json(newWorkout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getWorkout: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const workout = await Workout.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateWorkout: async function (req, res) {
    try {
      await mongoose.connect(process.env.DBURI);
      console.log("Connected to MongoDB with Mongoose");
      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(200).json(updatedWorkout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteWorkout: async function (req, res) {
    try {
      const workoutId = req.params.id;

      // Delete the workout
      const deletedWorkout = await Workout.findOneAndDelete({
        _id: workoutId,
        createdBy: req.user.id,
      });
      if (!deletedWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      // Remove workoutId reference from all WorkoutSessions
      await WorkoutSession.updateMany(
        { workoutId: workoutId },
        { $unset: { workoutId: "" } }
      );

      res
        .status(200)
        .json({ message: "Workout deleted and references removed" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default workoutModel;
