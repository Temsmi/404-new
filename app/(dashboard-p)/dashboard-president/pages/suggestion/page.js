'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Modal, Button, Form } from 'react-bootstrap';

export default function SuggestionPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState(''); // '' = all

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const url = typeFilter ? `/api/club-feedbacks?type=${typeFilter}` : '/api/club-feedbacks';
        const res = await fetch(url);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Fetch error:', errorText);
          return;
        }

        const json = await res.json();
console.log('Received feedback data:', json); 
setFeedbacks(Array.isArray(json.data) ? json.data : []);

      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };

    fetchFeedbacks();
  }, [typeFilter]);

  return (
    <Container className="mt-5">
  <div className="p-4 shadow-sm bg-white rounded">
    <h2 className="mb-4 text-primary"> Club Feedback</h2>

    {/* Filter */}
    <Form.Group className="mb-4" controlId="typeFilter">
      <Form.Label><strong>Filter by Feedback Type:</strong></Form.Label>
      <Form.Select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        style={{ maxWidth: '300px', borderRadius: '10px' }}
      >
        <option value="">All Types</option>
        <option value="suggestion">Suggestion</option>
        <option value="complaint">Complaint</option>
        <option value="request">Request</option>
      </Form.Select>
    </Form.Group>

    {/* Table */}
    <Table striped bordered hover responsive className="rounded">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>Submitted By</th>
          <th>Message</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((fb, index) => (
          <tr key={fb.id}>
            <td>{index + 1}</td>
            <td className="text-capitalize">{fb.type}</td>
            <td>{fb.anonymous ? 'Anonymous' : fb.student_name || '—'}</td>
<td>{fb.text && fb.text.length > 40 ? fb.text.slice(0, 40) + '...' : fb.text || '—'}</td>
            <td>
              <Form.Select
                value={fb.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  await fetch('/api/patch', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: fb.id, status: newStatus }),
                  });
                  setFeedbacks(prev =>
                    prev.map(f => f.id === fb.id ? { ...f, status: newStatus } : f)
                  );
                }}
                className="form-select-sm rounded"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </Form.Select>
            </td>
            <td>
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setSelected(fb); setShowModal(true); }}
              >
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

  {/* Modal */}
  <Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title> Feedback Detail</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {selected && (
        <>
          <p><strong>Type:</strong> {selected.type}</p>
          <p><strong>Submitted By:</strong> {selected.anonymous ? 'Anonymous' : selected.student_name}</p>
          <p><strong>Message:</strong><br />{selected.text}</p>
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
</Container>
  );
}
