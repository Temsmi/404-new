'use client'
import { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ClubCreationForm = () => {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null); // Ref برای پاک کردن مقدار فایل

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
      const res = await fetch('/api/clubcreation', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Club created successfully!');
        
        // Reset form fields
        setClubName('');
        setDescription('');
        setLogo(null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // این مقدار را پاک می‌کند
        }
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to create club. Please try again.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="p-4 rounded shadow-lg">
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
                    ref={fileInputRef} // مقدار را پاک می‌کند
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
                  Create Club
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
