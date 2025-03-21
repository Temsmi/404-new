'use client';

import { useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import styles from '../../styles/chatSelection.module.css';


const members = [
  { id: 1, name: 'Alice', department: 'IT' },
  { id: 2, name: 'Bob', department: 'Marketing' },
  { id: 3, name: 'Charlie', department: 'Finance' },
  { id: 4, name: 'David', department: 'HR' },
  { id: 5, name: 'Emma', department: 'Design' },
];

export default function ChatSelection() {
  const [subject, setSubject] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll((prev) => {
      const newState = !prev;
      setSelectedMembers(newState ? members.map((member) => member.id) : []);
      return newState;
    });
  };

  const handleStartChat = () => {
    if (!subject.trim() || selectedMembers.length === 0) {
      alert('Please enter a subject and select at least one member.');
      return;
    }
    console.log('Starting chat with:', selectedMembers, 'Subject:', subject);
  };

  return (
    <div className={styles.pageContainer}>
      <Container className={styles.chatContainer}>
        <h2 className={styles.title}>Start a New Chat</h2>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter chat subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Select All"
          checked={selectAll}
          onChange={handleSelectAll}
          className="mb-3"
        />

        <Table bordered hover>
          <thead>
            <tr className="table-secondary">
              <th>Select</th>
              <th>Name</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                  />
                </td>
                <td>{member.name}</td>
                <td>{member.department}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleStartChat}
          disabled={!subject.trim() || selectedMembers.length === 0}
        >
          Start Chat
        </Button>
      </Container>
    </div>
  );
}
