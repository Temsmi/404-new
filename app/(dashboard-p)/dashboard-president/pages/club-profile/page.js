'use client';

import { useState, useRef } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const ClubDescription = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [clubData, setClubData] = useState({
        name: 'Tech Innovators Club',
        logo: '/club-logo.png', // Replace with actual path
        description: 'A club dedicated to technological innovation, coding, and networking opportunities for students.',
    });

    const editRef = useRef(null);

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            editRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClubData({ ...clubData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        console.log('Updated Club Data:', clubData);
    };

    return (
        <Container className="py-5">
            <Row className="align-items-center">
                {/* Big Club Logo */}
                <Col md={4} className="text-center">
                    <img
                        src={clubData.logo}
                        alt="Club Logo"
                        className="img-fluid rounded"
                        style={{ maxWidth: '300px' }} // Increased size
                    />
                </Col>

                {/* Club Info Box Left-Aligned */}
                <Col md={8}>
                    <Card className="p-4 shadow-sm" style={{ textAlign: 'left', maxWidth: '600px' }}>
                        <h2 className="mb-3">{clubData.name}</h2>
                        <p className="lead">{clubData.description}</p>

                        {/* Edit Button Right-Aligned & Slightly Lower */}
                        <div className="text-end mt-3" style={{ marginRight: '10px' }}>
                            <Button variant="primary" onClick={handleEditClick}>Edit</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Edit Section */}
            {isEditing && (
                <div ref={editRef} className="mx-auto mt-4" style={{ maxWidth: '700px'}}>
                    <h4 className="text-center mb-3" style={{ marginTop: '55px' }}>Edit Club Information</h4>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Club Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={clubData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Club Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={clubData.description}
                                onChange={handleChange}
                                rows={3}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Club Logo</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setClubData({ ...clubData, logo: URL.createObjectURL(e.target.files[0]) })}
                            />
                        </Form.Group>

                        <div className="text-center" style={{ marginTop: '30px' }}>
                            <Button variant="success" type="submit" >Save Changes</Button>
                            <Button variant="secondary" className="ms-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default ClubDescription;
