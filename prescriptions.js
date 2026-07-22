const express = require("express");
const Prescription = require("../models/Prescription");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// @route  POST /api/prescriptions  (admin/dentist creates a prescription for an appointment)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, advice } = req.body;
    if (!appointmentId || !patientId || !medicines) {
      return res.status(400).json({ message: "appointmentId, patientId and medicines are required" });
    }
    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      medicines,
      advice,
    });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/prescriptions/my  (patient views their prescriptions)
router.get("/my", protect, async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user.id })
    .populate("appointment", "treatmentType date time")
    .sort({ createdAt: -1 });
  res.json(prescriptions);
});

// @route  GET /api/prescriptions  (admin views all)
router.get("/", protect, adminOnly, async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate("patient", "name email")
    .populate("appointment", "treatmentType date time")
    .sort({ createdAt: -1 });
  res.json(prescriptions);
});

module.exports = router;
