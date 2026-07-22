const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    treatmentType: {
      type: String,
      required: true,
      enum: [
        "OPD (General Checkup)",
        "Root Canal Treatment",
        "Tooth Extraction",
        "Braces / Orthodontics",
        "Teeth Cleaning",
        "Teeth Whitening",
      ],
    },
    date: { type: String, required: true }, // e.g. "2026-07-15"
    time: { type: String, required: true }, // e.g. "10:30 AM"
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
