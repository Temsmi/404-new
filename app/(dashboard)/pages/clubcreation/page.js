'use client'

// Import required modules
import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ClubCreationForm = () => {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [contactInfo, setContactInfo] = useState('');
  const [rules, setRules] = useState(''); 


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
          
            

            {/* Club Name */}
            <Form.Group controlId="clubName" className="mb-3">
            <Form.Label className="text-black fw-bold"> Club Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
                style={{ background: "rgba(255, 255, 255, 0.3)", color: "black" }}
                
              />
            </Form.Group>
            <Form onSubmit={handleSubmit}>
                 <Form.Group controlId="clubLogo" className="mb-3">
                 <Form.Label className="text-black fw-bold"> Club Logo</Form.Label>
                 <Form.Control type="file" accept="image/*" onChange={handleImageUpload} required />
            </Form.Group>

            {/* Club Description */}
            <Form.Group controlId="clubDescription" className="mb-3">
            <Form.Label className="text-black fw-bold">Description</Form.Label>
            <Form.Control
               as="textarea"
               rows={4}
               placeholder="Enter club description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               required
               style={{ background: "rgba(255, 255, 255, 0.3)", color: "black" }}
              />
            </Form.Group>

           
            <Form.Group controlId="clubRules" className="mb-3">
            <Form.Label className="text-black fw-bold"> Club Rules & Guidelines</Form.Label>
            <Form.Control
                as="textarea"
                rows={4}
                placeholder="Define club rules and guidelines"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                required
                style={{ background: "rgba(255, 255, 255, 0.3)", color: "black" }}

              />
            </Form.Group>

            {/* Submit Button */}
            <Button 
               variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  style={{
                    background: "linear-gradient(135deg, rgb(29, 74, 223), rgb(28, 71, 212))",
                    border: "none",
                    padding: "12px 20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  Create Club 
                </Button>
          </Form></div>
        </Col>
      </Row>
    </Container></div>
  );
};

export default ClubCreationForm;
