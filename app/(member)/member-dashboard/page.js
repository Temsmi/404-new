'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Moon } from 'lucide-react';
import CalendarWidget from './components/CalendarWidget';
import RequestButton from './components/RequestButton';
import Image from 'next/image';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const normalizeName = (name) => name?.toLowerCase().replace(/\s+/g, '').trim();

export default function MemberDashboard() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);

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
        const announcedEvents = data.filter((e) => e.is_announced === 1);
        setEvents(announcedEvents.slice(0, 3));
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

    if (hour < 12) {
      return {
        text: 'Good morning, ',
        icon: <img src="fonts/feather-icons/icons/sun.svg" alt="sun icon" className="inline w-5 h-5 ml-2" />
      };
    }

    if (hour < 18) {
      return {
        text: 'Good afternoon, ',
        icon: <img src="fonts/feather-icons/icons/sunny.svg" alt="sunny icon" className="inline w-5 h-5 ml-2" />
      };
    }

    return {
      text: 'Good evening, ',
      icon: <Moon className="inline w-5 h-5 text-indigo-500 ml-2" />
    };
  };

  const groupedAnnouncements = announcements.reduce((acc, a) => {
    const key = normalizeName(a.club_name);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const userClubs = user?.clubs || [];

  const groupedEvents = events.reduce((acc, e) => {
    const club = userClubs.find(c => c.id === e.club_id);
    if (!club) return acc;
    const key = normalizeName(club.name);
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const { text, icon } = getGreeting();

  return (
    <>
      <Container className="pt-4">
        <br />
        <h1 className="text-xs font-bold">
          <b>{text}{user?.name && user?.surname ? `${user.name} ${user.surname}` : 'Loading user...'} </b>
          &nbsp;{icon}
        </h1>
      </Container>

      <Container>
        <Row>
          <Col lg={7}>
            <Card className="mb-2 shadow-sm border-0">
              <div
                className="text-white pt-3 px-3 pb-3"
                style={{
                  backgroundImage: 'url("/fonts/feather-icons/icons/bg.svg")',
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  borderRadius: "0.5rem"
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <img src="fonts/feather-icons/icons/sp.svg" alt="icon" width={30} height={30} className="me-3" />
                    <h5 className="mb-0 text-white fw-semibold">Announcements</h5>
                  </div>
                  <button className="btn btn-outline-light btn-sm" style={{ width: '94px', height: '32px', borderRadius: '100px', borderWidth: '1px' }}>
                    See more&nbsp;&nbsp;<img src="fonts/feather-icons/icons/Vector 2 (Stroke).svg" />
                  </button>
                </div>
                <Card.Body className="p-0">
                  {user && userClubs.length > 0 ? (
                    userClubs.map((club) => {
                      const key = normalizeName(club.name);
                      const clubAnnouncements = groupedAnnouncements[key];
                      return (
                        <div key={club.id} className="mb-3">
                          <div className="fw-bold text-white">{club.name}</div>
                          {clubAnnouncements ? (
                            clubAnnouncements.map((a, index) => (
                              <div key={a.id} className="mb-2">
                                <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                                  <strong className="text-nowrap">{a.title}:</strong>
                                  <span className="text-truncate d-inline-block" style={{ maxWidth: '70%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{stripHtml(a.content)}</span>
                                </div>
                                {index < clubAnnouncements.length - 1 && <hr style={{ borderTop: '1px solid white', opacity: 0.3 }} />}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No announcements available.</p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="mb-0">No announcements yet.</p>
                  )}
                </Card.Body>
              </div>
            </Card>
          </Col>

          <div className="sidebar">
            <Card className="mb-4 shadow-sm" style={{ width: '100%' }}>
              <Card.Body className="p-4">
                <div style={{ width: '100%' }}>
                  <CalendarWidget />
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <h6 className="fw-bold mb-3">Upcoming Events</h6>
                {user && userClubs.length > 0 ? (
                  userClubs.map((club) => {
                    const key = normalizeName(club.name);
                    const clubEvents = groupedEvents[key];
                    return (
                      <div key={club.id} className="mb-3">
                        <div className="fw-bold">{club.name}</div>
                        {clubEvents && clubEvents.length > 0 ? (
                          clubEvents.map((event, index) => {
                            const colors = ['#4c8df6', '#d63384', '#198754'];
                            const backgrounds = ['#e6f0ff', '#ffe6ea', '#e6fff2'];
                            return (
                              <div
                                key={event.id}
                                className="d-flex align-items-center mb-2 p-2 rounded"
                                style={{
                                  borderLeft: `5px solid ${colors[index % 3]}`,
                                  backgroundColor: backgrounds[index % 3]
                                }}
                              >
 {/* <Image
  src={`/images/ClubsLogo/${clubEvents.logo || 'default-logo.png'}`}
  alt="Club Logo"
  width={100}
  height={100}
  className="rounded"
/> */}
                                <div>
                                  <div className="fw-bold">{event.name}</div>
                                  <div className="text-muted small">{new Date(event.date).toLocaleDateString()} - {event.time}</div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-muted">No events found.</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">No events yet.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Container>

      <RequestButton />

      <style jsx>{`
        .sidebar {
          background-color: #f8f9fa;
          width: 320px;
          height: calc(100vh - 61px);
          position: fixed;
          top: 61px;
          right: 0;
          overflow-y: auto;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
          z-index: 1000;
        }
      `}</style>
    </>
  );
}