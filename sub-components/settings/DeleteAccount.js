// import node module libraries
import Link from 'next/link';
import { Col, Row, Card } from 'react-bootstrap';

const DeleteAccount = () => {
  return (
    <Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Delete Account</h4>
         
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card className="mb-6">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Danger Zone </h4>
            </div>
            <div>
              <p>Deleting your account, all your data will be removed.</p>
              <Link href="#" className="btn btn-danger">Delete Account</Link>
             
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default DeleteAccount