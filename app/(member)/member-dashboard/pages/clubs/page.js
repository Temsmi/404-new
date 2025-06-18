'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner, Form } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length <= maxLength ? text : text.substring(0, text.lastIndexOf(' ', maxLength)) + '...';
};

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState(new Set());
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
    const [isLoading, setIsLoading] = useState(false);
const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/club-join');
        const data = await res.json();
        setClubs(Array.isArray(data) ? data : []);
        const joined = data.filter(c => c.is_member).map(c => c.id);
        setJoinedClubs(new Set(joined));
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
    if (joinedClubs.has(id)) return;
    if (joinedClubs.size >= 3) {
      alert('You can only join up to 3 clubs.');
      return;
    }

    try {
      const res = await fetch('/api/club-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: id })
      });

      if (res.ok) {
        setJoinedClubs(prev => new Set([...prev, id]));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to join club.');
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

    const data = await res.json();

    if (res.ok) {
      setJoinedClubs(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });

     
      if (data.forceLogout) {
  setShowForceLogoutModal(true); 
  setIsLoading(true);
  setTimeout(async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/authentication/sign-in');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  }, 3000);
      }
    } else {
      alert(data.error || 'Failed to drop club.');
    }
  } catch (error) {
    console.error('Error dropping club:', error);
  }
};

  const filteredAndSortedClubs = [...clubs]
    .filter(club => club.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === 'name') return a.name.localeCompare(b.name);
      if (sortField === 'date') return new Date(a.join_date) - new Date(b.join_date);
      return 0;
    });

  return (
    <Container className="py-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              type="text"
              placeholder="Search clubs..."
              style={{ width: '50%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Form.Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="name">Sort by Name (A-Z)</option>
              <option value="date">Sort by Join Date</option>
            </Form.Select>
          </div>

          <Row className="justify-content-center">
            <Col md={10}>
              <div className="table-responsive">
                <table className="table table-bordered table-hover bg-white">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '60px' }}>Logo</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th style={{ width: '160px' }} className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedClubs.map((club) => (
                      <tr key={club.id}>
                        <td className="text-center">
                          <Image
                            src={club.logo ? `/images/ClubsLogo/${club.logo}` : "/images/default-logo.png"}
                            alt={`Logo of ${club.name} club`}
                            width={40}
                            height={40}
                            className="rounded-circle"
                          />
                        </td>
                        <td>{club.name}</td>
                        <td>{truncateText(club.description, 80)}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 mb-1"
                            onClick={() => setSelectedClub(club)}
                          >
                            View
                          </Button>
                          {joinedClubs.has(club.id) ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDrop(club.id)}
                            >
                              Drop
                            </Button>
                          ) : (
                            <Button
                              variant={joinedClubs.size >= 3 ? "secondary" : "outline-success"}
                              size="sm"
                              onClick={() => handleJoin(club.id)}
                              disabled={joinedClubs.size >= 3}
                            >
                              {joinedClubs.size >= 3 ? "Limit Reached" : "Join"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </>
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
                alt={`Logo of ${selectedClub.name} club`}
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
      <Modal show={showForceLogoutModal} centered onHide={() => setShowForceLogoutModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Notice</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>
     You left all clubs. You will be logged out now.<br />
     
    </p>
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default ManageClubs;
