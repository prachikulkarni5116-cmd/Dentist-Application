import React, { useEffect, useState } from "react";
import api from "../api";

const statusColors = {
  pending: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
  completed: "#3b82f6",
};

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("appointments");

  const loadData = async () => {
    const [a, p, pay] = await Promise.all([
      api.get("/appointments/my"),
      api.get("/prescriptions/my"),
      api.get("/payments/my"),
    ]);
    setAppointments(a.data);
    setPrescriptions(p.data);
    setPayments(pay.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePay = async (id) => {
    await api.put(`/payments/${id}/pay`);
    loadData();
  };

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>

      <div className="tabs">
        <button className={tab === "appointments" ? "tab active" : "tab"} onClick={() => setTab("appointments")}>
          Appointments
        </button>
        <button className={tab === "prescriptions" ? "tab active" : "tab"} onClick={() => setTab("prescriptions")}>
          Prescriptions
        </button>
        <button className={tab === "payments" ? "tab active" : "tab"} onClick={() => setTab("payments")}>
          Payments
        </button>
      </div>

      {tab === "appointments" && (
        <div className="card-list">
          {appointments.length === 0 && <p>No appointments yet. Book one from the home page.</p>}
          {appointments.map((a) => (
            <div className="card" key={a._id}>
              <div className="card-row">
                <strong>{a.treatmentType}</strong>
                <span className="status-badge" style={{ backgroundColor: statusColors[a.status] }}>
                  {a.status}
                </span>
              </div>
              <p>📅 {a.date} at {a.time}</p>
              {a.notes && <p className="muted">Notes: {a.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "prescriptions" && (
        <div className="card-list">
          {prescriptions.length === 0 && <p>No prescriptions yet.</p>}
          {prescriptions.map((p) => (
            <div className="card" key={p._id}>
              <strong>{p.appointment?.treatmentType}</strong>
              <p>📅 {p.appointment?.date} at {p.appointment?.time}</p>
              <p><b>Medicines:</b> {p.medicines}</p>
              {p.advice && <p><b>Advice:</b> {p.advice}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="card-list">
          {payments.length === 0 && <p>No bills yet.</p>}
          {payments.map((pay) => (
            <div className="card" key={pay._id}>
              <div className="card-row">
                <strong>{pay.appointment?.treatmentType}</strong>
                <span className="status-badge" style={{ backgroundColor: pay.status === "paid" ? "#10b981" : "#f59e0b" }}>
                  {pay.status}
                </span>
              </div>
              <p>Amount: ₹{pay.amount} ({pay.method})</p>
              {pay.status === "pending" && (
                <button className="btn-primary" onClick={() => handlePay(pay._id)}>
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
