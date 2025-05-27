'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CalendarWidget from './components/CalendarWidget';
import RequestButton from "./components/RequestButton";

export default function MemberDashboard() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/username');
        const data = await res.json();
        console.log("Fetched user data:", data);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setAnnouncements(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchUser();
    fetchEvents();
    fetchAnnouncements();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Container className="pt-4">
        <h2>
          {getGreeting()},{' '}
          {user?.name && user?.surname ? `${user.name} ${user.surname}` : 'Loading user...'}
        </h2>
      </Container>

      <Container>
        <Row>
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5>📢 Announcements</h5>
              </Card.Header>
              <Card.Body>
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <div key={a.id} className="mb-3">
                      <strong>{a.title}</strong>
                      <br />
                      <small>{a.date}</small>
                      <br />
                      <span>{a.content}</span>
                    </div>
                  ))
                ) : (
                  <p>No announcements yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5>📆 Calendar</h5>
              </Card.Header>
              <Card.Body>
                <CalendarWidget />
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5>📅 Upcoming Events</h5>
              </Card.Header>
              <Card.Body>
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="mb-3">
                      <strong>{event.title || event.date_name}</strong>
                      <br />
                      <small>{event.date_selected}</small>
                      <br />
                      <span>{event.description}</span>
                    </div>
                  ))
                ) : (
                  <p>No events found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
        
      </Container>
          <RequestButton /> {/* ✅ This adds the floating button without affecting layout */}

    </>
  );
}
