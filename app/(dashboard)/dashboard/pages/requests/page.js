'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Modal, Spinner } from 'react-bootstrap';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes] = timeString.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const ActivityRequests = () => {
  const [requests, setRequests] = useState([]);
  const [denyReasons, setDenyReasons] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/activityrequests');
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching activity requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/activityrequests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 1, feedback: null }),
      });

      if (!res.ok) throw new Error("Failed to approve request");

      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === id ? { ...req, status: 1 } : req))
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleOpenDenyModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDeny = async () => {
    if (selectedRequest && denyReasons[selectedRequest.id]) {
      try {
        const res = await fetch(`/api/activityrequests`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedRequest.id,
            status: -1,
            feedback: denyReasons[selectedRequest.id],
          }),
        });

        const data = await res.json();

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

  const handleReasonChange = (id, value) => {
    setDenyReasons({ ...denyReasons, [id]: value });
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && req.status === 0) ||
      (statusFilter === 'approved' && req.status === 1) ||
      (statusFilter === 'denied' && req.status === -1);

    return matchesSearch && matchesStatus;
  });

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Activity Requests</h2>

          {/* Search and Filter Controls */}
          <Form className="mb-4">
            <Row>
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Search by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>

          {/* Loading or Requests */}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="info" role="status" />
              <p>Loading...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-center">No matching requests.</p>
          ) : (
            filteredRequests.map((req) => (
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
                      <p><strong>Post Feedback:</strong> {req.hasFeedback ? "Included" : "Not Included"}</p>
                      <p className={`fw-bold ${req.status === 1 ? 'text-success' : req.status === 0 ? 'text-warning' : 'text-danger'}`}>
                        Status: {req.status === 1 ? "Approved" : req.status === 0 ? "Pending" : "Denied"}
                      </p>

                      {req.status === 0 && (
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

      {/* Deny Modal */}
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
