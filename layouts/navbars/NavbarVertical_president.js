'use client';

import { Fragment, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import {
  ListGroup,
  Card,
  Image,
  Badge
} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { DashboardMenu } from 'routes/DashboardRoutes_president';

const NavbarVertical = ({ showMenu = true }) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [clubs, setClubs] = useState([]);
const [hasActiveClub, setHasActiveClub] = useState(null);

  const restrictedWithoutClub = ['calendar', 'suggestion'];
const restrictedItemsWhenClubInactive = ['events', 'help page'];

 
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch('/api/active-club', { signal: controller.signal });
      const data = await res.json();

      if (data && Array.isArray(data.clubs) && data.clubs.length > 0) {
        setClubs(data.clubs);
        setHasActiveClub(data.clubs.some(c => c.is_active === 1));
      } else {
        setClubs([]);
        setHasActiveClub(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching active club:', err);
      }
    }
  })();

  return () => controller.abort();
}, []);





const isItemDisabled = (title = '') => {
  const lower = title.toLowerCase();
  if (hasActiveClub) return false;
  return (
    restrictedWithoutClub.some(k => lower.includes(k)) ||
    restrictedItemsWhenClubInactive.some(k => lower.includes(k))
  );
};

  const CustomToggle = ({ children, eventKey, icon }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey);
    const isCurrentEventKey = activeEventKey === eventKey;

    return (
      <li className="nav-item">
        <Link
          href="#"
          className="nav-link"
          onClick={decoratedOnClick}
          aria-expanded={isCurrentEventKey}
        >
          {icon && <i className={`nav-icon fe fe-${icon} me-2`} />}
          {showMenu && <span>{children}</span>}
        </Link>
      </li>
    );
  };

  const CustomToggleLevel2 = ({ children, eventKey }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey);
    const isCurrentEventKey = activeEventKey === eventKey;

    return (
      <Link
        href="#"
        className="nav-link"
        onClick={decoratedOnClick}
        aria-expanded={isCurrentEventKey}
      >
        {showMenu && <span>{children}</span>}
      </Link>
    );
  };

const generateLink = (item, parentTitle = '') => {
  const title = item.name || item.title || '';
  const disabled = isItemDisabled(parentTitle || title);
  const isActive = pathname === item.link || pathname?.startsWith(`${item.link}/`);

  return (
    <Link
      href={disabled ? '#' : item.link}
      className={`nav-link${isActive ? ' active' : ''}${disabled ? ' disabled text-muted' : ''}`}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {item.icon && typeof item.icon === 'string' && (
        <i className={`nav-icon fe fe-${item.icon} me-2`} />
      )}
      {showMenu && <span>{title}</span>}
    </Link>
  );
};

if (hasActiveClub === null) return null;

  return (
    <Fragment>
      <SimpleBar style={{ maxHeight: '100vh' }}>
       
        <div className="nav-scroller">
          <Link href="/" className="navbar-brand">
            <Image src="/images/brand/logo/logo.png" alt="logo" />
          </Link>
        </div>

        
        {showMenu && hasActiveClub && (
          <Card bsPrefix="nav-item">
            
            <ListGroup as="ul" className="nav flex-column mb-2">
              {clubs.map((club) => (
                <ListGroup.Item key={club.id} as="li" bsPrefix="nav-item">
                  
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        )}

        
        <Accordion defaultActiveKey="root" as="ul" className="navbar-nav flex-column">
          {DashboardMenu.map((menu, index) => {
            if (menu.grouptitle) {
              return (
                <Card bsPrefix="nav-item" key={index}>
                  {showMenu && <div className="navbar-heading">{menu.title}</div>}
                </Card>
              );
            }

            if (menu.children) {
              return (
                <Fragment key={index}>
                  <CustomToggle eventKey={String(index)} icon={menu.icon}>
                    {menu.title}
                    {menu.badge && (
                      <Badge className="ms-1" bg={menu.badgecolor || 'primary'}>
                        {menu.badge}
                      </Badge>
                    )}
                  </CustomToggle>

                  <Accordion.Collapse eventKey={String(index)} as="li" bsPrefix="nav-item">
                    <ListGroup as="ul" className="nav flex-column">
                      {menu.children.map((level1, i1) => (
                        <ListGroup.Item key={i1} as="li" bsPrefix="nav-item">
                          {level1.children ? (
                            <Accordion defaultActiveKey={`l1-${i1}`} className="navbar-nav flex-column">
                              <CustomToggleLevel2 eventKey={`l1-${i1}`}>
                                {level1.title}
                                {level1.badge && (
                                  <Badge className="ms-1" bg={level1.badgecolor || 'primary'}>
                                    {level1.badge}
                                  </Badge>
                                )}
                              </CustomToggleLevel2>
                              <Accordion.Collapse eventKey={`l1-${i1}`} bsPrefix="nav-item">
                                <ListGroup as="ul" className="nav flex-column">
                                  {level1.children.map((level2, i2) => (
                                    <ListGroup.Item key={i2} as="li" bsPrefix="nav-item">
                                      {level2.children ? (
                                        <Accordion defaultActiveKey={`l2-${i2}`} className="navbar-nav flex-column">
                                          <CustomToggleLevel2 eventKey={`l2-${i2}`}>
                                            {level2.title}
                                            {level2.badge && (
                                              <Badge className="ms-1" bg={level2.badgecolor || 'primary'}>
                                                {level2.badge}
                                              </Badge>
                                            )}
                                          </CustomToggleLevel2>
                                          <Accordion.Collapse eventKey={`l2-${i2}`} bsPrefix="nav-item">
                                            <ListGroup as="ul" className="nav flex-column">
                                              {level2.children.map((level3, i3) => (
                                                <ListGroup.Item key={i3} as="li" bsPrefix="nav-item">
                                                  {generateLink(level3, level2.title)}
                                                </ListGroup.Item>
                                              ))}
                                            </ListGroup>
                                          </Accordion.Collapse>
                                        </Accordion>
                                      ) : (
                                        generateLink(level2, level1.title)

                                      )}
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              </Accordion.Collapse>
                            </Accordion>
                          ) : (
                            generateLink(level1, menu.title)

                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Collapse>
                </Fragment>
              );
            }

            return (
              <Card bsPrefix="nav-item" key={index}>
                {generateLink(menu)}
              </Card>
            );
          })}
        </Accordion>
      </SimpleBar>
    </Fragment>
  );
};

export default NavbarVertical;
