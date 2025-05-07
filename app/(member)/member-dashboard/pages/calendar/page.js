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
        // Step 1: Fetch session and get userId (from the session)
        const resSession = await fetch('/api/session'); // Ensure this endpoint is implemented properly
        const sessionData = await resSession.json();
        const userId = sessionData.userId; // Extract userId from session

        if (!userId) {
          console.error("No userId found in session.");
          return;
        }
        // Step 2: Fetch the club_id for the logged-in president
        const clubRes = await fetch(`/api/Pres-Calendar?userId=${userId}`); // API route for fetching the club by userId
        const clubData = await clubRes.json();
        
        if (!clubData.clubId) {
          console.error("Club not found for this user");
          return;
        }

        const presidentClubId = clubData.clubId;

        // Step 3: Fetch events for the logged-in president's club
        const resEvents = await fetch('/api/activityrequests');
        const data = await resEvents.json();

        if (Array.isArray(data)) {
          // Filter events based on the logged-in president's club
          const approvedEvents = data
            .filter(event => event.status === 1) // Only approved events
            .filter(event => event.club_id === presidentClubId) // Only events for the president's club
            .map(event => ({
              id: event.id,
              title: `${event.title}`,
              start: formatDateTime(event.date, event.time), // Combine date and time
              allDay: false, // Ensures it appears in the correct time slot
              description: event.description,
              clubName: event.clubName,
              backgroundColor: "#00FFFF", // Blue for approved events
              textColor: "#fff",
              classNames: ['approved-event'], // Custom class for styling
            }));
          setEvents(approvedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchApprovedEvents();
  }, []);

  // Helper function to format date and time correctly
  const formatDateTime = (date, time) => {
    if (!date) return null;

    let formattedTime = "00:00:00"; // Default to midnight if no time provided
    if (time) {
      // Ensure time is in HH:MM:SS format
      const timeParts = time.split(":");
      formattedTime = timeParts.length === 3 ? time : `${time}:00`; // Handle missing seconds
    }

    return `${date.split('T')[0]}T${formattedTime}`;
  };

  // Handle event click (open modal)
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Club Events Calendar</h3>

      <div className="d-flex justify-content-left align-items-left mb-3">
        <Form.Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ width: '100px', display: 'inline-block' }}
        >
          {Array.from({ length: 11 }, (_, i) => currentYear + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </div>

      {/* FullCalendar Component */}
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
          eventClick={handleEventClick} // Event click handler
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }} // Show event time
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