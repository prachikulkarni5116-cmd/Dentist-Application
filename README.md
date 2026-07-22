# BrightSmile Dental Clinic — MERN Stack App (Simple Version)

A simple appointment booking website for a dental clinic.

- **Patients** can register/login, click a treatment box (OPD, Root Canal, Extraction, Braces, Cleaning, Whitening) on the homepage, and book an appointment.
- **Admin (Dentist)** logs in to a dashboard, sees all appointment requests, and can **Accept / Reject** them.
- Once accepted, the admin can add a **Prescription** and create a **Bill (Payment)** for that appointment.
- Patients can view their appointment status, prescriptions, and pay their bills from their own dashboard.
- All data is stored in **MongoDB** using Mongoose.

## Tech Stack
- **Frontend:** React (Create React App), React Router, Axios
- **Backend:** Node.js, Express, JWT auth, bcrypt password hashing
- **Database:** MongoDB (Mongoose)

## Folder Structure
```
dentist-app/
  server/     -> Express + MongoDB backend (API)
  client/     -> React frontend
```

## 1. Setup MongoDB
You need MongoDB running, either:
- Locally: install MongoDB Community Server and it will run at `mongodb://127.0.0.1:27017`
- Or free cloud DB: create a free cluster at https://www.mongodb.com/cloud/atlas and copy its connection string

## 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
```
Open `.env` and set:
```
MONGO_URI=mongodb://127.0.0.1:27017/dentist_app   (or your Atlas connection string)
JWT_SECRET=any_long_random_string
PORT=5000
```
Run the server:
```bash
npm run dev
```
(or `npm start` if you don't have nodemon)

You should see: `MongoDB connected` and `Server running on port 5000`.

## 3. Setup Frontend
Open a **new terminal**:
```bash
cd client
npm install
npm start
```
This opens the site at `http://localhost:3000`.

## 4. How to Use
1. Go to `http://localhost:3000/register`.
2. Register **one account as "Admin / Dentist"** (this is your clinic's own login) and **other accounts as "Patient"**.
3. As a Patient: go to Home page → click a treatment box (e.g. "Root Canal Treatment") → fill date/time → Confirm Booking.
4. Log out, log in as Admin → go to Admin Dashboard → you'll see the request → click **Accept** or **Reject**.
5. Once Accepted, Admin can click **Add Prescription** and **Create Bill** for that patient.
6. Log back in as the Patient → My Dashboard → check **Prescriptions** tab and **Payments** tab → click **Pay Now** to mark the bill as paid.

## Notes / Easiest-Version Simplifications
- Payment is a simple "mark as paid" mock — no real payment gateway is integrated. You can later plug in Razorpay/Stripe in `payments.js` routes.
- Anyone can register as "Admin / Dentist" for simplicity — in a real clinic you'd restrict admin signup (e.g. an invite code) so random patients can't become admin.
- One shared appointment list — good for a single dentist/clinic. For multiple dentists, you'd add a `dentist` field to appointments.
- Styling is plain CSS, kept intentionally simple so it's easy to edit.

## Possible Next Upgrades (once this works)
- Email/SMS notifications when appointment is accepted/rejected
- Real payment gateway (Razorpay/Stripe)
- Calendar-view of available slots instead of free date/time entry
- File upload for X-rays/photos in appointment notes
- Multiple dentists with individual schedules
