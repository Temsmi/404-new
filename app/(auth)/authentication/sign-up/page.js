'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import styles from 'styles/SignIn.module.scss';

// import hooks
import useMounted from 'hooks/useMounted';

const SignUp = () => {
  const hasMounted = useMounted();
  return (
    <div className={styles.signIn}>
      <div className={styles.pageContainer}>
          <div className={styles.overlay}>
          <Row className="align-items-center justify-content-center g-0 py-5">
      <Col xxl={4} lg={5} md={4} xs={12} className="py-5">
        {/* Card */}
        <Card className={`smooth-shadow-md ${styles.cardUp}`}>
          {/* Card body */}
          <Card.Body className="p-7">
          <div className="flex flex-col text-center justify-center min-h-screen">
            <Image src="/images/brand/logo/logo.png"   className="text-center block mx-auto  mb-4 " style={{ maxWidth: "150px", height: "auto" }}  alt="" />
            </div>
            {/* Form */}
            {hasMounted && 
            <Form >
              <h3 className={`text-center ${styles.label}`}>Sign Up</h3>
              {/* User name */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className={styles.label}>Name:</Form.Label>
                <Form.Control type="text" name="username" placeholder="Enter Name" required="" />
              </Form.Group>

              {/* Surname */}
              <Form.Group className="mb-3" controlId="sname">
                <Form.Label className={styles.label}>Surname:</Form.Label>
                <Form.Control type="text" name="sname" placeholder="Enter Surname" required="" />
              </Form.Group>

              {/* Student number */}
              <Form.Group className="mb-3" controlId="stdno">
                <Form.Label className={styles.label}>Student Number:</Form.Label>
                <Form.Control type="text" name="stdno" placeholder=" Enter Student Number" required="" />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className={styles.label}>Email address:</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter address here" required="" />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className={styles.label}>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required="" />
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label className={styles.label}>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirm-password" placeholder="**************" required="" />
              </Form.Group>

              {/* Checkbox */}
              <div className="mb-3">
                <Form.Check type="checkbox" id="check-api-checkbox">
                  <Form.Check.Input type="checkbox" required/>
                  <Form.Check.Label>
                    I agree to the <Link href="#" className={styles.link}> Student Club Rules and Regulations </Link>
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
                    <Link className={`fs-5 ${styles.link}`} href="/authentication/sign-in">Already member? Login </Link>
                  </div>
                  <div>
                    <Link href="/authentication/forget-password" className={`fs-5 ${styles.label}`}>Forgot your password?</Link>
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
    </div>
  )
}

export default SignUp