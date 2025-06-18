import { v4 as uuid } from 'uuid';
export const DashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/dashboard-president'
	},
	{
		id: uuid(),
		title: 'CLUB MANAGEMENT',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Club profile',
		icon: 'hand',
		link: '/dashboard-president/pages/club-profile'
	},	
	{
		id: uuid(),
		title: 'Events',
		icon: 'layers',
		children: [
			{ id: uuid(), link: '/dashboard-president/pages/events', name: 'Event Logs' },
			{ id: uuid(), link: '/dashboard-president/pages/event-creation', name: 'Create Event'},
			{ id: uuid(), link: '/dashboard-president/pages/announcement', name: 'Create Announcement'}
			
		]
	},	

	{
		id: uuid(),
		title: 'COMMUNICATION',
		grouptitle: true
	},	
	{
		id: uuid(),
		title: 'Chats',
		icon: 'layers',
		link: '/dashboard-president/pages/chats'
	},
	{
		id: uuid(),
		title: 'Suggestions & Complaints',
		icon: 'send',
		link: '/dashboard-president/pages/suggestion'
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
		link: '/dashboard-president/pages/calendar'
	},	
	{
		id: uuid(),
		title: 'Help Page',
		icon: 'info',
		link: '/dashboard-president/pages/help'
	},	
];

export default DashboardMenu;