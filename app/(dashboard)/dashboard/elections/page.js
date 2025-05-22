'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  InputGroup,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';

// Timer helper function for weeks, days, hours, minutes, seconds
const getElapsedTime = (startTime) => {
  if (!startTime) return '0w 0d 0h 0m 0s';
  const now = Date.now();
  let elapsed = Math.floor((now - startTime) / 1000); // total seconds

  const weeks = Math.floor(elapsed / (7 * 24 * 3600));
  elapsed %= 7 * 24 * 3600;

  const days = Math.floor(elapsed / (24 * 3600));
  elapsed %= 24 * 3600;

  const hours = Math.floor(elapsed / 3600);
  elapsed %= 3600;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export default function ElectionAdmin() {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load startTime from localStorage or null
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('electionStartTime');
    return saved ? Number(saved) : null;
  });

  const [elapsed, setElapsed] = useState(getElapsedTime(startTime));
  const intervalRef = useRef(null);

  // Timer interval setup/cleanup
  useEffect(() => {
    if (startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(getElapsedTime(startTime));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [startTime]);

  // Fetch clubs data from API on mount
  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin-elections'); // Adjust path if needed
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setClubs(data);
      } catch (err) {
        setError('Failed to load clubs data.');
        setClubs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  // Global actions
  const handleGlobalAction = (action) => {
    if (action === 'start') {
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        localStorage.setItem('electionStartTime', now.toString());
      }
      setClubs((prev) => prev.map((club) => ({ ...club, started: true })));
    }

    if (action === 'stop') {
      setClubs((prev) => prev.map((club) => ({ ...club, started: false })));
      clearInterval(intervalRef.current);
    }

    if (action === 'publish') {
      setClubs((prev) => prev.map((club) => ({ ...club, published: true })));
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      {/* Timer displayed once at the top */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6} lg={4} className="text-center">
          <h2 className="fw-bold text-primary">Election Timer</h2>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#624bff',
              backgroundColor: '#e7e6ff',
              borderRadius: '12px',
              padding: '15px 25px',
              userSelect: 'none',
            }}
          >
            {elapsed}
          </div>
        </Col>
      </Row>

      {/* Search Input - smaller and aligned left */}
      <Row className="justify-content-start mb-4">
        <Col xs={12} md={4} lg={3}>
          <InputGroup>
            <InputGroup.Text>Search Club</InputGroup.Text>
            <Form.Control
              placeholder="Type club name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Global Buttons */}
      <Row className="justify-content-center mb-5">
        <Col
          xs={12}
          md={10}
          lg={8}
          className="d-flex gap-3 justify-content-center flex-wrap"
        >
          <Button variant="success" onClick={() => handleGlobalAction('start')}>
            Start All Elections
          </Button>
          <Button variant="danger" onClick={() => handleGlobalAction('stop')}>
            Stop All Elections
          </Button>
          <Button variant="primary" onClick={() => handleGlobalAction('publish')}>
            Publish All Results
          </Button>
        </Col>
      </Row>

      {/* Loading and Error */}
      {loading && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8} className="text-center">
            <Spinner animation="border" role="status" />
            <span className="ms-2">Loading clubs...</span>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8}>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Clubs List */}
      {!loading && filteredClubs.length === 0 && (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <p className="text-center text-muted">No clubs match your search.</p>
          </Col>
        </Row>
      )}

      {!loading &&
        filteredClubs.map((club) => (
          <Row key={club.id} className="justify-content-center mb-4">
            <Col xs={12} md={12} lg={10} xl={8}>
              <Card className="shadow border-primary">
                <Card.Body>
                  <Card.Title className="text-primary fs-3">{club.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted fs-4">
                    Candidates (sorted by votes)
                  </Card.Subtitle>

                  <ListGroup>
                    {club.candidates
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, index) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span className="fs-5">{candidate.name}</span>
                          <Badge bg="secondary" className="fs-5">
                            {candidate.votes} votes
                          </Badge>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
    </Container>
  );
}
