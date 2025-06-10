'use client';

import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';
import { People, GraphUp, ListCheck } from 'react-bootstrap-icons';
import Row2Charts from 'components/Row2Charts';
import ClubsTable from 'sub-components/dashboard/ClubsTable';
import { StatRightTopIcon } from "widgets";
import Row3Chart from "components/Row3Chart";
import Row4Charts from 'components/Row4Charts';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const [clubs, setClubs] = useState([]);
    const [dashCards, setDashCards] = useState([]);
const { t } = useTranslation();

    useEffect(() => {
        fetch("/api/metrics-admin")
            .then((res) => res.json())
            .then((data) => {
                const totalMembers = data.total_members || 0;
                const totalClubs = data.clubs?.length || 0; // count clubs from data

                setClubs(data.clubs || []);

                setDashCards([
                    {
                        id: 1,
                        title: "Total Clubs",
                        value: totalClubs,
                        icon: <ListCheck size={20} />,
                    },
                    {
                        id: 2,
                        title: "Total Members",
                        value: totalMembers,
                        icon: <People size={18} />,
                    },
                    {
                        id: 3,
                        title: "Site Engagement",
                        value: "7.6%",
                        icon: <GraphUp size={18} />,
                    }
                ]);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="mb-2 mb-lg-0">
                                <h3 className="mb-0 text-white">Welcome, Admin!</h3>
                            </div>
                            <div>
                                <Link href="/dashboard/pages/clubcreation" className="btn btn-white">Create New Club</Link>
                            </div>
                        </div>
                    </Col>

                    {dashCards.map((item) => (
                        <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={item.id}>
                            <StatRightTopIcon info={item} />
                        </Col>
                    ))}
                </Row>

                <Row2Charts />
                <Row3Chart />
                <Row4Charts />

                <ClubsTable clubs={clubs} />
            </Container>
        </Fragment>
    );
};

export default Home;
