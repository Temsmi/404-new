'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const ClubDescription = () => {
    const [clubData, setClubData] = useState(null);  // Initialize as null for better loading state
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch("/api/clubprofile")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Data:", data);  // Log API response

                if (!data) {
                    console.error("API response is empty:", data);
                    return;
                }

                // Assuming the response is an object, not an array
                const club = data;  // Directly use the object since it isn't an array
                if (!club) {
                    console.error("Club data not found in API response:", data);
                    return;
                }

                setClubData(club);  // Set the club data directly
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

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
            {clubData ? (  // If data exists, show club info
                <Row className="align-items-center">
                    {/* Club Logo */}
                    <Col md={4} className="text-center">
                        <img
                            src={`/images/ClubsLogo/${clubData.logo}`}  // Fix path
                            alt="Club Logo"
                            className="img-fluid rounded"
                            style={{ maxWidth: '300px' }}
                            onError={(e) => e.target.src = "/images/default-logo.png"}  // Handle broken image
                        />
                    </Col>

                    {/* Club Info */}
                    <Col md={8}>
                        <Card className="p-4 shadow-sm" style={{ textAlign: 'left', maxWidth: '600px' }}>
                            <h2 className="mb-3">{clubData.name}</h2>
                            <p className="lead">{clubData.description}</p>

                            <div className="text-end mt-3" style={{ marginRight: '10px' }}>
                                <Button variant="primary" onClick={handleEditClick}>Edit</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <p className="text-center">Loading Club Data...</p>  // Handle empty state
            )}

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
                                value={clubData.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Club Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={clubData.description || ""}
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
                            <Button variant="success" type="submit">Save Changes</Button>
                            <Button variant="secondary" className="ms-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default ClubDescription;
