import React, { useState } from 'react';
import TimeSlotList from './components/TimeSlotList';
import AppointmentForm from './components/AppointmentForm';
import BookingSuccess from './components/BookingSuccess';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import TimeSlotAdmin from './components/TimeSlotAdmin';

function App() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [user, setUser] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userBookings, setUserBookings] = useState({ upcoming: [], history: [] });
  const [guestMode, setGuestMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleBook = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBooked = (appointment) => {
    setSelectedTimeSlot(null);
    setLastAppointment(appointment);
    setBookingSuccess(true);
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setSelectedTimeSlot(null);
  };

  const handleModify = () => {
    setBookingSuccess(false);
    setSelectedTimeSlot({
      ...lastAppointment.timeSlot,
      previousAppointment: lastAppointment
    });
  };

  const handleCancelBooking = async (appt) => {
    const token = localStorage.getItem('jwt');
    await fetch(`/api/appointments/cancel/${appt.cancellationToken}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    fetchUserBookings();
  };

  const handleAuth = (userObj) => {
    setUser(userObj);
    setShowDashboard(true);
    fetchUserBookings();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    setShowDashboard(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const form = e.target;
    const email = form.email.value;
    const phone = form.phone.value;
    await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ email, phone })
    });
    fetchUserBookings();
  };

  const handleBackToBooking = () => {
    setBookingSuccess(false);
    setLastAppointment(null);
    setSelectedTimeSlot(null);
    setShowDashboard(false);
  };

  const handleAdminLogin = (userObj) => {
    setUser(userObj);
    setShowDashboard(false);
    setShowAdminLogin(false);
    setAdminError(null);
    setIsAdmin(true);
    // fetchUserBookings(); // Only if admin should see user dashboard
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
    setUser(null);
  };

  const fetchUserBookings = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    const res = await fetch('/api/user/appointments', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      setUserBookings(await res.json());
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Booking System</h1>
      <button onClick={() => setShowAdminLogin(true)} style={{float: 'right'}}>Admin Login</button>
      {showAdminLogin && (
        <div style={{background: '#fff', border: '1px solid #ccc', padding: 20, position: 'absolute', top: 60, right: 20, zIndex: 1000}}>
          <AdminLogin onLogin={handleAdminLogin} error={adminError} />
          <button onClick={() => setShowAdminLogin(false)} style={{marginTop: 10}}>Close</button>
        </div>
      )}
      {isAdmin && (
        <div style={{marginTop: 30}}>
          <button onClick={handleAdminLogout} style={{marginBottom: 10}}>Admin Logout</button>
          <TimeSlotAdmin />
        </div>
      )}
      {!isAdmin && user && (
        <>
          <button onClick={() => {setShowDashboard(!showDashboard); fetchUserBookings()}}>
            {showDashboard ? 'Back to Booking' : 'Dashboard'}
          </button>
          <button onClick={handleLogout} style={{marginLeft: 10}}>Logout</button>
        </>
      )} 
      {!isAdmin && !user && (
        <button onClick={() => { setShowDashboard(false); setGuestMode(true); }}>Continue as Guest</button>
      )}
      {showDashboard && user ? (
        <UserDashboard
          user={user}
          bookings={userBookings}
          onCancel={handleCancelBooking}
          onProfileUpdate={handleProfileUpdate}
        />
      ) : !user && !bookingSuccess && !selectedTimeSlot && !guestMode ? (
        <Auth onAuth={handleAuth} />
      ) : bookingSuccess && lastAppointment ? (
        <BookingSuccess
          appointment={lastAppointment}
          onModify={handleModify}
          onCancel={handleCancelBooking}
          onBackToBooking={handleBackToBooking}
        />
      ) : selectedTimeSlot ? (
        <AppointmentForm
          timeSlot={selectedTimeSlot}
          onBooked={appointment => handleBooked(appointment)}
          onCancel={handleCancel}
        />
      ) : (
        <TimeSlotList onBook={handleBook} key={refresh} />
      )}
    </div>
  );
}

export default App;
