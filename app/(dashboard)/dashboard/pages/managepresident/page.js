'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col,Table } from 'react-bootstrap';

const ManageClubPresidents = () => {
  const [presidents, setPresidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    club_id: ''
  });
  const [selectedPresident, setSelectedPresident] = useState(null);

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
    setSelectedPresident(president);
    setFormData({
      name: president.president_name,
      email: president.email,
      club_id: president.club_id,
    });
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedPresident(null);
    setFormData({ name: '', email: '', club_id: '' });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
     
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
                      <tr key={president.student_id}>
                        <td>{president.president_name}</td>
                        <td>{president.club_name}</td>
                        <td>{president.email}</td>
                        
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
  
    </Container>
  );
};

export default ManageClubPresidents;