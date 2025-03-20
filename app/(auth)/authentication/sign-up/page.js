'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';

const SignUp = () => {
  const hasMounted = useMounted();
  return (
    <div
    className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
    style={{
      
      backgroundImage: "url('/images/background/newactivity.jpg')", 
      backgroundSize:  "cover",
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
          background: "rgba(0, 0, 0, 0.26)", // Dark overlay
          backdropFilter: "blur(8px)", // More blur for a stronger glass effect
          zIndex: 0,
        }}
      >
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={5} md={4} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/"><Image src="/images/brand/logo/logo-primary.svg" className="mb-2" alt="" /></Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            {hasMounted && 
            <Form>
              {/* Username */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username or email</Form.Label>
                <Form.Control type="text" name="username" placeholder="User Name" required="" />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter address here" required="" />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required="" />
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirm-password" placeholder="**************" required="" />
              </Form.Group>

              {/* Checkbox */}
              <div className="mb-3">
                <Form.Check type="checkbox" id="check-api-checkbox">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>
                    I agree to the <Link href="#"> Terms of Service </Link> and <Link href="#"> Privacy Policy.</Link>
                  </Form.Check.Label>
                </Form.Check>
              </div>

              <div>
                {/* Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit">Create Free Account</Button>
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    <Link href="/authentication/sign-in" className="fs-5">Already member? Login </Link>
                  </div>
                  <div>
                    <Link href="/authentication/forget-password" className="text-inherit fs-5" style={{ color: "#F5F5DC" }}>Forgot your password?</Link>
                  </div>
                </div>
              </div>
            </Form>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </div>
    </div>
  )
}

export default SignUp