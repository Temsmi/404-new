'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Form } from 'react-bootstrap';

const Memberships = () => {
  
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');

const fetchClubs = async () => {
  try {
    const res = await fetch('/api/memberships');
    const data = await res.json();
    console.log('Fetched clubs:', data); // ← این خط رو اضافه کن
    setClubs(data);
    setFiltered(data);
  } catch (err) {
    console.error('Failed to fetch clubs:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    const filteredClubs = clubs
      .filter((club) =>
        club.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortField === 'date') {
          return new Date(a.date_joined) - new Date(b.date_joined);
        }
        return 0;
      });

    setFiltered(filteredClubs);
  }, [search, sortField, clubs]);

const handleDrop = async (clubId) => {
  console.log("Dropping club with ID:", clubId);
  if (!confirm('Are you sure you want to leave this club?')) return;

  try {
    const res = await fetch('/api/memberships', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId }),
    });

    const result = await res.json();
    console.log('Drop result:', result);

    if (res.ok) {
      
 setClubs(prev => prev.filter(club => club.club_id !== clubId));
setFiltered(prev => prev.filter(club => club.club_id !== clubId));

    } else {
      alert(result.error || 'Failed to leave club.');
    }
  } catch (error) {
    console.error('Drop error:', error);
  }
};


  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Your Joined Clubs</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center">You haven&apos;t joined any clubs yet.</p>
      ) : (
        <>

          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Joined On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((club) => (
                  <tr key={club.id}>
                    <td style={{ width: '70px' }}>
                      <img
                        src={
                          club.logo?.startsWith('data:image')
                            ? club.logo
                            : `/images/ClubsLogo/${club.logo || 'default-logo.png'}`
                        }
                        alt="Club Logo"
                        style={{ height: '50px', objectFit: 'contain' }}
                        onError={(e) => (e.target.src = '/images/default-logo.png')}
                      />
                    </td>
                    <td>{club.name}</td>
                    <td>{club.description?.substring(0, 60) || '-'}</td>
                    <td>
                      {club.date_joined
                        ? new Date(club.date_joined).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                  <Button
  variant="outline-danger"
  size="sm"
  onClick={() => handleDrop(club.club_id)}
>
  Leave
</Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Container>
  );
};

export default Memberships;
