// import node module libraries
import { Col, Row, Card } from 'react-bootstrap';

const AboutMe = () => {
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* card */}
            <Card>
                {/* card body */}
                <Card.Body>
                    {/* card title */}
                    <Card.Title as="h4">About Me</Card.Title>
                    <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
                    <p className="mt-2 mb-6"> I was born to become a club president!
                    </p>
                    <Row>
                        <Col xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Department</h6>
                            <p className="mb-0">Sinema</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Phone </h6>
                            <p className="mb-0">+53344761325</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Date of Birth </h6>
                            <p className="mb-0">07.08.2003</p>
                        </Col>
                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">Email </h6>
                            <p className="mb-0">President@gmail.com</p>
                        </Col>
                        <Col xs={6}>
                            {/* <h6 className="text-uppercase fs-5 ls-2">Location</h6>
                            <p className="mb-0">Ahmedabad, India</p> */}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutMe