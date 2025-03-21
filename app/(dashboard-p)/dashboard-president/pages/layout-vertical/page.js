'use client';

import { useRouter } from 'next/navigation';

const members = [
  { id: 1, name: 'Alice', department: 'IT' },
  { id: 2, name: 'Bob', department: 'Marketing' },
  { id: 3, name: 'Charlie', department: 'Finance' },
  { id: 4, name: 'David', department: 'HR' },
  { id: 5, name: 'Emma', department: 'Design' },
];

export default function MemberList() {
  const router = useRouter();

  const handleStartPrivateChat = (member) => {
    console.log(`Starting private chat with: ${member.name}`);
    router.push(`/chat?memberId=${member.id}&name=${member.name}`);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center text-primary mb-4">Member List</h1>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.department}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStartPrivateChat(member)}
                    >
                      Start Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




/*'use client'
// import node module libraries
import Link from 'next/link';
import { Col, Row, Container, Image } from 'react-bootstrap';

const Layout = () => {
  return (
    <Container fluid className="px-6 py-4">
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <div className="text-center mb-7">
            <h1 className="display-4">Layouts</h1>
            <p>Customize your overview page layout. Choose the one that best fits your needs.</p>
          </div>
          <span className="divider fw-bold my-3">Demo layouts</span>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={3} sm={6} className="my-4 ">
          <Link className="card" href="/">
            <Image className="card-img-top" src="/images/layouts/default-classic.svg" alt="Image Description" />
            <div className="card-body text-center">
              <h5 className="mb-0">Classic</h5>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  )
}

export default Layout*/