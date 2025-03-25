// 'use client'
// // import node module libraries
// import Link from 'next/link';
// import { Col, Row, Container, Image } from 'react-bootstrap';

// const Layout = () => {
//   return (
//     <Container fluid className="px-6 py-4">
//       <Row>
//         <Col xl={12} lg={12} md={12} sm={12}>
//           <div className="text-center mb-7">
//             <h1 className="display-4">Layouts</h1>
//             <p>Customize your overview page layout. Choose the one that best fits your needs.</p>
//           </div>
//           <span className="divider fw-bold my-3">Demo layouts</span>
//         </Col>
//       </Row>
//       <Row className="justify-content-center">
//         <Col lg={3} sm={6} className="my-4 ">
//           <Link className="card" href="/">
//             <Image className="card-img-top" src="/images/layouts/default-classic.svg" alt="Image Description" />
//             <div className="card-body text-center">
//               <h5 className="mb-0">Classic</h5>
//             </div>
//           </Link>
//         </Col>
//       </Row>
//     </Container>
//   )
// }

// export default Layout
"use client";

import { useState } from "react";

// Custom Card Component
function Card({ children }) {
  return <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#624bff]">{children}</div>;
}

// Custom Button Component (Dark Blue)
function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      className={`mt-4 w-full py-2 text-lg rounded-xl transition font-semibold text-black shadow-md ${
        disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-900"
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

const clubs = [
  {
    id: 1,
    name: "Tech Club",
    candidates: [
      { name: "Alice", votes: 65},
      { name: "Bob", votes: 55 },
    ],
    published: false,
  },
  {
    id: 2,
    name: "Art Club",
    candidates: [
      { name: "Emma", votes: 50},
      { name: "David", votes: 45 },
    ],
    published: false,
  },
  {
    id: 3,
    name: "Sports Club",
    candidates: [
      { name: "John", votes: 75 },
      { name: "Mike", votes: 65 },
    ],
    published: false,
  },
];

export default function ElectionAdmin() {
  const [clubResults, setClubResults] = useState(clubs);

  const handlePublish = (id) => {
    setClubResults(
      clubResults.map((club) =>
        club.id === id ? { ...club, published: true } : club
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6fc] p-8">
      <h1 className="text-4xl font-bold text-center text-[#ffff] mb-8">
        Election Results
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubResults.map((club) => (
          <Card key={club.id}>
            <h2 className="text-2xl font-semibold text-[#624bff] mb-4">{club.name}</h2>
            <ul>
              
            </ul>
            <Button onClick={() => handlePublish(club.id)} disabled={club.published}>
              {club.published ? "Published" : "Publish"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}