'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Row, Col, Card } from 'react-bootstrap';
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
          <Card.Body style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventsPerClubData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 80
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="club_name"
                  interval={0}
                  angle={-60}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="event_count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Row4Charts;
