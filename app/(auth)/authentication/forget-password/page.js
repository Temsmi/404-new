'use client';

import { useState } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setEmail('');
        setNewPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/background/newactivity.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: '100vh',
        width: "100vw",
        backgroundAttachment: "fixed",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        left: "0",
        top: "0",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "rgba(0, 0, 0, 0.26)",
          backdropFilter: "blur(8px)",
          zIndex: 0,
        }}
      >
        <Row className="align-items-center justify-content-center g-0 min-vh-100">
          <Col xxl={4} lg={5} md={4} xs={12} className="py-8 py-xl-0">
            <Card
              className="smooth-shadow-md"
              style={{
                background: "rgba(90, 85, 85, 0.49)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(27, 26, 26, 0.61)",
                borderRadius: "12px",
                color: "#F5F5DC",
                width: "100%",
                maxWidth: "500px",
                padding: "20px",
                cursor: 'pointer',
                transition: "all '.3s'",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card.Body className="p-6">
                <div className="flex flex-col text-center justify-center min-h-screen">
                  <Link href="/">
                    <Image
                      src="/images/brand/logo/logo.png"
                      className="text-center block mx-auto  mb-2"
                      style={{ maxWidth: "140px", height: "auto" }}
                      alt=""
                    />
                  </Link>
                </div>

                <Form onSubmit={handleReset}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ color: "#F5F5DC" }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label style={{ color: "#F5F5DC" }}>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="mb-3 d-grid">
                    <Button variant="primary" type="submit" disabled={loading} style={{ color: "#F5F5DC" }}>
                      {loading ? 'Updating...' : 'Reset Password'}
                    </Button>
                  </div>

                  <span style={{ color: "#F5F5DC" }}>
                    Already have an account?{' '}
                    <Link href="/authentication/sign-in" style={{ color: "#F5F5DC" }}>
                      Sign In
                    </Link>
                  </span>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResetPassword;
