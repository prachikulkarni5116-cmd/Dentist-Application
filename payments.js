const express = require("express");
const Payment = require("../models/Payment");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// @route  POST /api/payments  (admin creates a bill for an appointment)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { appointmentId, patientId, amount, method } = req.body;
    if (!appointmentId || !patientId || !amount) {
      return res.status(400).json({ message: "appointmentId, patientId and amount are required" });
    }
    const payment = await Payment.create({
      appointment: appointmentId,
      patient: patientId,
      amount,
      method: method || "cash",
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  PUT /api/payments/:id/pay  (patient marks a bill as paid - simple mock payment)
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id },
      { status: "paid" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/payments/my
router.get("/my", protect, async (req, res) => {
  const payments = await Payment.find({ patient: req.user.id })
    .populate("appointment", "treatmentType date time")
    .sort({ createdAt: -1 });
  res.json(payments);
});

// @route  GET /api/payments  (admin views all)
router.get("/", protect, adminOnly, async (req, res) => {
  const payments = await Payment.find()
    .populate("patient", "name email")
    .populate("appointment", "treatmentType date time")
    .sort({ createdAt: -1 });
  res.json(payments);
});

module.exports = router;
