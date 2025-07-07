// TimeSlotList.js
// Lists all available time slots and allows the user to book one, now in a calendar view.
import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function TimeSlotList({ onBook }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch('/api/timeslots')
      .then(res => res.json())
      .then(data => {
        setTimeSlots(data);
        setLoading(false);
      });
  }, []);

  const events = useMemo(() =>
    timeSlots.filter(ts => ts.available).map(ts => ({
      id: ts.id,
      title: 'Available',
      start: new Date(ts.startTime),
      end: new Date(ts.endTime),
      resource: ts,
    })),
    [timeSlots]
  );

  const handleSelectEvent = event => {
    onBook(event.resource);
  };

  if (loading) return <div>Loading time slots...</div>;

  return (
    <div>
      <h2>Available Time Slots</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={{ week: true, day: true }}
        view={view}
        date={date}
        onView={setView}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        selectable={false}
        popup
        defaultView={Views.WEEK}
        messages={{ week: 'Week', day: 'Day' }}
      />
      <div style={{marginTop: 10}}>
        <button onClick={() => setView(Views.WEEK)} disabled={view === Views.WEEK}>Week View</button>
        <button onClick={() => setView(Views.DAY)} disabled={view === Views.DAY} style={{marginLeft: 10}}>Day View</button>
      </div>
      <p style={{marginTop: 10}}>Click an available slot to book it.</p>
    </div>
  );
}

export default TimeSlotList; 