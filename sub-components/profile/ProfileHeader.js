'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Col, Row, Image } from 'react-bootstrap';

export const ProfileHeader = ({ onEditProfileClick }) => {
  const [profilePicture, setProfilePicture] = useState('/images/avatar/avatar.jpg');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/setting');
        const data = await res.json();

        if (res.ok) {
          if (data.profile_picture) setProfilePicture(data.profile_picture);
          if (data.name) setName(data.name);
          if (data.surname) setSurname(data.surname);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        <div
          className="pt-20 rounded-top"
          style={{
            background: 'url(/images/background/background.jpeg) no-repeat',
            backgroundSize: 'cover',
          }}
        ></div>
        <div className="bg-white rounded-bottom smooth-shadow-sm">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image
                  src={profilePicture}
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt="Profile"
                />
                <Link
                  href="#!"
                  className="position-absolute top-0 right-0 me-2"
                  data-bs-toggle="tooltip"
                  data-placement="top"
                  title="Verified"
                >
                  <Image src="/images/svg/checked-mark.svg" alt="" height="30" width="30" />
                </Link>
              </div>
              <div className="lh-1">
                <h2 className="mb-0">{name} {surname}</h2>
              </div>
            </div>
            <div>
              <button className="btn btn-outline-primary d-none d-md-block" onClick={onEditProfileClick}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
