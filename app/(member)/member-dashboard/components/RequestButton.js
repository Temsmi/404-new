'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { MessageSquareMore } from 'lucide-react';

const RequestButton = () => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const [clubs, setClubs] = useState([]);
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    student_id: '',
    type: 'request',
    text: '',
    club_id: '',
    anonymous: false,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- Draggable Floating Button ---
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Fetch student info + their clubs
  useEffect(() => {
    const saved = localStorage.getItem('request-button-position');
    if (saved) {
      const pos = JSON.parse(saved);
      setPosition(pos);
    } else {
      const btnWidth = 60;
      const btnHeight = 60;
      setPosition({
        x: window.innerWidth - btnWidth - 30,
        y: window.innerHeight - btnHeight - 30,
      });
    }

    // Fetch student data
    fetch('/api/student-info') // You need to create this endpoint to return student { id }
      .then(res => res.json())
      .then(data => {
        setStudent(data);
        setForm(prev => ({ ...prev, student_id: data.id }));
      });

    // Fetch clubs the student is a member of
    fetch('/api/member-clubs') // This should return clubs the student is part of
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error('Failed to fetch clubs:', err));
  }, []);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - btnRef.current.getBoundingClientRect().left,
      y: e.clientY - btnRef.current.getBoundingClientRect().top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: Math.min(window.innerWidth - 60, Math.max(0, e.clientX - offset.x)),
      y: Math.min(window.innerHeight - 60, Math.max(0, e.clientY - offset.y)),
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem('request-button-position', JSON.stringify(position));
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const payload = {
      ...form,
      student_id: form.anonymous ? null : student?.id,
    };

    try {
      const res = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: result.message });
        setForm({ student_id: student?.id || '', type: 'request', text: '', club_id: '', anonymous: false });
        setTimeout(() => setShow(false), 2000);
      } else {
        setMessage({ type: 'danger', text: result.error || 'Submission failed' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Network error' });
    }
  };

  return (
    <>
      <Button
        ref={btnRef}
        onClick={handleToggle}
        variant="primary"
        className="request-btn"
        style={{ left: position.x, top: position.y, position: 'fixed' }}
        onMouseDown={handleMouseDown}
      >
        <MessageSquareMore size={24} />
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message.text && (
            <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
              {message.text}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {!form.anonymous && (
              <Row className="mb-3">
                <Col>
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control type="text" value={student?.id || ''} readOnly />
                </Col>
                
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Feedback Type</Form.Label>
              <Form.Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="request">Request</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Club</Form.Label>
              <Form.Select
                value={form.club_id}
                onChange={(e) => setForm({ ...form, club_id: e.target.value })}
                required
              >
                <option value="">-- Select a Club --</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Send anonymously"
              checked={form.anonymous}
              onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
              className="mb-3"
            />

            <Button variant="primary" type="submit">
              send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .request-btn {
          border-radius: 50%;
          padding: 15px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bounce 2s infinite;
          z-index: 9999;
          cursor: grab;
          user-select: none;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </>
  );
};

export default RequestButton;
