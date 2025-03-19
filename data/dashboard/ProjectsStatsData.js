import {
	Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';

export const ProjectsStats = [
    {
       id:1,
       title : "Total Clubs",
       value : 101,
       icon: <Briefcase size={18}/>,
      
    },
    /*{
        id:2,
        title : "Active Task",
        value : 132,
        icon: <ListTask size={18}/>,
        statInfo: '<span className="text-dark me-2">28</span> Completed' 
     },
     {
        id:3,
        title : "Teams",
        value : 12,
        icon: <People size={18}/>,
        statInfo: '<span className="text-dark me-2">1</span> Completed' 
     },*/
     {
        id:4,
        title : "Site Engagement",
        value : '76%',
        icon: <Bullseye size={18}/>,
             }
];
export default ProjectsStats;
