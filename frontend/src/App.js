import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import BookingSuccess from './components/BookingSuccess';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import TimeSlotAdmin from './components/TimeSlotAdmin';
import TimeSlotList from './components/TimeSlotList';
import AppointmentForm from './components/AppointmentForm';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f8fafc' },
  },
  shape: { borderRadius: 12 },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Salon Booking System
          </Typography>
          <Button color="inherit" onClick={() => setShowAdminLogin(true)} sx={{ fontWeight: 600 }}>Admin Login</Button>
        </Toolbar>
      </AppBar>
      {showAdminLogin && (
        <Box sx={{ background: '#fff', border: '1px solid #ccc', p: 3, position: 'absolute', top: 80, right: 40, zIndex: 1000, borderRadius: 2 }}>
          <AdminLogin onLogin={handleAdminLogin} error={adminError} />
          <Button onClick={() => setShowAdminLogin(false)} sx={{ mt: 2 }}>Close</Button>
        </Box>
      )}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section */}
        {!user && !isAdmin && !bookingSuccess && !selectedTimeSlot && !showDashboard && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Effortless Salon Scheduling
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
              Book appointments, manage your schedule, and grow your business with our modern, easy-to-use platform.
            </Typography>
            <Button variant="contained" size="large" color="primary" onClick={() => setGuestMode(true)} sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 600 }}>
              Book Now
            </Button>
          </Box>
        )}
        {/* Admin View */}
        {isAdmin && (
          <Box sx={{ mt: 4 }}>
            <Button onClick={handleAdminLogout} variant="outlined" color="secondary" sx={{ mb: 2 }}>Admin Logout</Button>
            <TimeSlotAdmin />
          </Box>
        )}
        {/* User/Guest/Dashboard Logic (rest of your app) */}
        {!isAdmin && (
          user ? (
            <>
              <Button onClick={() => setShowDashboard(!showDashboard)} variant="outlined" sx={{ mr: 2, mb: 2 }}>
                {showDashboard ? 'Back to Booking' : 'Dashboard'}
              </Button>
              <Button onClick={handleLogout} variant="outlined" color="secondary" sx={{ mb: 2 }}>Logout</Button>
            </>
          ) : null
        )}
        {!isAdmin && showDashboard && user ? (
          <UserDashboard
            user={user}
            bookings={userBookings}
            onCancel={handleCancelBooking}
            onProfileUpdate={handleProfileUpdate}
          />
        ) : !user && !bookingSuccess && !selectedTimeSlot && !guestMode && !isAdmin ? (
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
        ) : (!isAdmin && (
          <TimeSlotList onBook={handleBook} key={refresh} />
        ))}
      </Container>
    </ThemeProvider>
  );
}

export default App;
