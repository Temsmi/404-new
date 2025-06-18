import { v4 as uuid } from 'uuid';

export const DashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/member-dashboard'
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
			{ id: uuid(), link: '/member-dashboard/pages/memberships', name: ' My Memberships' },
			{ id: uuid(), link: '/member-dashboard/pages/clubs', name: ' Clubs'},
		]
	},
	{
		id: uuid(),
		title: 'Chats',
		icon: 'layers',
		link: '/member-dashboard/pages/chats'
	},	
	{
		id: uuid(),
		title: (
			<span>
			<img src="/fonts/feather-icons/icons/election.svg" className="w-5 h-5" />
			&nbsp;Elections
			</span>
		),
		link: '/member-dashboard/pages/VotePage'
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
		link: '/member-dashboard/pages/calendar'
	},	
    {
		id: uuid(),
		title: 'Club Request',
		icon: 'arrow-down',
		link: '/member-dashboard/pages/clubcreationre'
	},
	{
		id: uuid(),
		title: 'Help Page',
		icon: 'info',
		link: '/member-dashboard/pages/help_page'
	},	
];

export default DashboardMenu;