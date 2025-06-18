'use client'

import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import styles from 'styles/SignIn.module.scss';
import departments from "data/code/departments";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter(); 
  const [state, setState] = useState({ errors: {} });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data["confirm-password"]) {
      setState({ ...state, errors: { password: ["Passwords do not match"] } });
      return;
    }
    
    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setState((prevState) => ({
          ...prevState,
          errors: result.errors || { message: result.message },
        }));
        return;
      }

      const redirectUrl = result.redirectTo || "/authentication/sign-in";

      router.push(redirectUrl); 

    } catch (error) {
      console.error("Signup failed:", error);
      setState((prevState) => ({
        ...prevState,
        errors: { message: "Something went wrong. Please try again." },
      }));
    }
  };

  
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
            {
            <Form onSubmit={handleSubmit}>
              <h3 className={`text-center ${styles.label}`}>Sign Up</h3>
              {/* User name */}
              <Form.Group className="mb-3" controlId="name">
                <Form.Label className={styles.label}>Name:</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter Name" required="" 
                value={state.name || ''} 
                onChange={(e) => setState({ ...state, name: e.target.value })}/>
              </Form.Group>
              {state?.errors?.name && <p>{state.errors.name}</p>}
              {/* Surname */}
              <Form.Group className="mb-3" controlId="sname">
                <Form.Label className={styles.label}>Surname:</Form.Label>
                <Form.Control type="text" name="sname" placeholder="Enter Surname" required="" />
              </Form.Group>
              {state?.errors?.sname && <p>{state.errors.sname}</p>}
              {/* Student number */}
              <Form.Group className="mb-3" controlId="stdno">
                <Form.Label className={styles.label}>Student Number:</Form.Label>
                <Form.Control type="text" name="stdno" placeholder=" Enter Student Number" required="" />
              </Form.Group>
              {state?.errors?.stdno && <p>{state.errors.stdno}</p>}
              <Form.Group className="mb-3" controlId="phoneno">
                <Form.Label className={styles.label}>Phone Number:</Form.Label>
                <Form.Control type="text" name="phoneno" placeholder="" required="" />
              </Form.Group>
              {state?.errors?.phoneno && <p>{state.errors.phoneno}</p>}
              <Form.Group className="mb-3" controlId="dept">
              <Form.Label className={styles.label}>Department:</Form.Label>
              <Form.Select name="dept" required="" style={{ maxHeight: "200px", overflowY: "auto" }}>
                <option value="">Select a department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </Form.Group>
              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className={styles.label}>Email address:</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter your school email address here" required="" />
              </Form.Group>
              {state?.errors?.email && <p>{state.errors.email}</p>}

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className={styles.label}>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required="" />
              </Form.Group>
              {state?.errors?.password && (
                  <div>
                    <p>Password must:</p>
                    <ul>
                      {state.errors.password.map((error) => (
                        <li key={error}>- {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="confirmpassword">
                <Form.Label className={styles.label}>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirm-password" placeholder="**************" required="" />
              </Form.Group>
                
              {/* Checkbox */}
              <div className="mb-3">
                <Form.Check type="checkbox" id="check-api-checkbox">
                  <Form.Check.Input type="checkbox" required=""/>
                  <Form.Check.Label>
                    I agree to the <Link href="https://activity.emu.edu.tr/en/Documents/Ogr.%20Klup%20Kur.Clsm%20Ilke%20-%20ENG.docx" className={styles.link}> Student Club Rules and Regulations </Link>
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
export default SignUp;