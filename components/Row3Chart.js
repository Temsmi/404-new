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

  // 👉 Dynamic height: 40px per club, minimum 400px
  const chartHeight = Math.max(membersPerClubData.length * 40, 400);

  return (
    <Row className="mt-6">
      <Col md={12}>
        <Card>
          <Card.Header className="bg-white py-4 text-center">
            <h4 className="mb-0">Members per Club</h4>
          </Card.Header>
          <Card.Body style={{ height: `${chartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={membersPerClubData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 150,
                  bottom: 20
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
              <YAxis
  dataKey="club_name"
  type="category"
  width={70} // smaller, prevents large left space
  tick={{ fontSize: 12 }} // optional, smaller font looks better
/>
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
