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

const getElapsedTime = (startTime) => {
  if (!startTime) return '0w 0d 0h 0m 0s';
  const now = Date.now();
  let elapsed = Math.floor((now - startTime) / 1000);

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
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [errorClubs, setErrorClubs] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState('0w 0d 0h 0m 0s');
  const intervalRef = useRef(null);

  const [electionStatus, setElectionStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('electionStartTime');
    if (saved) setStartTime(Number(saved));
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (startTime) {
      setElapsed(getElapsedTime(startTime));
      intervalRef.current = setInterval(() => {
        setElapsed(getElapsedTime(startTime));
      }, 1000);
    } else {
      setElapsed('0w 0d 0h 0m 0s');
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime]);

  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoadingClubs(true);
        setErrorClubs(null);

        const res = await fetch('/api/admin-elections');
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setClubs(data);
      } catch {
        setErrorClubs('Failed to load clubs data.');
        setClubs([]);
      } finally {
        setLoadingClubs(false);
      }
    }
    fetchClubs();
  }, []);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoadingStatus(true);
        setErrorStatus(null);

        const res = await fetch('/api/votes/election-status');
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setElectionStatus(data.status || 'unknown');
      } catch {
        setErrorStatus('Failed to load election status.');
        setElectionStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    }
    fetchStatus();
  }, []);

  const handleGlobalAction = async (action) => {
    try {
      const res = await fetch('/api/votes/election-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        setStatusMessage('Failed to update election status.');
        return;
      }

      const data = await res.json();

      if (action === 'start') {
        const now = Date.now();
        setStartTime(now);
        localStorage.setItem('electionStartTime', now.toString());
        setClubs((prev) => prev.map((club) => ({ ...club, started: true })));
        setStatusMessage('Elections have started.');
      } else if (action === 'stop') {
        clearInterval(intervalRef.current);
        setClubs((prev) => prev.map((club) => ({ ...club, started: false })));
        setStatusMessage('Elections have stopped.');
      } else if (action === 'publish') {
        setClubs((prev) => prev.map((club) => ({ ...club, published: true })));
        setStatusMessage('Results have been published.');
      }
    } catch (error) {
      setStatusMessage('Error updating election status.');
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      {/* Timer */}
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

      {/* Search */}
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

      {/* Buttons */}
      <Row className="justify-content-center mb-5">
        <Col
          xs={12}
          md={10}
          lg={8}
          className="d-flex gap-3 justify-content-center flex-wrap"
        >
          <Button variant="success" onClick={() => handleGlobalAction('start')}>
            Start Elections
          </Button>
          <Button variant="danger" onClick={() => handleGlobalAction('stop')}>
            Stop Elections
          </Button>
          <Button variant="primary" onClick={() => handleGlobalAction('publish')}>
            Publish Results
          </Button>
        </Col>
      </Row>

      {/* Status message */}
      <Row className="justify-content-center mb-3">
        <Col xs={12} md={10} lg={8} className="text-center">
          {statusMessage && (
            <Alert variant="info" className="py-2">
              {statusMessage}
            </Alert>
          )}
        </Col>
      </Row>

      {/* Clubs Loading/Error */}
      {loadingClubs && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8} className="text-center">
            <Spinner animation="border" role="status" />
            <span className="ms-2">Loading clubs...</span>
          </Col>
        </Row>
      )}

      {errorClubs && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={8}>
            <Alert variant="danger" className="text-center">
              {errorClubs}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Clubs list */}
      {!loadingClubs && filteredClubs.length === 0 && (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <p className="text-center text-muted">No clubs match your search.</p>
          </Col>
        </Row>
      )}

      {!loadingClubs &&
        filteredClubs.map((club) => (
          <Row key={club.id} className="justify-content-center mb-4">
            <Col xs={12} md={12} lg={10} xl={8}>
              <Card className="shadow border-primary">
                <Card.Body>
                  <Card.Title className="text-primary fs-3">{club.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted fs-4">
                    Candidates
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
