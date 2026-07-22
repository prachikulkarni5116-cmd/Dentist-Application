const express = require("express");
const Appointment = require("../models/Appointment");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// @route  POST /api/appointments  (patient books an appointment)
router.post("/", protect, async (req, res) => {
  try {
    const { treatmentType, date, time, notes } = req.body;
    if (!treatmentType || !date || !time) {
      return res.status(400).json({ message: "Treatment type, date and time are required" });
    }
    const appointment = await Appointment.create({
      patient: req.user.id,
      treatmentType,
      date,
      time,
      notes,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/appointments/my  (patient's own appointments)
router.get("/my", protect, async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user.id }).sort({ createdAt: -1 });
  res.json(appointments);
});

// @route  GET /api/appointments  (admin/dentist views all requests)
router.get("/", protect, adminOnly, async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email phone")
    .sort({ createdAt: -1 });
  res.json(appointments);
});

// @route  PUT /api/appointments/:id/status  (admin accepts/rejects/completes)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected" | "completed"
    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
