'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear); // Selected year state
  const [events, setEvents] = useState([]); // Store created events
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [description, setDescription] = useState('');

  const clubs = ['Club A', 'Club B', 'Club C']; // Example clubs
  const calendarRef = useRef(null); // Reference for FullCalendar

  // Function to generate years (5 before and after the current year)
  const generateYears = () => {
    return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
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

  // Use effect to update the calendar when year changes
  useEffect(() => {
    if (calendarRef.current) {
      // Goto the first day of the selected year
      calendarRef.current.getApi().gotoDate(`${selectedYear}-01-01`);
    }
  }, [selectedYear]);

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Club Events Calendar</h3>

      {/* Custom Toolbar */}
      <div className="d-flex justify-content-left align-items-left mb-3">
      
        {/* 🏆 Year Dropdown */}
        <Form.Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ width: '100px', display: 'inline-block' }}
        >
          {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        ref={calendarRef} // Reference to FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
        firstDay={1} // Start the week on Monday
        dayCellClassNames={(info) => {
          const dayOfWeek = new Date(info.date).getDay();
          return dayOfWeek === 0 || dayOfWeek === 6 ? 'bg-light text-danger' : '';
        }}
      />

     
    </Container>
  );
};

export default CalendarPage;
