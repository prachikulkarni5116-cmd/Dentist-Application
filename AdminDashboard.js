import React, { useEffect, useState } from "react";
import api from "../api";

const statusColors = {
  pending: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
  completed: "#3b82f6",
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // { type: 'prescription'|'payment', appointment }
  const [medicines, setMedicines] = useState("");
  const [advice, setAdvice] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  const loadAppointments = async () => {
    const res = await api.get("/appointments");
    setAppointments(res.data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    loadAppointments();
  };

  const openPrescriptionForm = (appointment) => {
    setActiveForm({ type: "prescription", appointment });
    setMedicines("");
    setAdvice("");
  };

  const openPaymentForm = (appointment) => {
    setActiveForm({ type: "payment", appointment });
    setAmount("");
    setMethod("cash");
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    await api.post("/prescriptions", {
      appointmentId: activeForm.appointment._id,
      patientId: activeForm.appointment.patient._id,
      medicines,
      advice,
    });
    setActiveForm(null);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    await api.post("/payments", {
      appointmentId: activeForm.appointment._id,
      patientId: activeForm.appointment.patient._id,
      amount,
      method,
    });
    setActiveForm(null);
  };

  return (
    <div className="dashboard">
      <h1>Admin / Dentist Dashboard</h1>
      <p className="muted">Manage patient appointment requests, write prescriptions and create bills.</p>

      <div className="card-list">
        {appointments.length === 0 && <p>No appointment requests yet.</p>}
        {appointments.map((a) => (
          <div className="card" key={a._id}>
            <div className="card-row">
              <strong>{a.treatmentType}</strong>
              <span className="status-badge" style={{ backgroundColor: statusColors[a.status] }}>
                {a.status}
              </span>
            </div>
            <p>👤 {a.patient?.name} ({a.patient?.email}) {a.patient?.phone ? `- ${a.patient.phone}` : ""}</p>
            <p>📅 {a.date} at {a.time}</p>
            {a.notes && <p className="muted">Notes: {a.notes}</p>}

            <div className="card-actions">
              {a.status === "pending" && (
                <>
                  <button className="btn-primary" onClick={() => handleStatus(a._id, "accepted")}>Accept</button>
                  <button className="btn-danger" onClick={() => handleStatus(a._id, "rejected")}>Reject</button>
                </>
              )}
              {a.status === "accepted" && (
                <>
                  <button className="btn-secondary" onClick={() => openPrescriptionForm(a)}>Add Prescription</button>
                  <button className="btn-secondary" onClick={() => openPaymentForm(a)}>Create Bill</button>
                  <button className="btn-primary" onClick={() => handleStatus(a._id, "completed")}>Mark Completed</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeForm && activeForm.type === "prescription" && (
        <div className="modal-overlay" onClick={() => setActiveForm(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add Prescription</h2>
            <p className="modal-subtitle">
              For {activeForm.appointment.patient?.name} — {activeForm.appointment.treatmentType}
            </p>
            <form onSubmit={submitPrescription}>
              <label>Medicines</label>
              <textarea
                required
                placeholder="e.g. Amoxicillin 500mg - twice daily for 5 days"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
              />
              <label>Advice (optional)</label>
              <textarea value={advice} onChange={(e) => setAdvice(e.target.value)} />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeForm && activeForm.type === "payment" && (
        <div className="modal-overlay" onClick={() => setActiveForm(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Create Bill</h2>
            <p className="modal-subtitle">
              For {activeForm.appointment.patient?.name} — {activeForm.appointment.treatmentType}
            </p>
            <form onSubmit={submitPayment}>
              <label>Amount (₹)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              <label>Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
