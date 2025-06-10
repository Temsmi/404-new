import { ListButtonCode } from 'data/code/ListgroupsCode';
import {
    List,
    People,
    GraphUp
} from 'react-bootstrap-icons';

export const DashCards = [
    {
        id: 1,
        title: "Total Clubs",
        value: '', // You can set dynamic value later
        icon: <List size={18} />,
    },
    {
        id: 2,
        title: "Total Members",
        value: '', // You can set dynamic value later
        icon: <People size={18} />,
    },
    {
        id: 3,
        title: "Site Engagement",
        value: '7.6%',
        icon: <GraphUp size={18} />,
    }
];

export default DashCards;
