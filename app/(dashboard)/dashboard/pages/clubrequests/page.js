'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error('Failed to fetch club requests');
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
const data = await res.json();
console.log('Server response:', res.status, data);

if (res.ok) {
  toast.success(`Club request ${action}d successfully`);
  setRequests(requests.filter(request => request.id !== id));
} else {
  toast.error(data?.error || `Failed to ${action} the request`);
}

    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Error while trying to ${action} request`);
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
        <div className="d-flex justify-content-center mb-3">
    <Image
      src={`/images/ClubsLogo/${req.logo}`}
      alt="Club Logo"
      className="img-fluid rounded"
      style={{ maxWidth: '100px' }}
      onError={(e) => (e.target.src = "/images/default-logo.png")}
    />
  </div>



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
