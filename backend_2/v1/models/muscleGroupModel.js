import MuscleGroup from "../schemas/MuscleGroupSchema.js";
import Exercise from "../schemas/ExerciseSchema.js";
import WorkoutSession from "../schemas/WorkoutSessionSchema.js";

const muscleGroupModel = {
  getMuscleGroupList: async function (req, res) {
    try {
      const muscleGroups = await MuscleGroup.find();
      res.status(200).json(muscleGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createMuscleGroup: async function (req, res) {
    try {
      const newMuscleGroup = new MuscleGroup(req.body);
      await newMuscleGroup.save();
      res.status(201).json(newMuscleGroup);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getMuscleGroup: async function (req, res) {
    try {
      const muscleGroup = await MuscleGroup.findById(req.params.id);
      if (!muscleGroup) {
        return res.status(404).json({ message: "Muscle group not found" });
      }
      res.status(200).json(muscleGroup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateMuscleGroup: async function (req, res) {
    try {
      const updatedMuscleGroup = await MuscleGroup.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedMuscleGroup) {
        return res.status(404).json({ message: "Muscle group not found" });
      }
      res.status(200).json(updatedMuscleGroup);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteMuscleGroup: async function (req, res) {
    try {
      const muscleGroupId = req.params.id;

      // Delete the muscle group
      const deletedMuscleGroup = await MuscleGroup.findByIdAndDelete(
        muscleGroupId
      );
      if (!deletedMuscleGroup) {
        return res.status(404).json({ message: "Muscle group not found" });
      }

      // Remove from all exercises' muscleGroups arrays
      await Exercise.updateMany(
        { muscleGroups: muscleGroupId },
        { $pull: { muscleGroups: muscleGroupId } }
      );

      // Remove from all exerciseSnapshots in WorkoutSession.exercises
      await WorkoutSession.updateMany(
        { "exercises.exerciseSnapshot.muscleGroups": muscleGroupId },
        {
          $pull: {
            "exercises.$[].exerciseSnapshot.muscleGroups": muscleGroupId,
          },
        }
      );

      // Remove from all workoutSnapshot.exercises in WorkoutSession
      await WorkoutSession.updateMany(
        { "workoutSnapshot.exercises.muscleGroups": muscleGroupId },
        {
          $pull: {
            "workoutSnapshot.exercises.$[].muscleGroups": muscleGroupId,
          },
        }
      );

      res.status(200).json({ message: "Muscle group deleted everywhere" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default muscleGroupModel;
