import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";

const treatments = [
  { name: "OPD (General Checkup)", icon: "🩺" },
  { name: "Root Canal Treatment", icon: "🦷" },
  { name: "Tooth Extraction", icon: "🔧" },
  { name: "Braces / Orthodontics", icon: "😬" },
  { name: "Teeth Cleaning", icon: "✨" },
  { name: "Teeth Whitening", icon: "⚪" },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [confirmation, setConfirmation] = useState("");

  const handleBoxClick = (treatmentName) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedTreatment(treatmentName);
  };

  const handleBooked = () => {
    setSelectedTreatment(null);
    setConfirmation("Appointment request sent! You can track its status in My Dashboard.");
    setTimeout(() => setConfirmation(""), 5000);
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to BrightSmile Dental Clinic</h1>
        <p>Book your dental treatment in a few clicks. Pick a service below to get started.</p>
      </section>

      {confirmation && <div className="banner-success">{confirmation}</div>}

      <section className="treatment-grid">
        {treatments.map((t) => (
          <div key={t.name} className="treatment-box" onClick={() => handleBoxClick(t.name)}>
            <div className="treatment-icon">{t.icon}</div>
            <h3>{t.name}</h3>
            <button className="btn-primary">Book Appointment</button>
          </div>
        ))}
      </section>

      {selectedTreatment && (
        <BookingModal
          treatmentType={selectedTreatment}
          onClose={() => setSelectedTreatment(null)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
};

export default Home;
