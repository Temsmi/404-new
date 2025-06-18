'use client';

import { useEffect, useState } from 'react';
import { ListGroup, Row, Col, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import socket from 'app/lib/socket';

const Notification = () => {
	const [notification, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchNotifications = async () => {
		try {
			const res = await fetch('/api/notification');
			if (!res.ok) throw new Error('Failed to fetch notifications');
			const data = await res.json();
			setNotifications(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

		useEffect(() => {
  		fetchNotifications();

  const setupSocket = async () => {
    try {
      const res = await fetch('/api/getClubId');
      const data = await res.json();
      let clubIds = data.club_id || data.clubIds; // handle both cases

      if (!clubIds) return;
      clubIds = Array.isArray(clubIds) ? clubIds : [clubIds];

      socket.connect();

      clubIds.forEach((id) => {
        socket.emit('join_club', id);
      });

      const handleAnnouncement = () => {
        fetchNotifications(); // announcement refresh
      };

      const handleMessage = () => {
        fetchNotifications(); // chat message refresh
      };

      socket.on('announcement_received', handleAnnouncement);
      socket.on('receiveMessage', handleMessage); // ✅ add this

      return () => {
        socket.off('announcement_received', handleAnnouncement);
        socket.off('receiveMessage', handleMessage); // ✅ clean up
        socket.disconnect();
      };
    } catch (err) {
      console.error("Failed to setup socket for notifications:", err);
    }
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

	if (error) return <p> </p>;
	if (notification.length === 0) return <p>No notifications found.</p>;

return (
  <ListGroup variant="flush">
    {Array.isArray(notification) && notification.length > 0 ? (
      notification.slice(0, 5).map((item, index) => (
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
      ))
    ) : (
      <div className="p-3 text-muted">No notifications</div>
    )}
  </ListGroup>
);
};

export default Notification;