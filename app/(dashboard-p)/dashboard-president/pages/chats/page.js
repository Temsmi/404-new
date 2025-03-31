'use client';

import { useState } from 'react';
import { Container, ListGroup, Card, CloseButton, Button, Image } from 'react-bootstrap';

const students = [
  { id: 1, name: 'Alice Johnson', department: 'IT', email: 'alice@example.com', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Bob Williams', department: 'Marketing', email: 'bob@example.com', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Charlie Brown', department: 'Finance', email: 'charlie@example.com', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'David Smith', department: 'HR', email: 'david@example.com', image: 'https://via.placeholder.com/50' },
  { id: 5, name: 'Emma Davis', department: 'Design', email: 'emma@example.com', image: 'https://via.placeholder.com/50' },
];

// Student List Component (Like WhatsApp Contact List)
const StudentList = ({ students, onSelect }) => (
  <ListGroup className="mt-3">
    {students.map((student) => (
      <ListGroup.Item key={student.id} action onClick={() => onSelect(student)} className="d-flex align-items-center">
        <Image src={student.image} roundedCircle width={40} height={40} className="me-3" />
        <div>
          <strong>{student.name}</strong>
          <div className="text-muted" style={{ fontSize: '0.9rem' }}>{student.department}</div>
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

// Student Profile Component
const StudentProfile = ({ student, onClose }) => (
  <Card className="mt-4 p-3 shadow">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <Card.Title>{student.name}</Card.Title>
        <CloseButton onClick={onClose} />
      </div>
      <Image src={student.image} roundedCircle width={80} height={80} className="d-block mx-auto mb-3" />
      <Card.Subtitle className="mb-2 text-muted text-center">{student.department}</Card.Subtitle>
      <Card.Text className="text-center">Email: <a href={`mailto:${student.email}`}>{student.email}</a></Card.Text>
      <div className="d-flex justify-content-center">
        <Button variant="success" size="sm">Start Private Chat</Button>
      </div>
    </Card.Body>
  </Card>
);

// Main Component
export default function StudentDirectory() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <Container className="mt-5">
     
      
      <StudentList students={students} onSelect={setSelectedStudent} />

      {selectedStudent && <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </Container>
  );
}
