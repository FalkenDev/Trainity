import WorkoutSession from "../schemas/WorkoutSessionSchema.js";
import Workout from "../schemas/WorkoutSchema.js";
import Exercise from "../schemas/ExerciseSchema.js";

const workoutSessionModel = {
  getWorkoutSessionList: async function (req, res) {
    try {
      const sessions = await WorkoutSession.find({ userId: req.user.id });
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWorkoutSession: async function (req, res) {
    try {
      const { workoutId } = req.body;
      const workout = await Workout.findById(workoutId);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      // Copy all fields you want to snapshot
      const workoutSnapshot = {
        title: workout.title,
        description: workout.description,
        time: workout.time,
        exercises: workout.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          pauseSeconds: ex.pauseSeconds,
        })),
      };

      const newSession = new WorkoutSession({
        userId: req.user.id,
        workoutId,
        workoutSnapshot,
        exercises: [],
        notes: "",
        startedAt: new Date(),
      });
      await newSession.save();
      res.status(201).json(newSession);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  addExerciseToSession: async function (req, res) {
    try {
      const sessionId = req.params.id;
      const { exerciseId, sets } = req.body;

      // Fetch the exercise to snapshot its data
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }

      // Build the snapshot
      const exerciseSnapshot = {
        name: exercise.name,
        description: exercise.description,
        img: exercise.img,
        muscleGroups: exercise.muscleGroups, // or populate and use names
      };

      // Build the exercise object for the session
      const exerciseObj = { exerciseId, exerciseSnapshot, sets };

      // Push the new exercise to the exercises array
      const updatedSession = await WorkoutSession.findOneAndUpdate(
        { _id: sessionId, userId: req.user.id },
        { $push: { exercises: exerciseObj } },
        { new: true, runValidators: true }
      );

      if (!updatedSession) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.status(200).json(updatedSession);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  finishWorkoutSession: async function (req, res) {
    try {
      const { completedExercises, notes: sessionNotes } = req.body;

      const sessionId = req.params.id;

      const session = await WorkoutSession.findOne({
        _id: sessionId,
        userId: req.user.id,
      });

      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      if (session.status === "finished") {
        return res
          .status(400)
          .json({ message: "Session is already finished." });
      }

      const exerciseIds = completedExercises.map((ex) => ex.exerciseId);
      const exerciseDetails = await Exercise.find({
        _id: { $in: exerciseIds },
      });
      const exerciseMap = new Map(
        exerciseDetails.map((ex) => [ex._id.toString(), ex])
      );

      const sessionExercises = completedExercises.map((completedEx) => {
        const details = exerciseMap.get(completedEx.exerciseId);
        return {
          exerciseId: completedEx.exerciseId,
          sets: completedEx.sets,
          rpe: completedEx.rpe || null,
          notes: completedEx.notes,
          exerciseSnapshot: {
            name: details.name,
            description: details.description,
            img: details.img,
            muscleGroups: details.muscleGroups,
          },
        };
      });

      let totalWeight = 0;
      const exerciseStats = sessionExercises.map((ex) => {
        const exerciseTotalWeight = ex.sets.reduce(
          (sum, set) => sum + set.weight * set.reps,
          0
        );
        totalWeight += exerciseTotalWeight;
        return {
          exerciseId: ex.exerciseId,
          totalWeight: exerciseTotalWeight,
        };
      });

      session.exercises = sessionExercises;
      session.status = "finished";
      session.endedAt = new Date();
      session.notes = sessionNotes || session.notes;

      // Calculate stats
      let totalWeight = 0;
      const exerciseStats = [];

      for (const ex of session.exercises) {
        let exTotal = 0;
        for (const set of ex.sets) {
          exTotal += set.weight * set.reps;
        }
        exerciseStats.push({
          exerciseId: ex.exerciseId,
          totalWeight: exTotal,
        });
        totalWeight += exTotal;
      }

      // Update session fields
      session.status = "finished";
      session.endedAt = new Date();
      session.totalWeight = totalWeight;
      session.exerciseStats = exerciseStats;

      await session.save();
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  abandonWorkoutSession: async function (req, res) {
    try {
      const sessionId = req.params.id;
      const session = await WorkoutSession.findOne({
        _id: sessionId,
        userId: req.user.id,
      });
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      if (session.status === "abandoned") {
        return res
          .status(400)
          .json({ message: "Session is already abandoned." });
      }
      session.status = "abandoned";
      session.endedAt = new Date();
      await session.save();
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWorkoutSession: async function (req, res) {
    try {
      const session = await WorkoutSession.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })
        .populate("workoutId")
        .populate("exercises.exerciseId");

      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }

      // Prepare response: prefer populated, else snapshot
      const sessionObj = session.toObject();

      // For workout
      sessionObj.workout = sessionObj.workoutId || sessionObj.workoutSnapshot;
      delete sessionObj.workoutId;
      delete sessionObj.workoutSnapshot;

      // For each exercise
      sessionObj.exercises = sessionObj.exercises.map((ex) => {
        return {
          ...ex,
          exercise:
            ex.exerciseId && typeof ex.exerciseId === "object"
              ? ex.exerciseId
              : ex.exerciseSnapshot,
        };
      });

      // Optionally remove exerciseId and exerciseSnapshot from each exercise
      sessionObj.exercises.forEach((ex) => {
        delete ex.exerciseId;
        delete ex.exerciseSnapshot;
      });

      res.status(200).json(sessionObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateWorkoutSession: async function (req, res) {
    try {
      const updatedSession = await WorkoutSession.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedSession) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.status(200).json(updatedSession);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteWorkoutSession: async function (req, res) {
    try {
      const deletedSession = await WorkoutSession.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
      if (!deletedSession) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.status(200).json({ message: "Workout session deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default workoutSessionModel;
