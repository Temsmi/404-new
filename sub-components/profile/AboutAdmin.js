import { useEffect, useState } from 'react';
import { Col, Row, Card, Spinner } from 'react-bootstrap';

const AboutAdmin = () => {
  const [admin, setadmin] = useState(null);

  useEffect(() => {
    const fetchadmin = async () => {
      try {
        const res = await fetch('/api/Admin');
        const data = await res.json();
        setadmin(data);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };
    fetchadmin();
  }, []);

  if (!admin) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading admin's information...</p>
      </div>
    );
  }

  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <Card.Title as="h4">About {admin.name} {admin.surname}</Card.Title>
          <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
          <p className="mt-2 mb-6">I was born to become a Admin!</p>
          <Row>
           
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Phone</h6>
              <p className="mb-0">{admin.phone_num}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Email</h6>
              <p className="mb-0">{admin.email}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutAdmin;
