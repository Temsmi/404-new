import { v4 as uuid } from 'uuid';


export const DashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/dashboard'
	},
	{
		id: uuid(),
		title: 'CLUB MANAGEMENT',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Clubs',
		icon: 'layers',
		children: [
			{ id: uuid(), link: '/dashboard/pages/manageclubs', name: 'Manage Clubs' },
			{ id: uuid(), link: '/dashboard/pages/requests', name: 'Activity requests'},
			{ id: uuid(), link: '/dashboard/pages/clubrequests', name: 'Club Requests' },
		]
	},	
	
	{
		id: uuid(),
		title: 'Elections',
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
		title: 'Calendar',
		icon: 'calendar',
		link: '/dashboard/pages/calendar'
	},	
	{
		id: uuid(),
		title: 'Help Page',
		icon: 'info',
		link: '/dashboard/pages/help'
	},	
];

export default DashboardMenu;