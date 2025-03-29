'use client'

import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';
import styles from 'styles/SignIn.module.scss';

const SignIn = () => {
  const hasMounted = useMounted();
  return (
    <div className={styles.signIn}>
      <div className={styles.overlay}>
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={5} md={4} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className={`smooth-shadow-md ${styles.card}`}>
        
          {/* Card body */}
          <Card.Body className="p-7">
          <div className="flex flex-col text-center justify-center min-h-screen">
              <Image src="/images/brand/logo/logo.png"   className="text-center block mx-auto  mb-4 " style={{ maxWidth: "150px", height: "auto" }}  alt="" />
            </div>
            {/* Form */}
            {hasMounted &&
              <Form>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className={styles.label}>Email:</Form.Label>
                  <Form.Control type="email" name="username" placeholder="Enter address here" required />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className={styles.label}>Password:</Form.Label>
                  <Form.Control type="password" name="password" placeholder="**************" required/>
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label className={styles.label}>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" size="md" className="me-1" type="submit">Sign In</Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link href="/authentication/sign-up" className={`fs-5 ${styles.label}`}>Create An Account </Link>
                    </div>
                    <div>
                      <Link href="/authentication/forget-password" className={`fs-5 ${styles.label}`}>Forgot your password?</Link>
                    </div>
                  </div>
                </div>
              </Form>}


          </Card.Body>
        </Card>
      </Col>
    </Row></div>
    </div>

  )
}


export default SignIn