'use client'

import { Col, Row, Card, Table, Image, Container } from 'react-bootstrap';
import Link from 'next/link';
import { PageHeading } from 'widgets'
import ActiveProjectsData from "data/dashboard/ActiveProjectsData";

const Profile = () => {
  
  return (
    <Container className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Clubs"/>
     <Row className="mt-6">
                <Col md={12} xs={12}>
                    <Card className="bg-white">
                        <Table responsive className="text-nowrap mb-5">
                            <thead className="table-light">
                                <tr>
                                    <th>NAME</th>
                                    <th>PRESIDENT</th>
                                    <th>MEMBERS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ActiveProjectsData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="align-middle">
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <div className={`icon-shape icon-md border p-4 rounded-1 ${item.brandLogoBg}`}>
                                                            <Image src={item.brandLogo} alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="ms-3 lh-1">
                                                        <h5 className=" mb-1">
                                                            <Link href="#" className="text-inherit">{item.projectName}</Link></h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">{item.hours}</td>
                                            <td className="align-middle">
                                                <div className="avatar-group">
                                                    {item.members.map((avatar, avatarIndex) => {
                                                        return (
                                                            <span className="avatar avatar-sm" key={avatarIndex}>
                                                                <Image alt="avatar" src={avatar.image} className="rounded-circle" />
                                                            </span>
                                                        )
                                                    })}
                                                    <span className="avatar avatar-sm avatar-primary">
                                                        <span className="avatar-initials rounded-circle fs-6">+5</span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
     </Container>
  )
}

export default Profile