'use client';

import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import { Container, Col, Row, Card } from 'react-bootstrap';

import { StatRightTopIcon } from "widgets";
import DashCards_president from "data/dashboard/DashCards_president";
import PieChartPresident from 'components/PieChartPresident';
import MembersInfo from "sub-components/dashboard/MembersInfo";
import RecentAnnouncementsTable from 'components/RecentAnnouncementsTable';

const Home = () => {
  const [clubName, setClubName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [requestsByTypeAnon, setRequestsByTypeAnon] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchClubName = async () => {
      try {
        const res = await fetch('/api/layoutpresident');
        const data = await res.json();
        if (res.ok) {
          setClubName(data.clubName);
          setIsActive(data.is_active);
        } else {
          console.error("Error fetching club name:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchClubName();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/metrics-president');
        const data = await res.json();
        if (res.ok) {
          setTotalMembers(data.totalMembers);
          setRequestsByTypeAnon(data.requestsByTypeAnon);
          setRecentAnnouncements(data.recentAnnouncements);
          setMembers(data.members);
        } else {
          console.error("Error fetching metrics:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Fragment>
      {!isActive ? (
        <div className="p-4 bg-danger text-white rounded">
          Your club is deactivated.
        </div>
      ) : (
        <>
          <div className="bg-primary pt-10 pb-21"></div>
          <Container fluid className="mt-n22 px-6">
            <Row>
              <Col lg={12} md={12} xs={12}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mb-2 mb-lg-0">
                    <h3 className="mb-0 text-white">
                      Welcome, President of {clubName || '...'}
                    </h3>
                  </div>
                  <div>
                    <Link href="/dashboard-president/pages/chats" className="btn btn-white">
                      Joining Club Chats
                    </Link>
                  </div>
                </div>
              </Col>

              {DashCards_president.map((item, index) => {
                if (item.title === "Total Members") {
                  item.value = totalMembers;
                  item.title = "Total Members";
                }

                return (
                  <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                    <StatRightTopIcon info={item} />
                  </Col>
                );
              })}
            </Row>

            <Row className="my-6">
              <Col xl={6} lg={6} md={12} xs={12} className="mb-6 mb-xl-0">
                <Card>
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Requests by Type</h5>
                  </Card.Header>
                  <Card.Body style={{ height: '300px' }}>
                    <PieChartPresident data={requestsByTypeAnon} chartType="byType" />
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={6} lg={6} md={12} xs={12} className="mb-6 mb-xl-0">
                <Card>
                  <Card.Header className="bg-white py-4">
                    <h5 className="mb-0">Anonymous vs Non-anonymous</h5>
                  </Card.Header>
                  <Card.Body style={{ height: '300px' }}>
                    <PieChartPresident data={requestsByTypeAnon} chartType="byAnon" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            

            <MembersInfo members={members} />
          </Container>
        </>
      )}
    </Fragment>
  );
};

export default Home;
