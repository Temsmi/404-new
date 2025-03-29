'use client';

import { useState } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';

const feedbackData = [
  { id: 1, name: 'Alice', category: 'Events', feedback: 'Can we have more workshops?', status: 'Open' },
  { id: 2, name: 'Bob', category: 'Website', feedback: 'Login page has issues.', status: 'In Progress' },
  { id: 3, name: 'Charlie', category: 'Facilities', feedback: 'Gym equipment needs maintenance.', status: 'Resolved' },
];

/*const getStatusBadge = (status) => {
  switch (status) {
    case 'Open': return <Badge bg="primary">Open</Badge>;
    case 'In Progress': return <Badge bg="warning">In Progress</Badge>;
    case 'Resolved': return <Badge bg="success">Resolved</Badge>;
    default: return <Badge bg="secondary">Unknown</Badge>;
  }
};*/

export default function MemberFeedback() {
  const [feedbacks, setFeedbacks] = useState(feedbackData);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };
  
  return (
    <Container className="mt-5">
      <h1 className="text-center text-primary mb-4">Member Suggestions & Complaints</h1>
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Feedback</th>
            
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.name}</td>
              <td>{feedback.category}</td>
              <td>{feedback.feedback}</td>
             
              <td className="text-center">
                <Button variant="info" size="sm" onClick={() => handleViewFeedback(feedback)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedFeedback && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Feedback Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedFeedback.name}</p>
            <p><strong>Category:</strong> {selectedFeedback.category}</p>
            <p><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
            
            <Form>
              <Form.Group>
                <Form.Label>Response</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Write a response..." />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCloseModal}>Send Response</Button>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
