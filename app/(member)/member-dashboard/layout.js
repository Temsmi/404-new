'use client'
// import node module libraries
import { useState } from 'react';

// import theme style scss file
import 'styles/theme.scss';

// import sub components
import NavbarVertical from '/layouts/navbars/NavbarVertical-m';
import NavbarTop from '/layouts/navbars/NavbarTop-m';

export default function DashboardLayout({ children }) {
    const [showMenu, setShowMenu] = useState(true);
    const ToggleMenu = () => {
        return setShowMenu(!showMenu);
    };

    return (
        <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
            <div className="navbar-vertical navbar">
                <NavbarVertical
                    showMenu={showMenu}
                    onClick={(value) => setShowMenu(value)}
                />
            </div>
            <div id="page-content">
                <div className="header">
                    <NavbarTop
                        data={{
                            showMenu: showMenu,
                            SidebarToggleMenu: ToggleMenu
                        }}
                    />
                </div>
                {children}
            </div>
        </div>
    )
}