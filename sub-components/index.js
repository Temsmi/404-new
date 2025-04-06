/**
 * The folder sub-components contains sub component of all the pages,
 * so here you will find folder names which are listed in root pages.
 */

// sub components for /pages/dashboard
import ClubsTable from 'sub-components/dashboard/ClubsTable';
import TasksPerformance from 'sub-components/dashboard/TasksPerformance';
import Teams from 'sub-components/dashboard/Teams';

// sub components for /pages/profile
import AboutAdmin from 'sub-components/profile/AboutAdmin';
import HeaderAdmin from 'sub-components/profile/HeaderAdmin';

import AboutMe from 'sub-components/profile/AboutMe';
import ActivityFeed from 'sub-components/profile/ActivityFeed';
import MyTeam from 'sub-components/profile/MyTeam';
import ProfileHeader from 'sub-components/profile/ProfileHeader';
import ProjectsContributions from 'sub-components/profile/ProjectsContributions';
import RecentFromBlog from 'sub-components/profile/RecentFromBlog';

// sub components for /pages/billing
import CurrentPlan from 'sub-components/billing/CurrentPlan';
import BillingAddress from 'sub-components/billing/BillingAddress';

// sub components for /pages/settings
import DeleteAccount from 'sub-components/settings/DeleteAccount';
import EmailSetting from 'sub-components/settings/EmailSetting';
import EmailAdmin from 'sub-components/settings/EmailAdmin';

import GeneralSetting from 'sub-components/settings/GeneralSetting';
import Notifications from 'sub-components/settings/Notifications';
import Preferences from 'sub-components/settings/Preferences';


export {
   ClubsTable,
   TasksPerformance,
   Teams,

   AboutAdmin,
   AboutMe,
   ActivityFeed,
   MyTeam,
   HeaderAdmin,
   ProfileHeader,
   ProjectsContributions,
   RecentFromBlog,

   CurrentPlan,
   BillingAddress,

   DeleteAccount, 
   EmailAdmin,
   EmailSetting,  
   GeneralSetting, 
   Notifications, 
   Preferences
};
