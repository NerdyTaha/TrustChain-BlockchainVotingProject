import mongoose, { Schema } from "mongoose";

const VoterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    taluka: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  epicId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "voter",
  },
});

const Voter = mongoose.models.Voter || mongoose.model("Voter", VoterSchema);

export default Voter;
