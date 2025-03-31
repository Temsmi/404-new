'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

const ClubDescription = () => {
    const [clubData, setClubData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch("/api/clubprofile")
            .then((res) => res.json())
            .then((data) => {
                if (data) setClubData(data);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.url) {
                setClubData({ ...clubData, logo: data.url });
            }
        })
        .catch((error) => console.error("File upload error:", error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/clubprofile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Club updated successfully!');
                setIsEditing(false);
            } else {
                alert('Error updating club: ' + result.error);
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <Container className="py-5">
            {clubData ? (
                <Row className="align-items-center">
                    <Col md={4} className="text-center">
                        <img
                            src={clubData.logo ? `/images/ClubsLogo/${clubData.logo}` : "/images/default-logo.png"}
                            alt="Club Logo"
                            className="img-fluid rounded"
                            style={{ maxWidth: '300px' }}
                            onError={(e) => e.target.src = "/images/default-logo.png"}
                        />
                    </Col>
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
                <p className="text-center">Loading Club Data...</p>
            )}

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
                                onChange={handleFileChange}
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