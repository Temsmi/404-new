'use client';

import { useState, useRef } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [description, setDescription] = useState('');

  const clubs = ['Club A', 'Club B', 'Club C'];
  const calendarRef = useRef(null);

  // Function to generate years from the current year to the next 10 years
  const generateYears = () => {
    return Array.from({ length: 11 }, (_, i) => currentYear + i);
  };

  // Handle date click (open modal)
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowForm(true);
  };

  // Handle form submission
  const handleAddEvent = () => {
    if (!eventTitle || !selectedClub) {
      alert('Please fill in all fields!');
      return;
    }

    const newEvent = {
      title: `${eventTitle} (${selectedClub})`,
      start: selectedDate,
      description: description,
    };

    setEvents([...events, newEvent]);
    setShowForm(false);
    setEventTitle('');
    setSelectedClub('');
    setDescription('');
  };

  // Navigate to selected year without resetting to January
  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setSelectedYear(newYear);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate(); // Keep the current month
      calendarApi.gotoDate(new Date(newYear, currentDate.getMonth(), 1));
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Club Events Calendar</h3>

      {/* Custom Toolbar */}
      <div className="d-flex justify-content-left align-items-left mb-3">
        <Form.Select
          value={selectedYear}
          onChange={handleYearChange} // Now correctly updates year while keeping month
          style={{ width: '100px', display: 'inline-block' }}
        >
          {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Event Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Club</Form.Label>
              <Form.Select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
                <option value="">Select Club</option>
                {clubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddEvent}>Add Event</Button>
        </Modal.Footer>
      </Modal>

      {/* FullCalendar Component */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          initialView="dayGridMonth"
          initialDate={new Date()} // Ensure the calendar starts on the current month
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          events={events}
          height="auto"
          dateClick={handleDateClick}
        />
      </div>
    </Container>
  );
};

export default CalendarPage;
