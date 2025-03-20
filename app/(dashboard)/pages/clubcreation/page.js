'use client'

// Import required modules
import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ClubCreationForm = () => {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);

  const handleImageUpload = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      clubName,
      description,
      logo
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Create a Club</h2>
          <Form onSubmit={handleSubmit}>
            {/* Club Logo Upload */}
            <Form.Group controlId="clubLogo" className="mb-3">
              <Form.Label>Club Logo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>

            {/* Club Name */}
            <Form.Group controlId="clubName" className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Club Description */}
            <Form.Group controlId="clubDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter club description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Create Club
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ClubCreationForm;
