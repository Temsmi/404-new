'use client';
import { useState, useEffect } from 'react';
import { Col, Row, Form, Card, Button, Spinner, Alert } from 'react-bootstrap';

const Preferences = () => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formData = new FormData();
      if (selectedImageFile) {
        formData.append("profile_picture", selectedImageFile);
      }

      const response = await fetch('/api/setting', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setErrorMessage(result.error || "Update failed.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Preferences</h4>
          <p className="mb-0 fs-5 text-muted">Configure your profile picture</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card id="preferences">
          <Card.Body>
            <div className="mb-4">
              <h4 className="mb-1">Personal Details</h4>
            </div>
            <Form onSubmit={handleSubmit}>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              {/* Profile Picture */}
              <Form.Group as={Row} className="mb-3" controlId="profilePicture">
                <Form.Label column md={4}>Profile Picture</Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImageFile(e.target.files[0])}
                  />
                </Col>
              </Form.Group>

              {/* Submit Button */}
              <Form.Group as={Row} className="mb-3">
                <Col md={{ offset: 4, span: 8 }}>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? <><Spinner size="sm" animation="border" /> Saving...</> : "Save Changes"}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Preferences;
