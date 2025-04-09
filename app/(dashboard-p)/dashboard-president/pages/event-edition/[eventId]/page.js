// 'use client';

// import { useParams } from 'next/navigation';

// const EditEventPage = () => {
//   const { eventId } = useParams();

//   return (
//     <div style={{ padding: '2rem', fontSize: '1.2rem' }}>
//       <h1>Edit Event</h1>
//       <p>Event ID: {eventId}</p>
//     </div>
//   );
// };

// export default EditEventPage;

'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EditEventPage() {
    const params = useParams();

    useEffect(() => {
        console.log('Params:', params);
    }, [params]);

    return <h1>Editing event with ID: {params.eventId}</h1>;
}