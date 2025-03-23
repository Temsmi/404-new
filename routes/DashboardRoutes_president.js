import { v4 as uuid } from 'uuid';
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

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
		title: 'Club',
		icon: 'layers',
		children: [
			{ id: uuid(), link: '/dashboard-president/pages/clubcreation', name: 'Event Creation' },
			{ id: uuid(), link: '/dashboard-president/pages/event-edition', name: 'Event Addition'}
			
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
		icon: 'chat',
		link: '/dashboard-president/pages/chat-group'
	},	
	{
		id: uuid(),
		title: 'Suggestions & Complaints',
		icon: 'lock',
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
	/*{
		id: uuid(),
		title: 'Documentation',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Docs',
		icon: 'clipboard',
		link: '/documentation'
	},
	{
		id: uuid(),
		title: 'Changelog',
		icon: 'git-pull-request',
		link: '/changelog'
	},
	{
		id: uuid(),
		title: 'Download',
		icon: 'download',
		link: 'https://codescandy.gumroad.com/l/dashui-nextjs'
	}*/
];

export default DashboardMenu;