'use client'

import { useState, useRef, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { PageHeading } from 'widgets/PageHeading';
import {
  AboutMe,
  ProfileHeader,
} from 'sub-components/profile';
import { EmailSetting, Preferences } from 'sub-components/settings';

const CombinedProfileSettings = () => {

  const [showSettings, setShowSettings] = useState(false);
  

  const settingsRef = useRef(null);


  const handleEditProfileClick = () => {
    setShowSettings(true);
  }


  useEffect(() => {
    if (showSettings) {
      settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showSettings]); 
  return (
    <Container fluid className="p-6">      <div>
        <PageHeading heading="Overview" />


        <ProfileHeader onEditProfileClick={handleEditProfileClick} />

        <div className="py-6">
          <Row>

            <AboutMe />

            
            

            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
             
            </Col>
          </Row>
        </div>
      </div>


      {showSettings && (
        <div className="py-6" ref={settingsRef}>
          <PageHeading heading="General" />

          
          <EmailSetting />

          
           <Preferences /> 

       

          
        </div>
      )}
    </Container>
  )
}

export default CombinedProfileSettings;
