'use client'

import { Fragment, useEffect, useState } from "react";

const Home = () => {
    const messages = [
        "Visit Memberships to join a club",
        "OR",
        "Click on the Help Page to guide you through the Club Management System"
    ];
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Fragment>
            <div
                style={{
                    backgroundImage: 'url("/images/welcome.jpeg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '15vh',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: 'bold'
                }}
            >
                <h1><strong>WELCOME NEW USER!</strong></h1>
                <p
                    className="fs-5"
                    style={{
                        marginTop: 'auto',
                        marginBottom: '10vh', // Lower the text visually
                        maxWidth: '700px',
                        fontSize: '50em',
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                >
                    {messages[messageIndex]}
                </p>
            </div>
        </Fragment>
    );
};

export default Home;