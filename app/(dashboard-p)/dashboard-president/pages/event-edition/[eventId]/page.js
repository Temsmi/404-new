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