'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const EventLogs = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/eventlogs');
                const data = await response.json();
                if (response.ok) {
                    setEvents(data);
                } else {
                    console.error('Error fetching events:', data.error);
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleEdit = (id) => {
        router.push(`/event-edition/${id}`);
    };

    const handleAnnounce = (eventName) => {
        alert(`Announcing event: ${eventName}`);
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h3 className="mb-4 text-center">Events Logs</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={event.id}>
                            <td>{index + 1}</td>
                            <td>{event.name}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
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
                                {event.status === 'Approved' ? (
                                    <Button variant="primary" onClick={() => handleAnnounce(event.name)}>
                                        Announce
                                    </Button>
                                ) : (
                                    <Button variant="warning" onClick={() => handleEdit(event.id)}>
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
