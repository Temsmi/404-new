 // import node module libraries
import Link from 'next/link';
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
} from 'react-bootstrap';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import NotificationList from 'data/Notification';

// import hooks
import { useRouter } from 'next/navigation'; 
//import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { ToggleButton,ToggleButtonGroup } from 'react-bootstrap';


const QuickMenu = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const router = useRouter(); // Initialize useRouter here
    useEffect(() => {
        setHasMounted(true);
      }, []);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
          // Make a POST request to the sign-out API
          const res = await fetch('/api/logout', {
            method: 'POST',
          });
    
          const data = await res.json();
          if (data.success) {
            console.log('Session deleted, redirecting...');
            router.push('/authentication/sign-in');
          } else {
            // Handle error if logout fails
            console.error('Failed to log out');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }finally {
            setIsLoading(false);
          }
      };
      if (!hasMounted) {
        return null; // Return nothing during SSR or before mount
      }

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {/* {NotificationList.map(function (item, index) {
                        return (
                            <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={index}>
                                <Row>
                                    <Col>
                                        <Link href="#" className="text-muted">
                                            <h5 className=" mb-1">{item.sender}</h5>
                                            <p className="mb-0"> {item.message}</p>
                                        </Link>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    })} */}
                </ListGroup>
            </SimpleBar>
        );
    }

    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
              {/* <Dropdown as="li" className="me-2" style={{ marginTop: '10px' }}>
        <Dropdown.Toggle
          id="language-dropdown"
          className="bg-transparent border-0 p-0 d-flex align-items-center text-dark"
          style={{ boxShadow: "none" }}
        >
          {language === "English" ? (
            <>
              <img
                src="/fonts/feather-icons/icons/en.svg"
                alt="eng icon"
                className="me-2"
                style={{ width: "20px", height: "20px" }}
             />
              <span className="fw-normal">English</span>
            </>
          ) : (
            <>
              <img
                src="/fonts/feather-icons/icons/tr.svg"
                alt="trk icon"
                className="me-2"
                style={{ width: "20px", height: "20px" }}
              />
              <span className="fw-normal">Turkish</span>
            </>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="English">
            <img
              src="/fonts/feather-icons/icons/en.svg"
              alt="eng icon"
              className="me-2"
              style={{ width: "20px", height: "20px" }}
            />
            English
          </Dropdown.Item>
          <Dropdown.Item eventKey="Turkish">
            <img
              src="/fonts/feather-icons/icons/tr.svg"
              alt="trk icon"
              className="me-2"
              style={{ width: "20px", height: "20px" }}
            />
            Turkish
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
            <Dropdown as="li" className="stopevent">
                <Dropdown.Toggle as="a"
                    bsPrefix=' '
                    id="dropdownNotification"
                    className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
                    <i className="fe fe-bell"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                    aria-labelledby="dropdownNotification"
                    align="end"
                    show
                    >
                    <Dropdown.Item className="mt-3" bsPrefix=' ' as="div"  >
                        <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                            <span className="h4 mb-0">Notifications</span>
                            <Link href="/" className="text-muted">
                                <span className="align-middle">
                                    <i className="fe fe-settings me-1"></i>
                                </span>
                            </Link>
                        </div>
                        <Notifications />
                        <div className="border-top px-3 pt-3 pb-3">
                            <Link href="/dashboard/notification-history" className="text-link fw-semi-bold">
                                See all Notifications
                            </Link>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <Image alt="avatar" src='/images/avatar/profile.png' className="rounded-circle" />
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-end "
                    align="end"
                    aria-labelledby="dropdownUser"
                    show
                    >
                    <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1"> Admin</h5>
                                <Link href="/dashboard/pages/profile-settings" className="text-inherit fs-6">View profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                    </Dropdown.Item>
                    {/* <Dropdown.Item eventKey="2">
                        <i className="fe fe-user me-2"></i> Edit Profile
                    </Dropdown.Item> */}
                   
                    {/* <Dropdown.Item className="text-primary">
                        <i className="fe fe-star me-2"></i> Go Pro
                    </Dropdown.Item> */}
                    {/* <Dropdown.Item >
                        <i className="fe fe-settings me-2"></i> Account Settings
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={handleSignOut}>
                        <i className="fe fe-power me-2"></i>Sign Out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup>
    )}
    return (
        <Fragment>
             <QuickMenuDesktop />
        </Fragment>
    )
}

export default QuickMenu;