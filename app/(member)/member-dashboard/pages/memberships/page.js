'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

const Memberships = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/memberships');
        const data = await res.json();
        setClubs(data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Your Joined Clubs</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : clubs.length === 0 ? (
        <p className="text-center">You haven't joined any clubs yet.</p>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {clubs.map((club) => (
            <Col key={club.id}>
              <Card className="h-100 shadow-sm">
                {club.logo && (
           <Card.Img
           variant="top"
           src={
             club.logo?.startsWith('data:image') 
               ? club.logo 
               : `/images/ClubsLogo/${club.logo}`
           }
           alt="Club Logo"
           style={{ maxHeight: '150px', objectFit: 'contain', padding: '1rem' }}
           onError={(e) => (e.target.src = '/images/default-logo.png')}
         />
         
                )}
                <Card.Body>
                  <Card.Title>{club.name}</Card.Title>
                  <Card.Text>{club.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Memberships;
