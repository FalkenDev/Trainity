import mongoose from "mongoose";
const { Schema } = mongoose;

const SetSchema = new Schema(
  {
    setNumber: { type: Number, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    rpe: { type: Number },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const WorkoutSessionExerciseSchema = new Schema(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    exerciseSnapshot: {
      name: String,
      description: String,
      img: String,
      muscleGroups: [String],
    },
    sets: { type: [SetSchema], required: true, default: [] },
  },
  { _id: false }
);

const WorkoutSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workoutId: { type: Schema.Types.ObjectId, ref: "Workout", required: true },
    workoutSnapshot: {
      title: String,
      description: String,
      time: Number,
      exercises: [
        {
          exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
          order: Number,
          sets: Number,
          reps: Number,
          weight: Number,
          pauseSeconds: Number,
        },
      ],
    },
    startedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["in_progress", "finished", "abandoned"],
      default: "in_progress",
    },
    endedAt: { type: Date },
    exercises: {
      type: [WorkoutSessionExerciseSchema],
      required: true,
      default: [],
    },
    totalWeight: { type: Number, default: 0 },
    exerciseStats: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
        totalWeight: { type: Number, default: 0 },
      },
    ],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const WorkoutSessionModel = mongoose.model(
  "WorkoutSession",
  WorkoutSessionSchema
);
export default WorkoutSessionModel;
