'use client';

import { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const EventLogs = () => {
    const router = useRouter();

    // Sample event logs
    const [events] = useState([
        { id: 1, name: 'Music Festival', date: '2025-04-10', status: 'Approved' },
        { id: 2, name: 'Food Fair', date: '2025-05-15', status: 'Denied' },
        { id: 3, name: 'Tech Meetup', date: '2025-06-20', status: 'Pending' }
    ]);

    const handleEdit = (id) => {
        router.push(`/dashboard-president/pages/event-edition?id=${id}`);
    };

    return (
        <Container className="mt-4">
            <h3 className="mb-4 text-center">Events Logs</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Event Name</th>
                        <th>Date of Event</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={event.id}>
                            <td>{index + 1}</td>
                            <td>{event.name}</td>
                            <td>{event.date}</td>
                            <td>
                                <span
                                    className={`badge ${
                                        event.status === 'Approved'
                                            ? 'bg-success'
                                            : event.status === 'Pending'
                                            ? 'bg-warning text-dark'
                                            : 'bg-danger'
                                    }`}
                                >
                                    {event.status}
                                </span>
                            </td>
                            <td>
                                {event.status !== 'Approved' && (
                                    <Button variant="warning" size="md" onClick={() => handleEdit(event.id)}>
                                        Edit
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default EventLogs;
