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
		icon: 'list',
		children: [

			{ id: uuid(), link: '/nonMember/pages/clubs', name: ' Clubs'},
		]
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