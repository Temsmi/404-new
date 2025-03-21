'use client';

import { useState } from 'react';

const suggestions = [
  { id: 1, name: 'Alice', message: 'We need better internet.', date: '2025-03-18', status: 'Pending' },
  { id: 2, name: 'Bob', message: 'Extend gym hours.', date: '2025-03-17', status: 'Reviewed' },
  { id: 3, name: 'Charlie', message: 'More vegetarian options in the cafeteria.', date: '2025-03-16', status: 'Pending' },
];

export default function SuggestionsPage() {
  const [data, setData] = useState(suggestions);

  const handleStatusChange = (id, newStatus) => {
    setData(data.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light py-5">
      <div className="card shadow p-4 w-75">
        <h1 className="text-center text-primary mb-4">Member Suggestions & Complaints</h1>
        
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.message}</td>
                  <td>{item.date}</td>
                  <td className={item.status === 'Pending' ? 'text-danger' : 'text-success'}>
                    {item.status}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleStatusChange(item.id, 'Reviewed')} 
                      className="btn btn-warning btn-sm me-2"
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => handleStatusChange(item.id, 'Resolved')} 
                      className="btn btn-success btn-sm"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
