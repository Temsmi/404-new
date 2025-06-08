import { useEffect, useState } from 'react';
import { Col, Row, Card, Spinner } from 'react-bootstrap';

const AboutMe = () => {
  const [president, setPresident] = useState(null);

  useEffect(() => {
    const fetchPresident = async () => {
      try {
        const res = await fetch('/api/setting');
        const data = await res.json();
        setPresident(data);
      } catch (error) {
        console.error('Error fetching president:', error);
      }
    };
    fetchPresident();
  }, []);

  if (!president) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading president's information...</p>
      </div>
    );
  }

  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <Card.Title as="h4">About {president.name} {president.surname}</Card.Title>
          <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
         <p className="mt-2 mb-6">{president.bio || "No bio provided yet."}</p>
          <Row>
            <Col xs={12} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Department</h6>
              <p className="mb-0">{president.dept}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Phone</h6>
              <p className="mb-0">{president.phone_num}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Email</h6>
              <p className="mb-0">{president.email}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutMe;
