'use client'

import { useState, useRef, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'

// import sub components for Profile
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  RecentFromBlog
} from 'sub-components'

// import sub components for Settings
import { Notifications, DeleteAccount, GeneralSetting, EmailSetting, Preferences } from 'sub-components'

const CombinedProfileSettings = () => {
  // State to manage the visibility of settings
  const [showSettings, setShowSettings] = useState(false);
  
  // Create a reference for the General section to scroll to
  const settingsRef = useRef(null);

  // Scroll to the General settings section when the "Edit Profile" button is clicked
  const handleEditProfileClick = () => {
    setShowSettings(true);
  }

  // Effect to handle scrolling after settings become visible
  useEffect(() => {
    if (showSettings) {
      settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSettings]); // This effect runs whenever showSettings changes

  return (
    <Container fluid className="p-6">
      {/* Profile Section */}
      <div>
        <PageHeading heading="Overview" />

        {/* Profile Header */}
        <ProfileHeader onEditProfileClick={handleEditProfileClick} />

        <div className="py-6">
          <Row>
            {/* About Me */}
            <AboutMe />

            {/* Projects Contributions */}
            {/* <ProjectsContributions /> */}

            {/* Recent From Blog */}
            {/* <RecentFromBlog /> */}

            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
              {/* My Team */}
              {/* <MyTeam /> */}

              {/* Activity Feed */}
              {/* <ActivityFeed /> */}
            </Col>
          </Row>
        </div>
      </div>

      {/* Settings Section (conditionally rendered based on showSettings state) */}
      {showSettings && (
        <div className="py-6" ref={settingsRef}>
          <PageHeading heading="General" />

          {/* Email Settings */}
          <EmailSetting />

          {/* Settings for Preferences */}
          {/* <Preferences /> */}

          {/* Delete Your Account */}
          <DeleteAccount />

          {/* Uncomment for Notifications */}
          {/* <Notifications /> */}
        </div>
      )}
    </Container>
  )
}

export default CombinedProfileSettings;
