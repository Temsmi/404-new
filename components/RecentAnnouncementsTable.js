'use client';

import React from 'react';
import { Table } from 'react-bootstrap';

const RecentAnnouncementsTable = ({ data }) => {

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No recent announcements in the last month.</div>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Announcement Text</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td dangerouslySetInnerHTML={{ __html: item.text }}></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RecentAnnouncementsTable;
