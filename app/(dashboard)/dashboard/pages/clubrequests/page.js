'use client';


import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';

const ClubRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/clubrequest');
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
  

  const handleAction = async (id, action) => {
    try {
    
   

      const res = await fetch('/api/clubrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }), 
      });

      if (res.ok) {
        alert(`Club Request ${action}d!`);
        setRequests(requests.filter(request => request.id !== id));
      } else {
        console.error('Failed to process request');
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Club Requests</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : requests.length > 0 ? (
        <Row>
          {requests.map((req) => (
            <Col md={6} key={req.id} className="mb-4">
              <Card className="p-3 shadow">
                <Card.Body>
                  <Image src={req.logo} width={80} height={80} className="mb-3" />
                  <h5>{req.name}</h5>
                  <p>{req.description}</p>
                  <div className="d-flex justify-content-around mt-3">
                    <Button variant="success" onClick={() => handleAction(req.id, 'approve')}>Approve</Button>
                    <Button variant="danger" onClick={() => handleAction(req.id, 'reject')}>Reject</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No pending club requests.</p>
      )}
    </Container>
  );
};

export default ClubRequests;
