'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Form, Modal } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const resSession = await fetch('/api/session');
        const sessionData = await resSession.json();
        const userId = sessionData.userId;

        if (!userId) {
          console.error("No userId found in session.");
          return;
        }
        const clubRes = await fetch(`/api/mem-calendar?userId=${userId}`); 
        const clubData = await clubRes.json();
        
        if (!clubData.clubId) {
          console.error("Club not found for this user");
          return;
        }

        const presidentClubId = clubData.clubId;

        const resEvents = await fetch('/api/activityrequests');
        const data = await resEvents.json();

        if (Array.isArray(data)) {
          const approvedEvents = data
            .filter(event => event.status === 1) 
            .filter(event => event.club_id === presidentClubId) 
            .map(event => ({
              id: event.id,
              title: `${event.title}`,
              start: formatDateTime(event.date, event.time), 
              allDay: false,
              description: event.description,
              clubName: event.clubName,
              backgroundColor: "#00FFFF", 
              textColor: "#fff",
              classNames: ['approved-event'], 
            }));
          setEvents(approvedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchApprovedEvents();
  }, []);

  const formatDateTime = (date, time) => {
    if (!date) return null;

    let formattedTime = "00:00:00"; 
    if (time) {
      const timeParts = time.split(":");
      formattedTime = timeParts.length === 3 ? time : `${time}:00`; 
    }

    return `${date.split('T')[0]}T${formattedTime}`;
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

    const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setSelectedYear(newYear);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(`${newYear}-01-01`);
    }
  };
  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Club Events Calendar</h3>

      <div className="d-flex justify-content-left align-items-left mb-3">
        <Form.Select
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: '100px', display: 'inline-block' }}
        >
          {Array.from({ length: 11 }, (_, i) => currentYear + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          initialView="dayGridMonth"
          nowIndicator={true}
          selectable={true}
          events={events}
          eventClick={handleEventClick} 
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }} 
          height="auto"
        />
      </div>

      {/* Event Details Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Club:</strong> {selectedEvent.extendedProps.clubName}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Description:</strong> {selectedEvent.extendedProps.description || 'No description available'}</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        :global(.approved-event) {
          background-color: #007bff !important;
          color: #fff !important;
        }
      `}</style>
    </Container>
  );
};

export default CalendarPage;