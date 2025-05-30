import {
    Briefcase,
    ListTask,
    People,
    Bullseye,
    Person,
    RocketTakeoff
} from 'react-bootstrap-icons';

export const DashCards_president = [
    {
       id:1,
       title : "Total Members",
       value : 52,
       icon: <Person size={18}/>,
      
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
        title : "Participation Rate",
        value : '1.2%',
        icon: <RocketTakeoff size={18}/>,
             }
];
export default DashCards_president;
