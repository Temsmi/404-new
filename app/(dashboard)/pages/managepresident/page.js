'use client'
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';

const ManageClubPresidents = () => {
  const [presidents, setPresidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresidents = async () => {
      try {
        const res = await fetch('/api/club-presidents');
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

  const handleRemove = async (id) => {
    try {
      const res = await fetch('/api/club-presidents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setPresidents(presidents.filter(president => president.id !== id));
        alert('Club President Removed!');
      }
    } catch (error) {
      console.error('Error removing club president:', error);
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
              <h2 className="text-black font-weight-bold mb-4">Manage Club Presidents</h2>
              {loading ? (
                <p>Loading...</p>
              ) : presidents.length > 0 ? (
                <Row>
                  {presidents.map((president) => (
                    <Col md={6} key={president.id} className="mb-4">
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
                          <Image src={president.avatar} alt="President Avatar" width={80} height={80} className="mb-3 rounded-circle" />
                          <h5 className="mb-2 text-black">{president.name}</h5>
                          <p className="text-black">Club: {president.club}</p>
                          <p className="text-black">Email: {president.email}</p>
                          <div className="d-flex justify-content-around mt-3">
                            <Button variant="danger" onClick={() => handleRemove(president.id)}> Remove</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <h5 className="text-black mt-4">No club presidents found.</h5>
              )}
            </div>
          </Col>
        </Row>
      </Container>

  );
};

export default ManageClubPresidents;
