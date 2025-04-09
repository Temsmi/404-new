'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const EventLogs = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

    const handleEdit = (event) => {
        setSelectedEvent(event);
        console.log(event);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedEvent((prev) => ({
            ...prev,
            eventImage: file,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('eventName', selectedEvent.name);
        formData.append('description', selectedEvent.description);
        formData.append('eventTime', selectedEvent.time);
        formData.append('dateSelected', selectedEvent.date);
        formData.append('isPostFeedback', selectedEvent.feedback);
        formData.append('zoomLink', selectedEvent.link);
        formData.append('eventImage', selectedEvent.image);

        if (selectedEvent.image) {
            formData.append('eventImage', selectedEvent.image);
        }

        try {
            const response = await fetch(`/api/eventlogs/${selectedEvent.id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert('Event updated successfully!');
                setShowModal(false);
                setSelectedEvent(null);
                const updatedEvents = await fetch('/api/eventlogs');
                const updatedData = await updatedEvents.json();
                setEvents(updatedData);
            } else {
                alert('Error updating event: ' + data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleAnnounce = (eventName) => {
        alert(`Announcing event: ${eventName}`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
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
                                    <Button variant="warning" onClick={() => handleEdit(event)}>
                                        Edit
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <Form onSubmit={handleSaveChanges}>
                            <Form.Group className="mb-3">
                                <Form.Label>Event Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="eventName"
                                    value={selectedEvent.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Event Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={selectedEvent.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Event Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="eventTime"
                                    value={selectedEvent.time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Event Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateSelected"
                                    value={selectedEvent.date ? new Date(selectedEvent.date).toISOString().slice(0, 10) : ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Event Image (Optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="eventImage"
                                    onChange={handleFileChange}
                                />
                                {selectedEvent.eventImage ? (
                                    <div className="mt-2">
                                        <strong>Current Image: </strong>{selectedEvent.image.name}
                                    </div>
                                ) : (
                                    selectedEvent.image && (
                                        <div className="mt-2">
                                            <strong>Current Image: </strong>{selectedEvent.image}
                                        </div>
                                    )
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Include Post-Feedback?</Form.Label>
                                <div>
                                    <Form.Check
                                        inline
                                        label="Yes"
                                        type="radio"
                                        name="isPostFeedback"
                                        value="yes"
                                        checked={selectedEvent.feedback === 1}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        type="radio"
                                        name="isPostFeedback"
                                        value="no"
                                        checked={selectedEvent.feedback === 0}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Include Zoom Meeting Link?</Form.Label>
                                <div>
                                    <Form.Check
                                        inline
                                        label="Yes"
                                        type="radio"
                                        name="zoomMeeting"
                                        value="yes"
                                        checked={selectedEvent.link === 'yes'}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        type="radio"
                                        name="zoomMeeting"
                                        value="no"
                                        checked={selectedEvent.link === 'no'}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </Form.Group>

                            {selectedEvent.zoomMeeting === 'yes' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Zoom Meeting Link</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="zoomLink"
                                        value={selectedEvent.link}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            )}

                            <Button variant="success" type="submit" className="w-100">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EventLogs;
