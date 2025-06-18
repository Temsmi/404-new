'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { Image, Dropdown, ListGroup} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { useEffect, useState } from 'react';
import Notification from 'data/Notification';
import { useRouter } from 'next/navigation';


import { useNotificationStore } from 'widgets/store';

const QuickMenu_p = () => {
  const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {unreadCount, setUnreadCount, resetUnread} = useNotificationStore();
  const [user, setUser] = useState(null);
  const [profileLink, setProfileLink] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/username');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);

          if (data.user.role === 'member') {
            setProfileLink('/member-dashboard/pages/settings');
          } else if (data.user.role === 'president') {
            setProfileLink('/dashboard-president/pages/settings');
          } else {
            setProfileLink('/nonMember/settings'); 
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

useEffect(() => {
  if (!user || !user.id) return;

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notification/mark-read');
      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  fetchUnreadCount();

  const interval = setInterval(fetchUnreadCount, 30000);
  return () => clearInterval(interval);
}, [user, setUnreadCount]);


          const router = useRouter(); 

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push('/authentication/sign-in');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMounted) {
    return null; 
  }

   const handleToggle = async (isOpen) => {
      if (isOpen) {
        try {
          await fetch('/api/notification/mark-read', { method: 'POST' });
          resetUnread(); 
        } catch (err) {
          console.error('Failed to mark notifications as read', err);
        }
      }
    };

  const Notifications = () => (
    <SimpleBar style={{ maxHeight: '300px' }}>
      <Notification />
    </SimpleBar>
  );

  const QuickMenuDesktop = () => {
    const imageUrl =
      user && user.profile_picture
        ? user.profile_picture
        : '/images/avatar/avatar.jpg';

    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
      &nbsp;

              <Dropdown as="li" className="stopevent me-2" onToggle={handleToggle}>
                  <Dropdown.Toggle
                    as="a"
                    bsPrefix=" "
                    id="dropdownNotification"
                    className="btn btn-light btn-icon rounded-circle position-relative text-muted"
                  >
                    <i className="fe fe-bell"></i>
                    {unreadCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                        style={{
                          backgroundColor: 'gold',
                          color: 'black',
                          fontSize: '0.6rem',
                          minWidth: '16px',
                          padding: '2px 5px',
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Dropdown.Toggle>
        
                <Dropdown.Menu
                  className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                  aria-labelledby="dropdownNotification"
                  align="end"
                  renderOnMount={true}
                >
                  <Dropdown.Item className="mt-3" bsPrefix=" " as="div"> 
                    <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                      <span className="h4 mb-0">Notifications</span>
                      <Link href="/" className="text-muted">
                      
                      </Link>
                    </div>
                    <Notifications />
                    <div className="border-top px-3 pt-3 pb-3">
                    
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle as="a" bsPrefix=" " className="rounded-circle" id="dropdownUser">
            <div className="avatar avatar-md avatar-indicators avatar-online">
              <Image
                alt="avatar"
                src={imageUrl}
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end"
            align="end"
            aria-labelledby="dropdownUser"
            show
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1">
                <h5 className="mb-1">
                  {user && user.name && user.surname
                    ? `${user.name} ${user.surname}`
                    : 'Loading user...'}
                </h5>
              </div>
              <div className="dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>

            <Dropdown.Item eventKey="2" href={profileLink}>
              <i className="fe fe-user me-2"></i> View Profile
            </Dropdown.Item>

            <Dropdown.Item onClick={handleSignOut}>
              <i className="fe fe-power me-2"></i> Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  return (
    <Fragment>
      <QuickMenuDesktop />
    </Fragment>
  );
};

export default QuickMenu_p;
