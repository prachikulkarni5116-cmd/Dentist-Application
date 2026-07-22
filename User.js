const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
    // "admin" role = dentist/doctor who manages the clinic
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
