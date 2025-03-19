'use client'

import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';

const SignIn = () => {
  const hasMounted = useMounted();
  return (
    <div
<<<<<<< HEAD
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
=======
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
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={5} md={4} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md"
<<<<<<< HEAD
         style={{
          background: "rgba(70, 67, 67, 0.66)", // Glassmorphism effect
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(27, 26, 26, 0.61)", // Subtle border
          borderRadius: "12px",
          color: "#F5F5DC", // Beige text
          width: "100%", // Maintain responsiveness
          maxWidth: "500px", // Proper width
          padding: "20px",
=======
        style={{
          background: "rgba(90, 85, 85, 0.49)", // Glassmorphism effect
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(54, 52, 52, 0.77)", // Subtle border
          borderRadius: "12px",
          color: "#F5F5DC", // Beige text
          width: "100%", // Reduce width of card
          maxWidth: "450px",
          position: 'justify-center,align-center, fixed',
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
          cursor: 'pointer',
          transition: "all '.3s'",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Card body */}
<<<<<<< HEAD
          <Card.Body className="p-6">
          <div className="flex flex-col text-center justify-center min-h-screen">
          <Link href="/"><Image src="/images/brand/logo/logo.png"   className="text-center block mx-auto  mb-3 " style={{ maxWidth: "150px", height: "auto" }}  alt="" /></Link>
          </div>{/* Form */}
=======
          <Card.Body className="p-7">
          <div className="flex flex-col text-center justify-center min-h-screen">
              <Link href="/"><Image src="/images/brand/logo/logo.png"   className="text-center block mx-auto  mb-4 " style={{ maxWidth: "150px", height: "auto" }}  alt="" /></Link>
            </div>
            {/* Form */}
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
            {hasMounted &&
              <Form>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
<<<<<<< HEAD
                  <Form.Label style={{ color: "#F5F5DC" }}>Username or email</Form.Label>
                  <Form.Control type="email" name="username" placeholder="Enter address here" required="" />
=======
                  <Form.Label style={{ color: "#F5F5DC" }}>Email:</Form.Label>
                  <Form.Control type="email" name="username" placeholder="Enter address here" required />
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
<<<<<<< HEAD
                  <Form.Label style={{ color: "#F5F5DC" }}>Password</Form.Label>
                  <Form.Control type="password" name="password" placeholder="**************" required="" />
=======
                  <Form.Label style={{ color: "#F5F5DC" }}>Password:</Form.Label>
                  <Form.Control type="password" name="password" placeholder="**************" required/>
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label style={{ color: "#F5F5DC" }}>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
<<<<<<< HEAD
                    <Button variant="primary" type="submit" style={{ color: "#F5F5DC" }}>Sign In</Button>
=======
                    <Button variant="primary" size="md" className="me-1" type="submit">Sign In</Button>
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link href="/authentication/sign-up" className="fs-5" style={{ color: "#F5F5DC" }}>Create An Account </Link>
                    </div>
                    <div>
<<<<<<< HEAD
                      <Link href="/authentication/forget-password" className="text-inherit fs-5"style={{ color: "#F5F5DC" }}>Forgot your password?</Link>
=======
                      <Link href="/authentication/forget-password" className="text-inherit fs-5" style={{ color: "#F5F5DC" }}>Forgot your password?</Link>
>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
                    </div>
                  </div>
                </div>
              </Form>}


          </Card.Body>
        </Card>
      </Col>
<<<<<<< HEAD
    </Row></div></div>
=======
    </Row></div>
    </div>

>>>>>>> 7f29e9167f3e0dfa2823196b4df22d507b19fa59
  )
}


export default SignIn