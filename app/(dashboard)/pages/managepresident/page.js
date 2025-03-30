'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Table } from 'react-bootstrap';

const ManageClubPresidents = () => {
  const [presidents, setPresidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPresident, setCurrentPresident] = useState(null);

  useEffect(() => {
    const fetchPresidents = async () => {
      try {
        const res = await fetch('/api/mgmtpresi');
        const data = await res.json();
        setPresidents(data);
      } catch (error) {
        console.error('Error fetching club presidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresidents();
  }, []);

  const handleEdit = (president) => {
    setCurrentPresident(president);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentPresident(null);
  };

  const handleSave = async () => {
    if (!currentPresident.name || !currentPresident.email || !currentPresident.club) return;

    try {
      const res = await fetch(`/api/mgmtpresi/${currentPresident.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPresident),
      });

      if (res.ok) {
        setPresidents(presidents.map(p => 
          p.id === currentPresident.id ? currentPresident : p
        ));
        alert('Club President Updated!');
        handleClose();
      }
    } catch (error) {
      console.error('Error updating club president:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPresident(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="mt-5"> {/* Add margin-top to the container */}
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="p-5 rounded shadow-lg text-center"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.2)",
              padding: "40px",
            }}
          >
            <h2 className="text-black font-weight-bold mb-4">Manage Club Presidents</h2>
            {loading ? (
              <p>Loading...</p>
            ) : presidents.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>President Name</th>
                    <th>Club</th>
                    <th>Email</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {presidents.map((president) => (
                    <tr key={president.id}>
                      <td>{president.president_name}</td>
                      <td>{president.club_id}</td>
                      <td>{president.email}              
                        <Button variant="danger" onClick={() => handleEdit(president)} style={{ display: 'flex', justifyContent: 'flex-end'}}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <h5 className="text-black mt-4">No club presidents found.</h5>
            )}
          </div>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Club President</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPresident && (
            <Form>
              <Form.Group controlId="formPresidentName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentPresident.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPresidentEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentPresident.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPresidentClub">
                <Form.Label>Club</Form.Label>
                <Form.Control
                  type="text"
                  name="club"
                  value={currentPresident.club}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageClubPresidents;