import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    electionHistory: [
      {
        electionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Election",
        },
        winner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
        },
      },
    ],
  },
  { timestamps: true }
);

const Institution =
  mongoose.models.Institution ||
  mongoose.model("Institution", institutionSchema);
export default Institution;
