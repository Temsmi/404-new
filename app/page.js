'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'react-bootstrap';

const Home = () => {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/session');
                if (res.ok) {
                    const data = await res.json();
                    setSession(data);

                    // Redirect based on role
                    switch (data.role) {
                        case 'admin':
                            router.push('/dashboard');
                            break;
                        case 'president':
                            router.push('/dashboard-president');
                            break;
                        default:
                            router.push('/member-dashboard');
                            break;
                    }
                } else {
                    router.push('/authentication/sign-in');
                }
            } catch (error) {
                console.error('Session fetch error:', error);
                router.push('/authentication/sign-in');
            }
        };

        fetchSession();
    }, [router]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" variant="info" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};

export default Home;