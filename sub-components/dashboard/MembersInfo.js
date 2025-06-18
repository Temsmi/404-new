'use client';

import React, { useState } from 'react';
import { Col, Row, Card, Table, Form, Button } from 'react-bootstrap';

const MembersInfo = ({ members }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);

    const filteredMembers = members.filter(member =>
        member.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(member.student_number).toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedMembers = showAll ? filteredMembers : filteredMembers.slice(0, 6);

    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">All Members</h4>
                        <Form.Control
                            type="text"
                            placeholder="Search members..."
                            style={{ width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Card.Header>
                    <Table responsive className="text-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Student Name</th>
                                <th>Student Number</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedMembers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">No members found.</td>
                                </tr>
                            ) : (
                                displayedMembers.map((member) => (
                                    <tr key={member.student_id}>
                                        <td className="align-middle">{member.student_name}</td>
                                        <td className="align-middle">{member.student_number}</td>
                                        <td className="align-middle">{member.department}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        {filteredMembers.length > 6 && (
                            <Button variant="link" onClick={() => setShowAll(!showAll)}>
                                {showAll ? 'Show Less' : 'View All Members'}
                            </Button>
                        )}
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
};

export default MembersInfo;
