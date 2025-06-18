'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import socket from 'app/lib/socket';
import { toast } from 'react-toastify';
import { useChatStore, useNotificationStore } from '/widgets/store';

const NotificationListener = () => {
  const activeChannelId = useChatStore((state) => state.activeChannelId);
  const { incrementUnread } = useNotificationStore();

  const activeChannelIdRef = useRef(activeChannelId);
  const handleAnnouncementRef = useRef(null);
  const handleMessageRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [clubId, setClubId] = useState(null);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
  }, [activeChannelId]);

  useEffect(() => {
    fetch('/api/session')
      .then((res) => res.json())
      .then((data) => setUserId(data?.userId || null))
      .catch((err) => console.error('Session fetch error:', err));
  }, []);

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
      try {
        const res = await fetch('/api/getClubId');
        const data = await res.json();
        let clubIds = data.club_id;

        if (!clubIds || !isMounted) return;

        clubIds = Array.isArray(clubIds) ? clubIds : [clubIds];

        setClubId(clubIds);

        socket.connect();

        clubIds.forEach((id) => {
          socket.emit('join_club', id);
        });

        const handleAnnouncement = (data) => {
          toast.info(`📢 ${data.title}`, {
            position: 'top-right',
            autoClose: 5000,
          });
          incrementUnread();
          fetchNotifications();
        };

        handleAnnouncementRef.current = handleAnnouncement;
        socket.on('announcement_received', handleAnnouncement);

        const handleMessage = async (message) => {
          const messageChannelId = Number(message.channel_id);
          const currentChannelId = Number(activeChannelIdRef.current);

          const isCurrentChannel = messageChannelId === currentChannelId;

          if (!isCurrentChannel) {
            toast.info(`New message(s) from ${message.club_name}`, {
              toastId: `toast-${message.channel_id}`,
            });

            if (userId) {
              try {
                const rew = await fetch('/api/notification', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    user_id: userId,
                    message_id: message.message_id,
                    channel_id: message.channel_id,
                    text: message.text,
                    timestamp: message.timestamp,
                    club_id: message.club_id,
                    type: 'chat',
                    title: `New Chat in ${message.club_name}`,
                    channel_name: message.channel,
                  }),
                });
                const reward = await rew.json();

                if (!rew.ok) {
                  console.error('❌ Notification POST failed:', reward);
                } else {
                  incrementUnread();
                  console.log('✅ Notification saved.');
                }
              } catch (err) {
                console.error('❌ Failed to save notification:', err);
              }
            }
          } else {
            console.log('🟢 Message is from current channel, no toast.');
          }
        };

        handleMessageRef.current = handleMessage;
        socket.on('receiveMessage', handleMessage);
      } catch (err) {
        console.error('Socket setup failed:', err);
      }
    };

    setupSocket();

    return () => {
      isMounted = false;
      if (handleAnnouncementRef.current) {
        socket.off('announcement_received', handleAnnouncementRef.current);
      }
      if (handleMessageRef.current) {
        socket.off('receiveMessage', handleMessageRef.current);
      }
      socket.disconnect();
    };
  }, [activeChannelId, userId, fetchNotifications, incrementUnread]);

  return null;
};

export default NotificationListener;