'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const PieChartPresident = ({ data, chartType }) => {
  if (!data || data.length === 0) {
    return <div>No request data available.</div>;
  }

  const requestsByType = useMemo(() => {
    const typeTotals = {};
    data.forEach(item => {
      typeTotals[item.type] = (typeTotals[item.type] || 0) + item.total;
    });
    return Object.entries(typeTotals).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value
    }));
  }, [data]);

  const anonymousSplit = useMemo(() => {
    let anonymous = 0;
    let nonAnonymous = 0;
    data.forEach(item => {
      if (item.anonymous === 1) {
        anonymous += item.total;
      } else {
        nonAnonymous += item.total;
      }
    });
    return [
      { name: 'Anonymous', value: anonymous },
      { name: 'Non-Anonymous', value: nonAnonymous }
    ];
  }, [data]);

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AA336A', '#66CC66'];

  const pieData = chartType === 'byType' ? requestsByType : anonymousSplit;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ marginTop: '10px' }}>
        {pieData.map((entry, index) => (
          <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: '8px'
              }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartPresident;
