'use client';

import { useEffect, useRef, useCallback } from 'react';
import socket from 'app/lib/socket';
import { toast } from 'react-toastify';

const NotificationListener = () => {
	const handleAnnouncementRef = useRef(null);

	const fetchNotifications = useCallback(async () => {
		try {
			await fetch('/api/notification');
		} catch (err) {
			console.error('Notification fetch failed', err);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;

		const setupSocket = async () => {
			const res = await fetch('/api/getClubId');
			const { club_id } = await res.json();
			if (!club_id || !isMounted) return;

			socket.connect();
			socket.emit('join_club', club_id);

			const handleAnnouncement = (data) => {
				toast.info(`📢 ${data.title}`, {
					position: 'top-right',
					autoClose: 5000,
				});
				fetchNotifications();
			};

			handleAnnouncementRef.current = handleAnnouncement;
			socket.on('announcement_received', handleAnnouncement);
		};

		setupSocket();

		return () => {
			isMounted = false;
			if (handleAnnouncementRef.current) {
				socket.off('announcement_received', handleAnnouncementRef.current);
			}
			socket.disconnect();
		};
	}, [fetchNotifications]);

	return null; // doesn't render anything
};

export default NotificationListener;
