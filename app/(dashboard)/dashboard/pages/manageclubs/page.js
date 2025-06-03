'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Spinner } from 'react-bootstrap';

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/club');
        const data = await res.json();
        setClubs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleEdit = (club) => {
    setSelectedClub(club);
    setFormData({
      name: club.name,
      description: club.description,
      logo: club.logo,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.logo) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch(`/api/club`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedClub.id,
          name: formData.name,
          description: formData.description,
          logo: formData.logo
        }),
      });

      if (res.ok) {
        const updatedClub = await res.json();
        alert('Club Updated!');
        setClubs(clubs.map(club => (club.id === updatedClub.id ? updatedClub : club)));
        setIsEditing(false);
        setSelectedClub(null);
      } else {
        const errorMessage = await res.text();
        console.error('Failed to update club:', errorMessage);
        alert('Failed to update club: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error updating club:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const res = await fetch(`/api/club/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: id,
          description: 'This club has been Deactivated' 
        }),
      });

      if (res.ok) {
        alert('Club Deactivated!');
        setClubs(clubs.map(club =>
          club.id === id ? { ...club, description: 'This club has been Deactivated' } : club
        ));
      } else {
        const errorMessage = await res.text();
        console.error('Failed to deactivate club:', errorMessage);
        alert('Failed to deactivate club: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error deactivating club:', error);
    }
  };

  const handleToggleActive = async (club) => {
    const newStatus = !club.is_active;
    try {
  const res = await fetch(`/api/club`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: club.id,
    is_active: newStatus,
    description: newStatus ? club.description : 'This club has been Deactivated'
  }),
});

      if (res.ok) {
        alert(`Club ${newStatus ? 'Activated' : 'Deactivated'}!`);
        setClubs(clubs.map(c => 
          c.id === club.id ? { ...c, is_active: newStatus, description: newStatus ? club.description : 'This club has been Deactivated' } : c
        ));
      } else {
        const errorMessage = await res.text();
        console.error('Failed to toggle club:', errorMessage);
        alert('Failed to toggle club: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error toggling club:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Row className="justify-content-between align-items-center mb-4">
        <Col className="w-100 mb-4">
          <h2 className="text-black font-weight-bold">Manage Clubs</h2>
        </Col>
        <Col className="text-end">
          <Link href="/dashboard/pages/managepresident">
            <Button variant="dark">Manage Presidents</Button>
          </Link>
        </Col>
      </Row>

      {isEditing && selectedClub ? (
        <Row>
          <Col md={12}>
            <Card className="p-4 shadow-lg text-center">
              <Card.Body>
                <h3>Edit Club</h3>
                <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <Form.Group controlId="formName">
                    <Form.Label>Club Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Club Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formLogo">
                    <Form.Label>Club Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="mt-3">Save Changes</Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)} className="mt-3 ms-2">Cancel</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="mt-6">
          <Col md={12}>
            <Card>
              <Card.Header className="bg-white py-4">
                <h4 className="mb-0">All Clubs</h4>
              </Card.Header>
              <Table responsive hover className="text-nowrap mb-0">
                <thead className="table-light">
                  <tr className="border-b">
                    <th>NAME</th>
                    <th>PRESIDENT</th>
                    <th>MEMBERS</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <Spinner animation="border" variant="info" role="status" />
                          <p className="mt-2 mb-0">Loading...</p>
                        </div>
                      </td>
                    </tr>
                  ) : clubs.length > 0 ? (
                    clubs.map((club, index) => (
                      <tr key={index} className={!club.is_active ? 'opacity-50' : ''}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div md={4} className="text-center">
                              <img
                                src={`/images/ClubsLogo/${club.logo}`}
                                alt="Club Logo"
                                className="img-fluid rounded"
                                style={{
                                  maxWidth: '50px',
                                  opacity: club.is_active ? 1 : 0.3
                                }}
                                onError={(e) => e.target.src = "/images/default-logo.png"}
                              />
                            </div>
                            <div className="ms-3 lh-1">
                              <h5 className="mb-1">
                                <Link href="#" className="text-inherit">{club.name}</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">{club.president_name || 'N/A'}</td>
                        <td className="align-middle">{club.member_count}</td>
                        <td className="text-center">
                          <Button variant="primary" onClick={() => handleEdit(club)} className="me-2">Edit</Button>
                        </td>
                        <td>
                         <Button
  variant={club.is_active ? 'warning' : 'success'}
  onClick={() => handleToggleActive(club)}
>
  {club.is_active ? 'Deactivate' : 'Activate'}
</Button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No clubs available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ManageClubs;
