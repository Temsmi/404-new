'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28', '#FF4444'];

const Row2Charts = () => {
  const [activeInactiveData, setActiveInactiveData] = useState([]);
  const [requestTypesData, setRequestTypesData] = useState([]);

  useEffect(() => {
    fetch('/api/metrics-admin')
      .then(res => res.json())
      .then(data => {
        let activeInactive = [];

        const active = Number(data.active_vs_inactive.active) || 0;
        const inactive = Number(data.active_vs_inactive.inactive) || 0;

        if (inactive === 0) {
          activeInactive = [
            { name: 'Active', value: active }
          ];
        } else {
          activeInactive = [
            { name: 'Active', value: active },
            { name: 'Inactive', value: inactive }
          ];
        }

        setActiveInactiveData(activeInactive);

        const reqTypes = Object.entries(data.request_types).map(([key, value]) => ({
          name: key,
          value: Number(value)
        }));
        setRequestTypesData(reqTypes);
      })
      .catch(err => console.error('Error loading metrics:', err));
  }, []);

  return (
    <Row className="mt-6">
      <Col md={6} className="d-flex justify-content-center">
        <Card style={{ width: '450px' }}>
          <Card.Header className="bg-white py-4 text-center">
            <h4 className="mb-0">Active vs Inactive Clubs</h4>
          </Card.Header>
          <Card.Body className="d-flex justify-content-start">
            <PieChart width={350} height={350}>
              <Pie
                data={activeInactiveData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                labelLine={false}
                label={({ value }) => `${Math.round(value)}`}
              >
                {activeInactiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} className="d-flex justify-content-center">
        <Card style={{ width: '450px' }}>
          <Card.Header className="bg-white py-4 text-center">
            <h4 className="mb-0">Request Types</h4>
          </Card.Header>
          <Card.Body className="d-flex justify-content-start">
            <PieChart width={350} height={350}>
              <Pie
                data={requestTypesData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                labelLine={false}
                label={({ value }) => `${Math.round(value)}`}
              >
                {requestTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Row2Charts;
