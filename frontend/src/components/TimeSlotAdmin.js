// TimeSlotAdmin.js
// Admin interface to create and delete time slots.
import React, { useEffect, useState } from 'react';

function TimeSlotAdmin({ credentials }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const fetchTimeSlots = () => {
    fetch('/api/timeslots', {
      headers: credentials ? { 'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password) } : {}
    })
      .then(res => res.json())
      .then(data => {
        setTimeSlots(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!startTime || !endTime) {
      setError('Start and end time are required.');
      return;
    }
    // Convert local datetime to UTC ISO string
    const startUtc = new Date(startTime).toISOString();
    const endUtc = new Date(endTime).toISOString();
    const res = await fetch('/api/timeslots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startTime: startUtc,
        endTime: endUtc,
        available: true
      })
    });
    if (res.ok) {
      setStartTime('');
      setEndTime('');
      fetchTimeSlots();
    } else {
      setError('Failed to create time slot.');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/timeslots/${id}`, {
      method: 'DELETE',
      headers: credentials
        ? { 'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password) }
        : {}
    });
    fetchTimeSlots();
  };

  return (
    <div>
      <h2>Admin: Manage Time Slots</h2>
      <form onSubmit={handleCreate} style={{marginBottom: 20}}>
        <div>
          <label>Start Time: <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required /></label>
        </div>
        <div>
          <label>End Time: <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required /></label>
        </div>
        <button type="submit">Create Time Slot</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
      {loading ? <div>Loading time slots...</div> : (
        <ul>
          {timeSlots.map(ts => (
            <li key={ts.id}>
              {new Date(ts.startTime).toLocaleString()} - {new Date(ts.endTime).toLocaleString()} (Available: {ts.available ? 'Yes' : 'No'})
              <button style={{marginLeft: 10}} onClick={() => handleDelete(ts.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimeSlotAdmin; 