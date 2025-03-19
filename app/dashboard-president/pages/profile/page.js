'use client'

// Import necessary libraries
import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const EventCreationForm = () => {
    const [eventData, setEventData] = useState({
        eventName: '',
        eventDesc: '',
        eventDate: '',
        eventImage: null,
        includeFeedback: 'no',
        zoomMeeting: 'no',
        zoomLink: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, eventImage: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Event Data:', eventData);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4" style={{ width: '500px' }}>
                <h3 className="mb-4 text-center">Create Event</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="eventName"
                            value={eventData.eventName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="eventDesc"
                            value={eventData.eventDesc}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="eventDate"
                            value={eventData.eventDate}
                            onChange={handleChange}
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
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Include Post-Feedback?</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                label="Yes"
                                type="radio"
                                name="includeFeedback"
                                value="yes"
                                checked={eventData.includeFeedback === 'yes'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                inline
                                label="No"
                                type="radio"
                                name="includeFeedback"
                                value="no"
                                checked={eventData.includeFeedback === 'no'}
                                onChange={handleChange}
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
                                checked={eventData.zoomMeeting === 'yes'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                inline
                                label="No"
                                type="radio"
                                name="zoomMeeting"
                                value="no"
                                checked={eventData.zoomMeeting === 'no'}
                                onChange={handleChange}
                            />
                        </div>
                    </Form.Group>

                    {eventData.zoomMeeting === 'yes' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Zoom Meeting Link</Form.Label>
                            <Form.Control
                                type="url"
                                name="zoomLink"
                                value={eventData.zoomLink}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    )}

                    <Button variant="primary" type="submit" className="w-100">Submit</Button>
                </Form>
            </div>
        </Container>
    );
};

export default EventCreationForm;