'use client';

import { useState } from 'react';
import { Container,ListGroup, Button, Card, Collapse } from 'react-bootstrap';

export default function GroupChatPage() {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4" style={{ width: "800px", background: "rgba(255, 255, 255, 0.9)", borderRadius: "12px" }}>
        <h2 className="text-center mb-4">Group Chat</h2>
        {/* Public Group Chat */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
          <ListGroup.Item action onClick={() => onSelect({ name: 'Public Group Chat', department: 'Join the discussion!', email: '', image: 'https://via.placeholder.com/50' })} className="fw-bold text-primary">
      🌍 Public Group Chat
    </ListGroup.Item>
          </Card.Body>
        </Card>

        {/* Announcement Section */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Button
              variant="link"
              onClick={() => setShowAnnouncements(!showAnnouncements)}
              className="w-100 text-start fs-5"
            >
              # Announcement
            </Button>
            <Collapse in={showAnnouncements}>
              <div className="mt-2">
                <Card className="p-3">
                  <h5>📢 Important Announcements</h5>
                  <ul>
                    <li>📌 Club Meeting on Friday at 5 PM</li>
                    <li>🎉 New Club Member Introductions</li>
                  </ul>
                </Card>
              </div>
            </Collapse>
          </Card.Body>
        </Card>

        {/* Event Section */}
        <Card className="shadow-sm">
          <Card.Body>
            <Button
              variant="link"
              onClick={() => setShowEvents(!showEvents)}
              className="w-100 text-start fs-5"
            >
              # Event
            </Button>
            <Collapse in={showEvents}>
              <div className="mt-2">
                <Card className="p-3">
                  <h5>🎊 Upcoming Events</h5>
                  <ul>
                    <li>🎭 Drama Night - March 30</li>
                    <li>🏆 Sports Tournament - April 10</li>
                  </ul>
                </Card>
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      </Card>
    </Container>
  );
}
