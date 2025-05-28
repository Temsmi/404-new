'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CalendarWidget from './components/CalendarWidget';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import MembersInfo from "sub-components/dashboard/MembersInfo";

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const normalizeName = (name) => name?.toLowerCase().replace(/\s+/g, '').trim();

export default function MemberDashboard() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
const [showEventModal, setShowEventModal] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/username');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

const fetchEvents = async () => {
  try {
    const res = await fetch('/api/eventlogs');
    const data = await res.json();
    const announcedEvents = data.filter((e) => e.is_announced === 1); // فیلتر بر اساس is_announced
    console.log("All events:", data);
    console.log("Announced only:", announcedEvents);
    setEvents(announcedEvents.slice(0, 3)); // فقط ۳ تا اولی
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};


    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcement');
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
    if (hour < 12) return 'Good mornin 🌞';
    if (hour < 18) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
  };

  const groupedAnnouncements = announcements.reduce((acc, a) => {
    const key = normalizeName(a.club_name);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const userClubs = user?.clubs || [];
  
  
  
  const clubsWithNoAnnouncements = userClubs.filter(
    (club) => !groupedAnnouncements.hasOwnProperty(normalizeName(club.name))
  );
const groupedEvents = events.reduce((acc, e) => {
  const club = userClubs.find(c => c.id === e.club_id);
  if (!club) return acc;

  const key = normalizeName(club.name);
  if (!acc[key]) acc[key] = [];
  acc[key].push(e);
  return acc;
}, {});

console.log("Grouped Events Keys:", Object.keys(groupedEvents));
console.log("User Clubs Normalized:", userClubs.map(c => normalizeName(c.name)));

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
 <Card.Header className="bg-primary">
  <h5 className="mb-0 fw-bold fs-4 text-white">📢 Announcements</h5>
</Card.Header>
              <Card.Body>
                {user && userClubs.length > 0 ? (
                  <>
                    {userClubs.map((club) => {
                      const key = normalizeName(club.name);
                      const clubAnnouncements = groupedAnnouncements[key];

                      return (
                        <div key={club.id} className="mb-4">
                          <h5 className="border-bottom pb-1 text-primary fw-semibold fs-5">{club.name}</h5>

                          {clubAnnouncements ? (
                            clubAnnouncements.map((a, index) => (
                              <div key={a.id}>
                                <div
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setSelectedAnnouncement(a);
                                    setShowModal(true);
                                  }}
                                >
                                  
                                  <small>{new Date(a.date).toLocaleDateString()}</small>
                                  <br />
                                  <span>{stripHtml(a.content).slice(0, 60)}...</span>
                                </div>
                                {index < clubAnnouncements.length - 1 && (
                                  <hr className="my-2" />
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No announcements available.</p>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p>No announcements yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4 shadow-sm">
<Card.Header className="bg-info">
  <h5 className="mb-0 fw-bold fs-4 text-white">📆 Calendar</h5>
</Card.Header>
              <Card.Body>
                <CalendarWidget />
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">

<Card.Header className="bg-success">
  <h5 className="mb-0 fw-bold fs-4 text-white">📅 Upcoming Events</h5>
</Card.Header>
         <Card.Body>
  {user && userClubs.length > 0 ? (
    <>
      {userClubs.map((club) => {
        const key = normalizeName(club.name);
        const clubEvents = groupedEvents[key];

        return (
          <div key={club.id} className="mb-4">
            <h6 className="fw-bold text-success border-bottom pb-1">{club.name}</h6>

            {clubEvents && clubEvents.length > 0 ? (
              clubEvents.map((event, index) => (
                <div key={event.id} className="mb-2">
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <strong>{event.name}</strong>
                    <br />
 <small>{new Date(event.date).toLocaleDateString()} - {event.time}</small>


                    <br />
                    <span>{stripHtml(event.description).slice(0, 60)}...</span>
                  </div>
                  {index < clubEvents.length - 1 && <hr className="my-2" />}
                </div>
              ))
            ) : (
              <p className="text-muted">No events found.</p>
            )}
          </div>
        );
      })}
    </>
  ) : (
    <p>No events yet.</p>
  )}
</Card.Body>



            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>
  {selectedEvent?.name} - {new Date(selectedEvent?.date).toLocaleDateString()}
</Modal.Title>

  </Modal.Header>
  <Modal.Body>
    {selectedEvent?.image && (
      <img
        src={selectedEvent.image}
        alt="Event"
        className="mb-3"
        style={{ width: '100%', borderRadius: '8px' }}
      />
    )}
    <p><strong>Description:</strong></p>
    <p style={{ whiteSpace: 'pre-wrap' }}>{stripHtml(selectedEvent?.description)}</p>

    {selectedEvent?.location && (
      <p><strong>Location:</strong> {selectedEvent.location}</p>
    )}

    {selectedEvent?.time && (
      <p><strong>Time:</strong> {selectedEvent.time}</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEventModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAnnouncement?.club_name} -{' '}
            {new Date(selectedAnnouncement?.date).toLocaleDateString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
    <div
    style={{ whiteSpace: 'pre-wrap' }}
    dangerouslySetInnerHTML={{ __html: selectedAnnouncement?.content }}
  />
</Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
