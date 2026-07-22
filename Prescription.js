const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: { type: String, required: true }, // simple text area, e.g. "Amoxicillin 500mg - 1 tab twice a day for 5 days"
    advice: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
