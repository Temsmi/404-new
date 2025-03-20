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
    // Navigate to a chat page (Replace '/chat' with the actual route)
    router.push(`/chat?memberId=${member.id}&name=${member.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Member List
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-4 text-left w-1/2">Name</th>
                <th className="border p-4 text-left w-1/2">Department</th>
                <th className="border p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border">
                  <td className="border p-4">{member.name}</td>
                  <td className="border p-4">{member.department}</td>
                  <td className="border p-4 text-center">
                  <button style={{ backgroundColor: 'blue' }} className="text-white px-4 py-2 rounded-md">
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