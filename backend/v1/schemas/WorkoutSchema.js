import mongoose from "mongoose";
const { Schema } = mongoose;

const WorkoutExerciseSchema = new Schema(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    order: { type: Number, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    pauseSeconds: { type: Number, required: true },
  },
  { _id: false }
);

const WorkoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    time: { type: Number, required: true },
    exercises: { type: [WorkoutExerciseSchema], required: true, default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const WorkoutModel = mongoose.model("Workout", WorkoutSchema);
export default WorkoutModel;
