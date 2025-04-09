'use client';

import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import useMounted from 'hooks/useMounted';  // Custom hook to check mounting status
import styles from 'styles/SignIn.module.scss';

const SignIn = () => {
  const hasMounted = useMounted(); // To handle window/document issues
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      const res = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      setLoading(false); // Stop loading state

      if (!res.ok) {
        setError(result.message || "Login failed, please try again.");
        return;
      }

      // Redirect based on role
      let redirectTo = "/dashboard";
      if (result.role === "president") redirectTo = "/dashboard-president";
      else if (result.role === "member") redirectTo = "/member-dashboard";
      else if (result.role === "non-member") redirectTo = "/nonMember";

      window.location.href = redirectTo;
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.signIn}>
      <div className={styles.overlay}>
        <Row className="align-items-center justify-content-center g-0 min-vh-100">
          <Col xxl={4} lg={5} md={4} xs={12} className="py-8 py-xl-0">
            <Card className={`smooth-shadow-md ${styles.card}`}>
              <Card.Body className="p-7">
                <div className="flex flex-col text-center justify-center min-h-screen">
                  <Image
                    src="/images/brand/logo/logo.png"
                    className="text-center block mx-auto mb-4"
                    style={{ maxWidth: '150px', height: 'auto' }}
                    alt="Logo"
                  />
                </div>

                {hasMounted && (
                  <Form onSubmit={handleLogin}>
                    {/* Email */}
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label className={styles.label}>Email:</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label className={styles.label}>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="**************"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    {/* Error Message */}
                    {error && <p className="text-danger">{error}</p>}

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button variant="primary" size="md" type="submit" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>

                    <div className="d-md-flex justify-content-between mt-4">
                      <Link href="/authentication/sign-up" className={`fs-5 ${styles.label}`}>
                        Create An Account
                      </Link>
                      <Link href="/authentication/forget-password" className={`fs-5 ${styles.label}`}>
                        Forgot your password?
                      </Link>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SignIn;