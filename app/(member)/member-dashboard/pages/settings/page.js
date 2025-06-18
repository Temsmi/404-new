'use client'

import { useState, useRef, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import AboutMem from 'sub-components/profile/AboutMem';
import  EmailSettingmem from 'sub-components/settings/EmailSettingmem';
import  Preferencesmem from 'sub-components/settings/Preferencesmem';
import ProfileHeadermem from 'sub-components/profile/ProfileHeadermem';
import { PageHeading } from 'widgets/PageHeading';

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
    <Container fluid className="p-6">
     
      <div>
        <PageHeading heading="Overview" />


        <ProfileHeadermem onEditProfileClick={handleEditProfileClick} />

        <div className="py-6">
          <Row>

            <AboutMem/>

           

            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
              
            </Col>
          </Row>
        </div>
      </div>


      {showSettings && (
        <div className="py-6" ref={settingsRef}>
          <PageHeading heading="General" />


          <EmailSettingmem />


          <Preferencesmem /> 


          
        </div>
      )}
    </Container>
  )
}

export default CombinedProfileSettings;
