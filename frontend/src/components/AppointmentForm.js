// AppointmentForm.js
// Form for booking an appointment for a selected time slot.
import React, { useState } from 'react';

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
    // If modifying, cancel the old appointment first
    if (timeSlot.previousAppointment && timeSlot.previousAppointment.cancellationToken) {
      await fetch(`/api/appointments/cancel/${timeSlot.previousAppointment.cancellationToken}`, { method: 'DELETE' });
    }
    // Now book the new appointment
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
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: <input value={customerName} onChange={e => setCustomerName(e.target.value)} required /></label>
        </div>
        <div>
          <label>Email: <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required /></label>
        </div>
        <div>
          <label>Phone: <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required /></label>
        </div>
        <div>
          <label>Service: <input value={service} onChange={e => setService(e.target.value)} required /></label>
        </div>
        <div>
          <label>Location: <input value={location} onChange={e => setLocation(e.target.value)} required /></label>
        </div>
        <div>
          <button type="submit">Book</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default AppointmentForm; 