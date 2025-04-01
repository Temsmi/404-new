import Link from 'next/link';
import { Col, Row, Card, Table} from 'react-bootstrap';
import { EyeFill } from 'react-bootstrap-icons';

export default function ClubsTable({ clubs }) {
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
                            {clubs.map((club, index) => (
                                <tr key={index}>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center">
                                        <div md={4} className="text-center">
                                        <img src={`/images/ClubsLogo/${club.logo}`}
                                                    alt="Club Logo"
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: '50px' }}
                                                    onError={(e) => e.target.src = "/images/default-logo.png"}  // Handle broken image
                                                />
                                                </div>
                                            <div className="ms-3 lh-1">
                                                <h5 className="mb-1">
                                                    <Link href="#" className="text-inherit">{club.name}</Link>
                                                </h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">{club.president_name || 'N/A'}</td>
                                    <td className="align-middle">{club.member_count}</td>
                                    <td className="text-center">
                                        <Link href="#" className="link-primary d-flex align-items-center">
                                            <EyeFill className="me-1" /> View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        <Link href="/pages/profile" className="link-primary">View All Clubs</Link>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
}
