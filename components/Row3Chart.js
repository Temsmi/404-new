'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Row3Chart = () => {
  const [membersPerClubData, setMembersPerClubData] = useState([]);

  useEffect(() => {
    fetch('/api/metrics-admin')
      .then(res => res.json())
      .then(data => {
        setMembersPerClubData(data.members_per_club || []);
      })
      .catch(err => console.error('Error loading members per club:', err));
  }, []);

  return (
    <Row className="mt-6">
      <Col md={12}>
        <Card>
          <Card.Header className="bg-white py-4 text-center">
            <h4 className="mb-0">Members per Club</h4>
          </Card.Header>
          <Card.Body style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={membersPerClubData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 40
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="club_name" angle={-45} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="member_count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Row3Chart;
