'use client';

// Import required modules
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';

const ClubRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch club requests from database
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/club-requests');
        const data = await res.json();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching club requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle Approve / Reject
  const handleAction = async (id, action) => {
    try {
      const res = await fetch('/api/club-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        alert(`Club Request ${action}d!`);
        setRequests(requests.filter(request => request.id !== id));
      } else {
        console.error('Failed to process request:', res.statusText);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div
              className="p-5 rounded shadow-lg text-center"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.2)",
                padding: "40px",
              }}
            >
              <h2 className="text-black font-weight-bold mb-4"> Club Requests</h2>
              {loading ? (
                <p className="text-black">Loading requests...</p>
              ) : requests.length > 0 ? (
                <Row>
                  {requests.map((request) => (
                    <Col md={6} key={request.id} className="mb-4">
                      <Card className="p-3 shadow-lg text-center"
                        style={{
                          background: "rgba(255, 255, 255, 0.25)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                          transition: "0.3s",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <Card.Body>
                          <Image src={request.logo} alt="Club Logo" width={80} height={80} className="mb-3" />
                          <h5 className="mb-2 text-black">{request.name}</h5>
                          <p className="text-black">{request.description}</p>
                          <div className="d-flex justify-content-around mt-3">
                            <Button variant="success" onClick={() => handleAction(request.id, 'approve')}>Approve</Button>
                            <Button variant="danger" onClick={() => handleAction(request.id, 'reject')}>Reject</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <h5 className="text-black mt-4">No pending club requests.</h5>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClubRequests;