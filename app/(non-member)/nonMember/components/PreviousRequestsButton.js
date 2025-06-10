'use client';

import { useState } from 'react';
import { Button, Modal, Table, Spinner } from 'react-bootstrap';

const PreviousRequestsButton = ({ className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [previousRequests, setPreviousRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPreviousRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/myclubrequests');
      if (!res.ok) {
        const error = await res.json();
        alert('Error: ' + error.error);
        return;
      }
      const data = await res.json();
      setPreviousRequests(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch previous requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={fetchPreviousRequests}
        className={`d-inline-block ${className}`}
      >
        🕘 Previous Requests
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Previous Club Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : previousRequests.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Club Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {previousRequests.map((req, idx) => (
                  <tr key={req.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{req.name}</td>
                    <td>{req.description}</td>
                    <td>{req.status}</td>
                    <td>{new Date(req.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No previous requests found.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PreviousRequestsButton;
