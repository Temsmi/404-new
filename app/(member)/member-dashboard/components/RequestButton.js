'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Draggable from 'react-draggable';

const RequestButton = ({ student_id }) => {
  const [show, setShow] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('request');
  const [anonymous, setAnonymous] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('request-btn-position');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
        return;
      } catch {}
    }

    setPosition({
      x: window.innerWidth - 160,
      y: window.innerHeight - 80,
    });
  }, []);

  useEffect(() => {
    axios.get('/api/member-clubs')
      .then(res => setClubs(res.data))
      .catch(err => console.error('Failed to load clubs', err));
  }, []);

  const handleMouseDown = (e) => {
    if (!btnRef.current) return;
    setDragging(true);
    const rect = btnRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = Math.max(0, e.clientX - offset.x);
    const newY = Math.max(0, e.clientY - offset.y);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      localStorage.setItem('request-btn-position', JSON.stringify(position));
    }
  };

  const handleSubmit = async () => {
    if (!selectedClubId) {
      alert('Please select a club.');
      return;
    }

    try {
      const res = await fetch('/api/submit-request', {
        method: 'POST',
        body: JSON.stringify({
          student_id,
          reg_num: '',
          type: feedbackType,
          text: feedbackText,
          club_id: parseInt(selectedClubId),
          anonymous,
        }),
      });

      if (!res.ok) throw new Error('Submit failed');
      alert('Submitted successfully!');
      setShow(false);
      setFeedbackText('');
      setSelectedClubId('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Button
      variant="primary"
  onClick={() => setShow(true)}
  style={{
    position: "fixed",
    top: position.y,
    left: position.x,
    zIndex: 9999,
    cursor: dragging ? "grabbing" : "grab",
    userSelect: "none",
  }}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={dragging ? handleMouseUp : undefined}
  ref={btnRef}
>
  Request / Complaint
</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Feedback Type</Form.Label>
            <Form.Select value={feedbackType} onChange={e => setFeedbackType(e.target.value)}>
              <option value="request">Request</option>
              <option value="suggestion">Suggestion</option>
              <option value="complaint">Complaint</option>
            </Form.Select>
          </Form.Group>
 <Form.Group className="mt-3">
            <Form.Label>Select Club</Form.Label>
                <Form.Select
                     value={selectedClubId}
                      onChange={(e) => setSelectedClubId(e.target.value)}
                      required
                  >
    <option value="">-- Select a Club --</option>
   {clubs.map((club) => (
  <option key={club.id} value={club.id}>
    {club.name}
  </option>
))}

  </Form.Select>
</Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              label="Submit anonymously"
              checked={anonymous}
              onChange={e => setAnonymous(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RequestButton;
