// UserDashboard.js
import React from 'react';

const UserDashboard = ({ user, bookings, onCancel, onProfileUpdate }) => {
  return (
    <div style={{maxWidth: 600, margin: 'auto'}}>
      <h2>Welcome, {user.username}</h2>
      <h3>Upcoming Bookings</h3>
      <ul>
        {bookings.upcoming.map(b => (
          <li key={b.id}>
            {new Date(b.timeSlot.startTime).toLocaleString()} - {b.service} @ {b.location}
            <button onClick={() => onCancel(b)}>Cancel</button>
          </li>
        ))}
      </ul>
      <h3>Booking History</h3>
      <ul>
        {bookings.history.map(b => (
          <li key={b.id}>
            {new Date(b.timeSlot.startTime).toLocaleString()} - {b.service} @ {b.location}
          </li>
        ))}
      </ul>
      <h3>Edit Profile</h3>
      <form onSubmit={onProfileUpdate}>
        <div>
          <label>Email: <input defaultValue={user.email} name="email" /></label>
        </div>
        <div>
          <label>Phone: <input defaultValue={user.phone} name="phone" /></label>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserDashboard; 