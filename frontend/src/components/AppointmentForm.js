// AppointmentForm.js
// Form for booking an appointment for a selected time slot.
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function AppointmentForm({ timeSlot, onBooked, onCancel }) {
  const prev = timeSlot.previousAppointment || {};
  const [customerName, setCustomerName] = useState(prev.customerName || '');
  const [customerEmail, setCustomerEmail] = useState(prev.customerEmail || '');
  const [customerPhone, setCustomerPhone] = useState(prev.customerPhone || '');
  const [service, setService] = useState(prev.service || '');
  const [location, setLocation] = useState(prev.location || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (timeSlot.previousAppointment && timeSlot.previousAppointment.cancellationToken) {
      await fetch(`/api/appointments/cancel/${timeSlot.previousAppointment.cancellationToken}`, { method: 'DELETE' });
    }
    const token = localStorage.getItem('jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        timeSlotId: timeSlot.id,
        service,
        location
      })
    });
    if (res.ok) {
      const appointment = await res.json();
      onBooked(appointment);
    } else {
      setError('Failed to book appointment.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Book Appointment</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {new Date(timeSlot.startTime).toLocaleString()} - {new Date(timeSlot.endTime).toLocaleTimeString()}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={customerEmail}
          onChange={e => setCustomerEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Service"
          value={service}
          onChange={e => setService(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">Book</Button>
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>Cancel</Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Paper>
  );
}

export default AppointmentForm; 