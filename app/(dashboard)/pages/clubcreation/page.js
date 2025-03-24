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
    <div
    className="d-flex align-items-center justify-content-center min-vh-100"
    style={{
      backgroundImage: "url('/images/background/club-bg.jpg')", // Background image
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backdropFilter: "blur(8px)",
    }}
  >
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
        <div
              className="p-4 rounded shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.2)", // Transparent white
                backdropFilter: "blur(15px)", // Glassmorphism effect
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.2)",
                padding: "30px",
              }}
            >
          <h2 className="text-center mb-4">Create a Club</h2>
          <Form onSubmit={handleSubmit}>
            

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
            <Button 
                 variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  style={{
                    background: "linear-gradient(135deg,rgb(29, 74, 223),rgb(28, 71, 212))",
                    border: "none",
                    padding: "10px 15px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = "0.8")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  Create Club 🚀
                </Button>
          </Form></div>
        </Col>
      </Row>
    </Container></div>
  );
};

export default ClubCreationForm;
