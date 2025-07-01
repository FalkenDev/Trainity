import Exercise from "../schemas/ExerciseSchema.js";
import Workout from "../schemas/WorkoutSchema.js";
import WorkoutSession from "../schemas/WorkoutSessionSchema.js";

const exerciseModel = {
  // GET all exercises for the user
  getExerciseList: async function (req, res) {
    try {
      const exercises = await Exercise.find({ createdBy: req.user.id });
      res.status(200).json(exercises);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST a new exercise
  createExercise: async function (req, res) {
    try {
      const newExercise = new Exercise({ ...req.body, createdBy: req.user.id });
      await newExercise.save();
      res.status(201).json(newExercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // GET a specific exercise by ID
  getExercise: async function (req, res) {
    try {
      const exercise = await Exercise.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(200).json(exercise);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT (update) a specific exercise by ID
  updateExercise: async function (req, res) {
    try {
      const updatedExercise = await Exercise.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedExercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // DELETE a specific exercise by ID
  deleteExercise: async function (req, res) {
    try {
      const exerciseId = req.params.id;

      // Delete the exercise
      const deletedExercise = await Exercise.findOneAndDelete({
        _id: exerciseId,
        createdBy: req.user.id,
      });
      if (!deletedExercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }

      // Remove from all workouts' exercises arrays
      await Workout.updateMany(
        { "exercises.exerciseId": exerciseId },
        { $pull: { exercises: { exerciseId: exerciseId } } }
      );

      // Remove from all workoutSnapshot.exercises in WorkoutSession
      await WorkoutSession.updateMany(
        { "workoutSnapshot.exercises.exerciseId": exerciseId },
        { $pull: { "workoutSnapshot.exercises": { exerciseId: exerciseId } } }
      );

      res.status(200).json({ message: "Exercise deleted everywhere" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default exerciseModel;
