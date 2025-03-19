'use client';

import { useState } from 'react';

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
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map((member) => member.id));
    }
    setSelectAll(!selectAll);
  };

  const handleStartChat = () => {
    if (!subject.trim() || selectedMembers.length === 0) {
      alert('Please enter a subject and select at least one member.');
      return;
    }
    console.log('Starting chat with:', selectedMembers, 'Subject:', subject);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Start a New Chat</h1>
        
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Enter chat subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-5 h-5"
          />
          <span className="text-lg font-medium">Select All</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Select</th>
                <th className="border p-4 text-left w-1/2">Name</th>
                <th className="border p-4 text-left w-1/2">Department</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border">
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="border p-4 w-1/2">{member.name}</td>
                  <td className="border p-4 w-1/2">{member.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleStartChat}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}




/*'use client'

// Import required modules
import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ClubCreationForm = () => {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);

  const handleImageUpload = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      clubName,
      description,
      logo
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Create a Club</h2>
          <Form onSubmit={handleSubmit}>
            {/* Club Logo Upload }
            <Form.Group controlId="clubLogo" className="mb-3">
              <Form.Label>Club Logo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>

            {/* Club Name}
            <Form.Group controlId="clubName" className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Club Description *}
            <Form.Group controlId="clubDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter club description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Submit Button *}
            <Button variant="primary" type="submit" className="w-100">
              Create Club
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ClubCreationForm;*/
