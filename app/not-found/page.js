import { getSession } from 'app/lib/session';
import { Col, Row, Image, Container } from 'react-bootstrap';
import Link from 'next/link';

export default async function UnauthorizedPage() {
  const session = await getSession();
  const role = session?.role;

  const roleDashboardMap = {
    admin: '/dashboard',
    president: '/dashboard-president',
    member: '/member-dashboard',
    'non-member': '/nonMember',
  };

  const dashboardLink = roleDashboardMap[role] || '/authentication/sign-in';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Container>
          <Row >
            <Col sm={12}>
              <div className="text-center">
                <div className="mb-3">
                  <Image src="/images/error/404-error-img.png" alt="" className="img-fluid" />
                </div>
                <h1 className="display-4 fw-bold">Oops! Access Denied.</h1><br></br>
                <p className="mb-4"> You do not have permission to access this page, please go back.</p>
                <Link href={dashboardLink} className="btn btn-danger">
                  Go Home
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
    </div>
  );
}