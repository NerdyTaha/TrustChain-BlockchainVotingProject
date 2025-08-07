import mongoose, { Schema } from "mongoose";

const ElectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    candidates: [
      {
        candidate: {
          type: Schema.Types.ObjectId,
          ref: "Candidate",
        },
        vote: {
          type: Number,
          default: 0,
        },
      },
    ],
    institution: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    result: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
    },
  },
  { timestamps: true }
);

const Election =
  mongoose.models.Election || mongoose.model("Election", ElectionSchema);
export default Election;
