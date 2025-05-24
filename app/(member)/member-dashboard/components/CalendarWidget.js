'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarWidget = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const resSession = await fetch('/api/session');
        const sessionData = await resSession.json();
        const userId = sessionData.userId;

        const clubRes = await fetch(`/api/mem-calendar?userId=${userId}`);
        const clubData = await clubRes.json();

        const resEvents = await fetch('/api/activityrequests');
        const data = await resEvents.json();

        const approvedEvents = data
          .filter(e => e.status === 1 && e.club_id === clubData.clubId)
          .map(event => ({
            id: event.id,
            title: event.title,
            start: formatDate(event.date),
            allDay: true,
            backgroundColor: '#007bff',
            textColor: '#fff',
          }));

        setEvents(approvedEvents);
      } catch (error) {
        console.error("CalendarWidget error:", error);
      }
    };

    fetchApprovedEvents();
  }, []);

  const formatDate = (date) => {
    return date?.split('T')[0] || null;
  };

  return (
    <div style={{ maxWidth: '100%', height: '400px', overflowY: 'auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        height="100%"
        events={events}
        dayMaxEventRows={2}
      />
      <style jsx global>{`
        .fc {
          font-size: 12px;
        }

        .fc .fc-daygrid-event {
          padding: 2px 4px;
          border-radius: 4px;
        }

        .fc-toolbar-title {
          font-size: 16px;
        }

        .fc-button {
          background-color: #007bff !important;
          border: none;
          padding: 4px 8px;
        }

        .fc-button:hover {
          background-color: #0056b3 !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarWidget;
