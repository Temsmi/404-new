'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';

const ForgetPassword = () => {
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
     
    }}>
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
                <Form.Control type="email" name="email" placeholder="Enter Your Email" />
              </Form.Group><br></br>
              {/* Button */}
              <div className="mb-3 d-grid">
                <Button variant="primary" type="submit" style={{ color: "#F5F5DC" }}>Reset Password</Button>
              </div>
              
              {/* <span style={{ color: "#F5F5DC" }}>Don&apos;t have an account? <Link href="/authentication/sign-in" style={{ color: "#F5F5DC" }} >Sign In</Link></span> */}
            </Form>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row></div></div>
  )
}

export default ForgetPassword