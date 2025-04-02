'use client'

import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const EventCreationForm = () => {
    const [eventData, setEventData] = useState({
        eventName: '',
        description: '',
        eventTime:'',
        dateSelected: '',
        isPostFeedback: 'no',
        zoomMeeting: 'no',
        zoomLink: '',
        eventImage: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, eventImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('eventName', eventData.eventName);
        formData.append('description', eventData.description);
        formData.append('eventTime', eventData.eventTime);
        formData.append('dateSelected', eventData.dateSelected);
        formData.append('isPostFeedback', eventData.isPostFeedback === 'yes' ? 'true' : 'false');
        formData.append('zoomLink', eventData.zoomMeeting === 'yes' ? eventData.zoomLink : '');

        if (eventData.eventImage) {
            formData.append('eventImage', eventData.eventImage);
        }

        const response = await fetch('/api/eventcreation', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',  // Ensure the session cookie is sent along with the request
        });
        const data = await response.json();  

        if (response.ok) {
            alert('Event created successfully!');
            setEventData({
                eventName: '',
                description: '',
                eventTime: '',
                dateSelected: '',
                isPostFeedback: 'no',
                zoomMeeting: 'no',
                zoomLink: '',
                eventImage: null
            });
        } else {
            alert(`Failed to create event: ${data.error || 'Unknown error'}`);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="p-4 w-100" style={{ maxWidth: '500px' }}>
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
                            name="description"
                            value={eventData.description}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="eventTime"
                            value={eventData.eventTime}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateSelected"
                            value={eventData.dateSelected}
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
                                name="isPostFeedback"
                                value="yes"
                                checked={eventData.isPostFeedback === 'yes'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                inline
                                label="No"
                                type="radio"
                                name="isPostFeedback"
                                value="no"
                                checked={eventData.isPostFeedback === 'no'}
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
