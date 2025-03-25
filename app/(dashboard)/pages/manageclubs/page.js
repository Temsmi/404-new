'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs');
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

  const handleEdit = (id) => {
    // Redirect to edit page or show a modal
    alert(` Edit Club: ${id}`);
  };

  const handleDeactivate = async (id) => {
    try {
      const res = await fetch(`/api/clubs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' }),
      });
      if (res.ok) {
        alert(' Club Deactivated!');
        setClubs(clubs.map(club => club.id === id ? { ...club, status: 'inactive' } : club));
      }
    } catch (error) {
      console.error('Error deactivating club:', error);
    }
  };

  return (
      <Container>
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
              <h2 className="text-black font-weight-bold mb-4"> Manage Clubs</h2>
              {loading ? (
                <p className="text-black">Loading clubs...</p>
              ) : clubs.length > 0 ? (
                <Row>
                  {clubs.map((club) => (
                    <Col md={6} key={club.id} className="mb-4">
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
                          <Image src={club.logo} alt="Club Logo" width={80} height={80} className="mb-3" />
                          <h5 className="mb-2 text-black">{club.name}</h5>
                          <p className="text-black">{club.description}</p>
                          <p className="text-black">Status: {club.status}</p>
                          <div className="d-flex justify-content-around mt-3">
                            <Button variant="primary" onClick={() => handleEdit(club.id)}> Edit</Button>
                            <Button variant="warning" onClick={() => handleDeactivate(club.id)}> Desactivate</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <h5 className="text-black mt-4">No clubs available.</h5>
              )}
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default ManageClubs;
