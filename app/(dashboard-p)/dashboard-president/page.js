'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

// import widget/custom components
import { StatRightTopIcon } from "widgets";


// import required data files
import DashCards_president from "data/dashboard/DashCards_president";
import MembersInfo from "sub-components/dashboard/MembersInfo";

const Home = () => {
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Welcome, the President of the [club name] Club!</h3>
                                </div>
                                <div>
                                    <Link href="/dashboard-president/pages/chat-group" className="btn btn-white">Create Group Chat</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {DashCards_president.map((item, index) => {
                        return (
                            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                                <StatRightTopIcon info={item} />
                            </Col>
                        )
                    })}
                </Row>

                <MembersInfo />
                
                <Row className="my-6">
                    <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                    </Col>
                  </Row>
            </Container>
        </Fragment>
    )
}
export default Home;
