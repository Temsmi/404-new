import { useEffect, useState } from 'react';
import { Col, Row, Card, Spinner } from 'react-bootstrap';

export const AboutMem = () => {
  const [member, setmember] = useState(null);

useEffect(() => {
  const fetchmember = async () => {
    try {
      const res = await fetch('/api/setting-mem');
      const data = await res.json();
     
      setmember(data);
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  };
  fetchmember();
}, []);


  if (!member) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading member's information...</p>
      </div>
    );
  }

  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <Card.Title as="h4">About </Card.Title>
       
          <Row>
            <Col xs={12} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Department</h6>
              <p className="mb-0">{member.dept}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Phone</h6>
              <p className="mb-0">{member.phone_num}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Email</h6>
              <p className="mb-0">{member.email}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutMem;
