'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner } from 'react-bootstrap';
import Image from "next/image";

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState(new Set());

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/club-join');
        const data = await res.json();
        setClubs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleJoin = async (id) => {
    try {
      const res = await fetch('/api/club-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: id })
      });
      if (res.ok) {
        setJoinedClubs(new Set([...joinedClubs, id]));
      }
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  const handleDrop = async (id) => {
    try {
      const res = await fetch('/api/club-join', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: id })
      });
      if (res.ok) {
        setJoinedClubs(new Set(data.filter(c => c.is_member).map(c => c.id)));

      }
    } catch (error) {
      console.error('Error dropping club:', error);
    }
  };

  return (
    <Container className="py-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
          <p>Loading...</p>
        </div>
      ) : (
        <Row>
          {clubs.map((club) => (
            <Col key={club.id} md={4} className="mb-4">
              <Card className="shadow-sm text-center h-100 p-3">
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedClub(club)}
                >
              <Image
  src={club.logo ? `/images/ClubsLogo/${club.logo}` : "/images/default-logo.png"}
  alt={club.name}
  width={100}
  height={100}
  className="img-fluid rounded-circle mx-auto"
/>

                  <Card.Body>
                    <Card.Title className="mb-2">{club.name}</Card.Title>
                    <Card.Text style={{ fontSize: "0.9rem", color: "#666" }}>
                      {club.description.substring(0, 60)}...
                    </Card.Text>
                  </Card.Body>
                </div>
                <div className="d-flex justify-content-center mb-2">
                  {joinedClubs.has(club.id) ? (
                    <Button variant="danger" onClick={() => handleDrop(club.id)}>
                      Drop
                    </Button>
                  ) : (
                    <Button variant="success" onClick={() => handleJoin(club.id)}>
                      Join
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Full Club Details */}
      {selectedClub && (
        <Modal show centered onHide={() => setSelectedClub(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedClub.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
             <Image
  src={selectedClub.logo ? `/images/ClubsLogo/${selectedClub.logo}` : "/images/default-logo.png"}
  alt={selectedClub.name}
  width={100}
  height={100}
  className="img-fluid rounded-circle mx-auto"
/>

            </div>
            <p><strong>Description:</strong> {selectedClub.description}</p>
            <p><strong>President:</strong> {selectedClub.president_name || 'N/A'}</p>
            <p><strong>Members:</strong> {selectedClub.member_count}</p>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default ManageClubs;
