import { useEffect, useState, useRef } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Draggable from 'react-draggable';




const RequestButton = ({ student_id }) => {
  const [show, setShow] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("request");
  const [anonymous, setAnonymous] = useState(false);

  // Added missing states for draggable button
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  // Fetch clubs when modal is shown and student_id exists
  useEffect(() => {
  const fetchClubs = async () => {
    try {
      const response = await axios.get('/api/member-clubs');
      console.log('Fetched clubs:', response.data); // <-- Add this
      
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  fetchClubs();
}, []);


  const handleSubmit = async () => {
    if (!selectedClubId) {
      alert("Please select a club.");
      return;
    }

    try {
      const response = await fetch("/api/submit-request", {
        method: "POST",
        body: JSON.stringify({
  student_id,
  reg_num: '', // Optional: provide real reg_num if available
  type: feedbackType,
  text: feedbackText,
  club_id: parseInt(selectedClubId, 10), // ✅ correct key
  anonymous,
}),


      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      alert("Feedback submitted successfully.");
      setShow(false);
      setFeedbackText("");
      setSelectedClubId("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMouseDown = (e) => {
    if (!btnRef.current) return;
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
    localStorage.setItem("request-button-position", JSON.stringify(position));
  };

  // Load saved position from localStorage on mount
  useEffect(() => {
    const savedPos = localStorage.getItem("request-button-position");
    if (savedPos) {
      try {
        const posObj = JSON.parse(savedPos);
        setPosition(posObj);
      } catch {}
    }
  }, []);

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
            <Form.Select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
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
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              label="Submit anonymously"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
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

