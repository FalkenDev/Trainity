import Workout from "../schemas/WorkoutSchema.js";
import WorkoutSession from "../schemas/WorkoutSessionSchema.js";
import Exercise from "../schemas/ExerciseSchema.js";

const workoutModel = {
  getWorkoutList: async function (req, res) {
    try {
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

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWorkout: async function (req, res) {
    try {
      const newWorkout = new Workout({ ...req.body, createdBy: req.user.id });
      await newWorkout.save();
      res.status(201).json(newWorkout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  addExerciseToWorkout: async function (req, res) {
    const { exerciseId, order, sets, reps, weight, pauseSeconds } = req.body;
    console.log("Adding exercise to workout:", {
      exerciseId,
      order,
      sets,
      reps,
      weight,
      pauseSeconds,
    });
    try {
      const workout = await Workout.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      const exercise = await Exercise.findById(exerciseId);

      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }

      const newExercise = {
        exerciseId,
        order: order || workout.exercises.length + 1, // Default to next order if not provided
        sets: sets || exercise.defaultSets,
        reps: reps || exercise.defaultReps,
        weight: weight || 0, // Default to 0 if not provided
        pauseSeconds: pauseSeconds || exercise.defaultPauseSeconds,
      };

      workout.exercises.push(newExercise);
      await workout.save();

      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateExerciseInWorkout: async function (req, res) {
    const { order, sets, reps, weight, pauseSeconds } = req.body;

    try {
      const workout = await Workout.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      const oldIndex = workout.exercises.findIndex(
        (e) => e.exerciseId.toString() === req.params.exerciseId
      );

      if (oldIndex === -1) {
        return res
          .status(404)
          .json({ message: "Exercise not found in workout" });
      }

      if (order !== undefined && order !== workout.exercises[oldIndex].order) {
        const [itemToMove] = workout.exercises.splice(oldIndex, 1);

        itemToMove.sets = sets ?? itemToMove.sets;
        itemToMove.reps = reps ?? itemToMove.reps;
        itemToMove.weight = weight ?? itemToMove.weight;
        itemToMove.pauseSeconds = pauseSeconds ?? itemToMove.pauseSeconds;

        const numExercises = workout.exercises.length;
        const newOrder = Math.max(1, Math.min(order, numExercises + 1));
        const newIndex = newOrder - 1;

        workout.exercises.splice(newIndex, 0, itemToMove);

        workout.exercises.forEach((ex, index) => {
          ex.order = index + 1;
        });
      } else {
        const exerciseToUpdate = workout.exercises[oldIndex];
        exerciseToUpdate.sets = sets ?? exerciseToUpdate.sets;
        exerciseToUpdate.reps = reps ?? exerciseToUpdate.reps;
        exerciseToUpdate.weight = weight ?? exerciseToUpdate.weight;
        exerciseToUpdate.pauseSeconds =
          pauseSeconds ?? exerciseToUpdate.pauseSeconds;
      }

      await workout.save();
      res.status(200).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  removeExerciseFromWorkout: async function (req, res) {
    try {
      const workout = await Workout.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      const exerciseIndex = workout.exercises.findIndex(
        (e) => e.exerciseId.toString() === req.params.exerciseId
      );

      if (exerciseIndex === -1) {
        return res
          .status(404)
          .json({ message: "Exercise not found in workout" });
      }

      workout.exercises.splice(exerciseIndex, 1);
      await workout.save();
      res.status(200).json({ message: "Exercise removed from workout" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWorkout: async function (req, res) {
    try {
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
      const allowedUpdates = [
        "title",
        "description",
        "time",
        "defaultWeightAndReps",
      ];
      const updates = {};
      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        updates,
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

      const deletedWorkout = await Workout.findOneAndDelete({
        _id: workoutId,
        createdBy: req.user.id,
      });
      if (!deletedWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }

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

  duplicateWorkout: async function (req, res) {
    try {
      const originalWorkout = await Workout.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!originalWorkout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      const baseTitle = originalWorkout.title.replace(/\s\(\d+\)$/, "");
      const regex = new RegExp(`^${baseTitle}( \\(\\d+\\))?$`);
      const existingCopies = await Workout.find({
        title: regex,
        createdBy: req.user.id,
      });

      let copyNumber = 1;
      if (existingCopies.length > 0) {
        const numbers = existingCopies.map((w) => {
          const match = w.title.match(/\((\d+)\)$/);
          return match ? parseInt(match[1], 10) : 0;
        });
        copyNumber = Math.max(...numbers) + 1;
      }

      const { _id, ...workoutData } = originalWorkout.toObject();

      const newWorkout = new Workout({
        ...workoutData,
        title: `${baseTitle} (${copyNumber})`,
        createdBy: req.user.id,
      });

      await newWorkout.save();
      res.status(201).json(newWorkout);
    } catch (error) {
      // Check for the specific duplicate key error for a more precise message
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ error: "A document with this key already exists." });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

export default workoutModel;
