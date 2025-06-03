import { v4 as uuid } from 'uuid';
export const DashboardMenu = [
    {
        id: uuid(),
        title: 'Dashboard',
        icon: 'home',
        link: '/nonMember'
    },
    {
        id: uuid(),
        title: 'MY CLUBS',
        grouptitle: true
    },
    {
        id: uuid(),
        title: 'Memberships',
        icon: 'lock',
        link: '/dashboard/elections'
    },		
    {
        id: uuid(),
        title: 'OTHERS',
        grouptitle: true
    },	
    {
        id: uuid(),
        title: 'Club Request',
        icon: 'info',
		link: '/nonMember/club-creation'
    },
    {
        id: uuid(),
        title: 'Help Page',
        icon: 'info',
        link: '/dashboard/pages/help'
    },	
];

export default DashboardMenu;