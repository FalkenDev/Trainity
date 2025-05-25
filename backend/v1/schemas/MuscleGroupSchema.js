import mongoose from "mongoose";
const { Schema } = mongoose;

const MuscleGroupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const MuscleGroupModel = mongoose.model("MuscleGroup", MuscleGroupSchema);
export default MuscleGroupModel;
