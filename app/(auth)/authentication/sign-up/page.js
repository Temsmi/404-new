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
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md"
         style={{
          background: "rgba(90, 85, 85, 0.49)", // Glassmorphism effect
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(54, 52, 52, 0.77)", // Subtle border
          borderRadius: "12px",
          color: "#F5F5DC", // Beige text
          width: "100%", // Reduce width of card
          maxWidth: "450px",
          position: 'justify-center,align-center, fixed',
          cursor: 'pointer',
          transition: "all '.3s'",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Card body */}
          <Card.Body className="p-6">
          <div className="flex flex-col text-center justify-center min-h-screen">
              <Link href="/"><Image src="/images/brand/logo/logo.png"   className="text-center block mx-auto  mb-2 " style={{ maxWidth: "150px", height: "auto" }}  alt="" /></Link>
            </div>
            {/* Form */}
            {hasMounted && 
            <Form>
             

              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label style={{ color: "#F5F5DC" }}>Email:</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter address here" required="" />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label style={{ color: "#F5F5DC" }}>Password:</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required="" />
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label style={{ color: "#F5F5DC" }}>Confirm Password:</Form.Label>
                <Form.Control type="password" name="confirm-password" placeholder="**************" required="" />
              </Form.Group>

              {/* Checkbox */}
              <div className="mb-3">
                <Form.Check type="checkbox" id="check-api-checkbox">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label style={{ color: "#F5F5DC" }}>
                    I agree to the <Link href="#"style={{ color: "#F5F5DC" }}> Terms of Service </Link> and <Link href="#"style={{ color: "#F5F5DC" }}> Privacy Policy.</Link>
                  </Form.Check.Label>
                </Form.Check>
              </div>

              <div>
                {/* Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit">Create Account</Button>
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0" style={{ color: "#F5F5DC" }}>
                    <Link href="/authentication/sign-in" className="fs-5" style={{ color: "#F5F5DC" }}>Already a member? Login </Link>
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
    </Row></div>
    </div>
  )
}

export default SignUp