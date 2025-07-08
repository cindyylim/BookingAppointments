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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
    timeSlots.filter(ts => ts.available).map(ts => {
      const start = new Date(ts.startTime);
      const end = new Date(ts.endTime);
      const localStart = new Date(
        start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(),
        start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds()
      );
      const localEnd = new Date(
        end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(),
        end.getUTCHours(), end.getUTCMinutes(), end.getUTCSeconds()
      );
      return {
        id: ts.id,
        title: 'Available',
        start: localStart,
        end: localEnd,
        resource: ts,
      };
    }),
    [timeSlots]
  );

  const handleSelectEvent = event => {
    onBook(event.resource);
  };

  if (loading) return <div>Loading time slots...</div>;

  return (
    <Card elevation={3} sx={{ p: 3, mt: 4 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Available Time Slots</Typography>
        <Box sx={{ mb: 2 }}>
          <Button onClick={() => setView(Views.WEEK)} disabled={view === Views.WEEK} variant={view === Views.WEEK ? 'contained' : 'outlined'} sx={{ mr: 2 }}>Week View</Button>
          <Button onClick={() => setView(Views.DAY)} disabled={view === Views.DAY} variant={view === Views.DAY ? 'contained' : 'outlined'}>Day View</Button>
        </Box>
        <Box sx={{ height: 500, background: '#f8fafc', borderRadius: 2, p: 1 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
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
            components={{
              event: ({ event }) => (
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleTimeString()}<br/>
                    <strong>{event.title}</strong>
                  </Typography>
                </Box>
              )
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Click an available slot to book it.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TimeSlotList; 