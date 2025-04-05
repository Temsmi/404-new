'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Modal } from 'react-bootstrap';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A"; // Handle missing values

  const [hours, minutes] = timeString.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};


const ActivityRequests = () => {
  const [requests, setRequests] = useState([]);
  const [denyReasons, setDenyReasons] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/activityrequests');
        const data = await res.json();
        console.log("Fetched data:", data);
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching activity requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Approve request function
  const handleApprove = async (id) => {
    try {
      console.log("Approving request with ID:", id);
      const res = await fetch(`/api/activityrequests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 1, feedback: null }),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 1, feedback: null }),
      });

      if (!res.ok) throw new Error("Failed to approve request");

      if (!res.ok) throw new Error("Failed to approve request");
      const updatedRequest = await res.json();
      console.log("Approved Request Response:", updatedRequest);

      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === id ? { ...req, status: 1 } : req))
      );
      console.log("Approved Request Response:", updatedRequest);

      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === id ? { ...req, status: 1 } : req))
      );
    } catch (error) {
      console.error("Error approving request:", error);
      console.error("Error approving request:", error);
    }
  };

  // Open deny modal
  // Open deny modal
  const handleOpenDenyModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Deny request function
  // Deny request function
  const handleDeny = async () => {
    if (selectedRequest && denyReasons[selectedRequest.id]) {
        try {
            console.log("Denying request with ID:", selectedRequest.id);
            
            const res = await fetch(`/api/activityrequests`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedRequest.id,  // Make sure the ID is sent correctly
                    status: -1,
                    feedback: denyReasons[selectedRequest.id],
                }),
            });

            const data = await res.json();
            console.log("Server Response:", data); // Log server response for debugging

            if (!res.ok) throw new Error(data.error || "Failed to deny request");

            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === selectedRequest.id
                        ? { ...req, status: -1, reason: denyReasons[selectedRequest.id] }
                        : req
                )
            );

            setShowModal(false);
        } catch (error) {
            console.error("Error denying request:", error);
            alert("There was an error processing your request. Please check the console.");
        }
    } else {
        alert("Please provide a reason for denial.");
        try {
            console.log("Denying request with ID:", selectedRequest.id);
            
            const res = await fetch(`/api/activityrequests`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedRequest.id,  // Make sure the ID is sent correctly
                    status: -1,
                    feedback: denyReasons[selectedRequest.id],
                }),
            });

            const data = await res.json();
            console.log("Server Response:", data); // Log server response for debugging

            if (!res.ok) throw new Error(data.error || "Failed to deny request");

            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === selectedRequest.id
                        ? { ...req, status: -1, reason: denyReasons[selectedRequest.id] }
                        : req
                )
            );

            setShowModal(false);
        } catch (error) {
            console.error("Error denying request:", error);
            alert("There was an error processing your request. Please check the console.");
        }
    } else {
        alert("Please provide a reason for denial.");
    }

};


};


  const handleReasonChange = (id, value) => {
    setDenyReasons({ ...denyReasons, [id]: value });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Activity Requests</h2>
          {requests.length === 0 ? (
            <p>No requests available.</p>
          ) : (
            requests.map((req) => (
              <Card key={req.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={4} className="d-flex align-items-center">
                      <Image src={req.image} alt={req.title} fluid rounded />
                    </Col>
                    <Col md={8}>
                      <h4>{req.title}</h4>
                      <p className="text-muted">Created by: {req.createdBy}</p>
                      <p><strong>Club:</strong> {req.clubName}</p>
                      <p><strong>Date:</strong> {formatDate(req.date)}</p>
                      <p><strong>Time:</strong> {formatTime(req.time)}</p>
                      <p><strong>Description:</strong> {req.description}</p>
                      <p><strong>Zoom Link:</strong> {req.zoomLink ? <a href={req.zoomLink} target="_blank" rel="noopener noreferrer">Join Meeting</a> : "No Link"}</p>
                      <p><strong>Zoom Link:</strong> {req.zoomLink ? <a href={req.zoomLink} target="_blank" rel="noopener noreferrer">Join Meeting</a> : "No Link"}</p>
                      <p><strong>Post Feedback:</strong> {req.hasFeedback ? "Included" : "Not Included"}</p>
                      <p className={`fw-bold ${req.status === 1 ? 'text-success' : req.status === 0 ? 'text-warning' : 'text-danger'}`}>
                      <p className={`fw-bold ${req.status === 1 ? 'text-success' : req.status === 0 ? 'text-warning' : 'text-danger'}`}>
                        Status: {req.status === 1 ? "Approved" : req.status === 0 ? "Pending" : "Denied"}
                      </p>

                      {req.status === 0 && ( // Show buttons only for "pending" requests

                      {req.status === 0 && ( // Show buttons only for "pending" requests
                        <div className="d-flex gap-2">
                          <Button variant="success" onClick={() => handleApprove(req.id)}>Approve</Button>
                          <Button variant="danger" onClick={() => handleOpenDenyModal(req)}>Deny</Button>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>

      {/* Deny Reason Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deny Activity Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Denial</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={selectedRequest ? denyReasons[selectedRequest.id] || "" : ""}
              onChange={(e) => handleReasonChange(selectedRequest.id, e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeny}>Submit Denial</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ActivityRequests;