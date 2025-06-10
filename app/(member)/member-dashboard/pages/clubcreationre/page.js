'use client';

import { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import PreviousRequestsButton from '../../components/PreviousRequestsButton';

const ClubCreationForm = () => {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('clubName', clubName);
    formData.append('description', description);
    if (logo) {
      formData.append('clubLogo', logo);
    }

    try {
      const res = await fetch('/api/clubcreationre', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('The Request has been Submitted successfully!');
        setClubName('');
        setDescription('');
        setLogo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to send request to create club. Please try again.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="p-4 rounded shadow bg-white">
              {/* ✅ Button Top Right */}
              <div className="d-flex justify-content-end mb-3">
                <PreviousRequestsButton className="btn btn-outline-primary btn-sm" />
              </div>

              <h2 className="text-center mb-4">Create a Club</h2>

              <Form onSubmit={handleSubmit}>
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

                <Form.Group controlId="clubLogo" className="mb-3">
                  <Form.Label>Club Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    required
                  />
                </Form.Group>

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

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Send Request
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClubCreationForm;
