 'use client';

import { useEffect, useState } from 'react';
import { ListGroup, Row, Col, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import socket from 'app/lib/socket'; // make sure this is your client instance

const Notification = () => {
	const [notification, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchNotifications = async () => {
		try {
			const res = await fetch('/api/notification');
			if (!res.ok) throw new Error('Failed to fetch notifications');
			const data = await res.json();

			  // Defensive: check if data.notifications exists and is an array
    const notificationsArray = Array.isArray(data.notifications) ? data.notifications : [];
    setNotifications(notificationsArray);


		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();

		// Join socket room
		const setupSocket = async () => {
			const res = await fetch('/api/getClubId');
			const { club_id } = await res.json();
			if (!club_id) return;

			socket.connect();
			socket.emit('join_club', club_id);

			const handleAnnouncement = () => {
				// Just refetch when a new announcement is received
				fetchNotifications();
			};

			socket.on('announcement_received', handleAnnouncement);

			// Cleanup on unmount
			return () => {
				socket.off('announcement_received', handleAnnouncement);
				socket.disconnect();
			};
		};

		setupSocket();
	}, []);

	if (loading) {
		return (
			<p>
				<Spinner animation="border" variant="info" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</p>
		);
	}
	if (error) return <p>Error: {error}</p>;
	if (notification.length === 0) return <p>No notifications found.</p>;

	return (
		<ListGroup variant="flush">
			{notification.slice(0, 5).map((item, index) => (
				<ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={item.id}>
					<Row>
						<Col>
							<Link href="/dashboard/notification-history" className="text-muted">
								<h5 className="mb-1">{item.title}</h5>
								<p className="mb-0">{item.message.split('...')[0]}.</p>
								<p className="text-xs text-gray-400 mt-2">
									{new Date(item.created_at).toLocaleString()}
								</p>
							</Link>
						</Col>
					</Row>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default Notification;