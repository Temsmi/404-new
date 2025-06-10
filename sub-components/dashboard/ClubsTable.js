import Link from 'next/link';
import { Col, Row, Card, Table, Modal, Button } from 'react-bootstrap';
import { EyeFill } from 'react-bootstrap-icons';
import { useState } from 'react';

export default function ClubsTable({ clubs }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);

    const handleViewDetails = (club) => {
        setSelectedClub(club);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClub(null);
    };

    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white py-4">
                        <h4 className="mb-0">All Clubs</h4>
                    </Card.Header>
                    <Table responsive hover className="text-nowrap mb-0">
                        <thead className="table-light">
                            <tr className="border-b">
                                <th>NAME</th>
                                <th>PRESIDENT</th>
                                <th>MEMBERS</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(clubs) && clubs.slice(0, 5).map((club, index) => (
                                <tr key={index}>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center">
                                            <div className="text-center">
                                                <img src={`/images/ClubsLogo/${club.logo}`}
                                                    alt="Club Logo"
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: '50px' }}
                                                    onError={(e) => e.target.src = "/images/default-logo.png"}  
                                                />
                                            </div>
                                            <div className="ms-3 lh-1">
                                                <h5 className="mb-1">
                                                    <Link href="#" className="text-inherit">{club.name}</Link>
                                                </h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        {club.president_name && club.president_surname
                                            ? `${club.president_name} ${club.president_surname}`
                                            : 'N/A'}
                                    </td>
                                    <td className="align-middle">{club.member_count}</td>
                                    <td className="text-center">
                                        <Button variant="link" className="link-primary d-flex align-items-center p-0" onClick={() => handleViewDetails(club)}>
                                            <EyeFill className="me-1" /> View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        <Link href="/dashboard/pages/manageclubs" className="link-primary">See more</Link>
                    </Card.Footer>
                </Card>
            </Col>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Club Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClub && (
                        <>
                            <div className="text-center mb-3">
                                <img src={`/images/ClubsLogo/${selectedClub.logo}`}
                                    alt="Club Logo"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '100px' }}
                                    onError={(e) => e.target.src = "/images/default-logo.png"}  
                                />
                            </div>
                            <h5>Name:</h5>
                            <p>{selectedClub.name}</p>

                            <h5>Description:</h5>
                            <p>{selectedClub.description || 'No description available'}</p>

                            <h5>President:</h5>
                            <p>
                                {selectedClub.president_name && selectedClub.president_surname
                                    ? `${selectedClub.president_name} ${selectedClub.president_surname}`
                                    : 'N/A'}
                            </p>

                            <h5>Members:</h5>
                            <p>{selectedClub.member_count}</p>

                            <h5>Active:</h5>
                            <p>
                                <span className={`badge ${selectedClub.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                    {selectedClub.is_active ? 'Yes' : 'No'}
                                </span>
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}
