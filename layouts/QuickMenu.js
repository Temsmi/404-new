import Link from 'next/link';
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Image,
    Dropdown,
    ListGroup,
} from 'react-bootstrap';
import 'simplebar/dist/simplebar.min.css';

import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';


const QuickMenu = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const router = useRouter();
    useEffect(() => {
        setHasMounted(true);
      }, []);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/logout', {
            method: 'POST',
          });
    
          const data = await res.json();
          if (data.success) {
            router.push('/authentication/sign-in');
          } else {
            console.error('Failed to log out');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }finally {
            setIsLoading(false);
          }
      };
      if (!hasMounted) {
        return null;
      }
    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            
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
                            {/* <Link href="/" className="text-muted">
                                <span className="align-middle">
                                    <i className="fe fe-settings me-1"></i>
                                </span>
                            </Link>
                        </div>
                            </Link>*/}
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