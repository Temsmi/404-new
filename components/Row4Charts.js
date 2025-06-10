'use client';

import { Row, Col, Card, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Row4Charts = () => {
  const [eventsPerClubData, setEventsPerClubData] = useState([]);

  useEffect(() => {
    fetch('/api/metrics-admin')
      .then(res => res.json())
      .then(data => {
        setEventsPerClubData(data.events_per_club || []);
      })
      .catch(err => console.error('Error loading events per club:', err));
  }, []);

  return (
    <Row className="mt-6">
      <Col md={12}>
        <Card>
          <Card.Header className="bg-white py-4 text-center">
            <h4 className="mb-0">Events per Club</h4>
          </Card.Header>
       <Card.Body className="dashboard-card-body">
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Club Name</th>
        <th>Number of Events</th>
      </tr>
    </thead>
    <tbody>
      {eventsPerClubData.length > 0 ? (
        eventsPerClubData.map((club, index) => (
          <tr key={index}>
            <td>{club.club_name}</td>
            <td>{club.event_count}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2" className="text-center">No data available</td>
        </tr>
      )}
    </tbody>
  </Table>
</Card.Body>

        </Card>
      </Col>
    </Row>
  );
};

export default Row4Charts;
