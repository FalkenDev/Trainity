import mongoose from "mongoose";
const { Schema } = mongoose;

const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    img: { type: String, trim: true },
    muscleGroups: [
      {
        type: Schema.Types.ObjectId,
        ref: "MuscleGroup",
        required: true,
      },
    ],
    defaultSets: { type: Number, required: true },
    defaultReps: { type: Number, required: true },
    defaultPauseSeconds: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);
export default ExerciseModel;
