'use client';

import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

import { StatRightTopIcon } from "widgets";
import DashCards_president from "data/dashboard/DashCards_president";
import PieChartPresident from 'components/PieChartPresident';
import MembersInfo from "sub-components/dashboard/MembersInfo";
import RecentAnnouncementsTable from 'components/RecentAnnouncementsTable';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [clubName, setClubName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [requestsByTypeAnon, setRequestsByTypeAnon] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const { t } = useTranslation();

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
          {t('deactivated')}
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
                      {t('welcomePresident', { clubName: clubName || '...' })}
                    </h3>
                  </div>
                  <div>
                    <Link href="/dashboard-president/pages/chat-group" className="btn btn-white">
                      {t('createGroupChat')}
                    </Link>
                  </div>
                </div>
              </Col>

              {DashCards_president.map((item, index) => {
                if (item.title === "Total Members") {
                  item.value = totalMembers;
                  item.title = t('totalMembers');
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
                <h5 className="mb-3">{t('requestsByType')}</h5>
                <PieChartPresident data={requestsByTypeAnon} chartType="byType" />
              </Col>

              <Col xl={6} lg={6} md={12} xs={12} className="mb-6 mb-xl-0">
                <h5 className="mb-3">{t('anonymousVsNon')}</h5>
                <PieChartPresident data={requestsByTypeAnon} chartType="byAnon" />
              </Col>
            </Row>

            <Row className="my-6">
              <Col xl={12} lg={12} md={12} xs={12}>
                <h4 className="mb-3">{t('recentAnnouncements')}</h4>
                <RecentAnnouncementsTable data={recentAnnouncements} />
              </Col>
            </Row>

            <MembersInfo members={members} />

            <Row className="my-6">
              <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0"></Col>
            </Row>
          </Container>
        </>
      )}
    </Fragment>
  );
};

export default Home;
