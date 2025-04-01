'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';
// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import required data files
import DashCards from "data/dashboard/DashCards";
import ClubsTable from 'sub-components/dashboard/ClubsTable';
import { useEffect, useState } from 'react';

const Home = () => {
    const [clubs, setClubs] = useState([]);
    
    useEffect(() => {
        fetch("api/club") //For fetching from database
            .then((res) => res.json())
            .then((data) => setClubs(data))
            .catch((error) => console.error("Fetch error:", error));
    }, []);

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
                                    <h3 className="mb-0  text-white">Welcome, Admin!</h3>
                                </div>
                                <div>
                                    <Link href="/pages/clubcreation" className="btn btn-white">Create New Club</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {DashCards.map((item, index) => {
                        return (
                            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                                <StatRightTopIcon info={item} />
                            </Col>
                        )
                    })}
                </Row>

                {/* Clubs Table */}
                <ClubsTable clubs={clubs} />
            </Container>
        </Fragment>
    );
}
export default Home;
