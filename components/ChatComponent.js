'use client';

import { useEffect, useRef, useState } from 'react';
import DropdownMenu from './ChatDropdown';
import EmojiPicker from 'emoji-picker-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatStore } from '/widgets/store';
import { format } from 'date-fns';
import { filterBadWords } from '@tekdi/multilingual-profanity-filter';
import turkishProfanities from 'widgets/trProfanities';
import socket from 'app/lib/socket';

export function groupMessagesByDate(messages) {
  return messages.reduce((acc, msg) => {
    const date = format(new Date(msg.timestamp), 'yyyy-MM-dd');
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});
}

const ChatComponent =  ({ activeChannel, selectedClubId, handleChannelClick, availableChannels}) => {
  const setActiveChannelId = useChatStore((state) => state.setActiveChannelId);
  const lastViewedId = useChatStore(state => state.lastViewed[activeChannel?.id]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null); // for self-message check
  const endRef = useRef(null);
  const [clubIds, setClubIds] = useState([]); // empty array as initial state
  const [allClubs, setAllClubs] = useState([]);
  const [role, setRole] = useState(null);

function cleanProfanity(input) {
  let text = filterBadWords(input, 'en');

  turkishProfanities.forEach(word => {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    text = text.replace(regex, '*'.repeat(word.length));
  });

  return text;
}

function escapeRegex(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

    useEffect(() => {
    setActiveChannelId(activeChannel?.id || null);
  }, [activeChannel]);

useEffect(() => {
  fetch("/api/getClubId")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.club_id)) {
        // Already an array
        setClubIds(data.club_id);
      } else if (data.club_id) {
        // Single value converted to array
        setClubIds([data.club_id]);
      } else {
        console.error("Failed to get clubId", data);
      }
    })
    .catch((err) => console.error("Error fetching clubId", err));
}, []);

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        setUserId(data.userId);
        setRole(data.role);
      })
      .catch(err => console.error("Session fetch error:", err));
  }, []);

 useEffect(() => {
  fetch('/api/club')
    .then(res => res.json())
    .then(data => setAllClubs(data))
    .catch(err => console.error("Club fetch error:", err));
}, []);
  
const lastJoinedClubId = useRef(null);
useEffect(() => {
  const currentClubId = activeChannel?.club_id;
  if (!currentClubId || lastJoinedClubId.current === currentClubId) return;

  socket.emit("join_club", currentClubId);
  lastJoinedClubId.current = currentClubId;
}, [activeChannel?.club_id]);


useEffect(() => {
  if (!activeChannel?.name || !userId || clubIds.length === 0) return;

  const clubIdParam = clubIds.join(",");
  fetch(`/api/chats?channel=${activeChannel.name}&club_id=${clubIdParam}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        return;
      }

      const updated = data.map(msg => ({
        ...msg,
        self: msg.user_id === userId,
      }));
      setMessages(updated);
    })
    .catch(err => console.error("Error loading messages:", err));
}, [activeChannel, userId, clubIds]);



const activeChannelRef = useRef(activeChannel);
useEffect(() => {
  activeChannelRef.current = activeChannel;
}, [activeChannel]);

const userIdRef = useRef(userId);
useEffect(() => {
  userIdRef.current = userId;
}, [userId]);

useEffect(() => {
  const handler = (message) => {
    const messageChannelId = Number(message.channel_id);
    const currentChannelId = Number(activeChannelRef.current?.id);
    const currentUserId = userIdRef.current;

    console.log("📨 Received message:", message);
    console.log("📡 Active channel ID:", currentChannelId);
    console.log("🔵 Message channel ID:", messageChannelId);

    const isDifferentChannel = messageChannelId !== currentChannelId;
    console.log("📢 Should show toast?", isDifferentChannel);

    if (isDifferentChannel) {
      toast.info(`💬 ${message.text || 'New message'} from another channel`, {
        toastId: `channel-${message.channel_id}`,
      });
    } else {
      setMessages(prev => [...prev, {
        ...message,
        self: message.user_id === currentUserId,
      }]);
    }
  };

  socket.on('receiveMessage', handler);
  return () => socket.off('receiveMessage', handler);
}, []);

  const groupedMessages = groupMessagesByDate(messages);
useEffect(() => {
  const channelId = activeChannel?.id;
  const tabId = Math.random().toString(36).substr(2, 5); // temporary tab ID for debugging

  if (!channelId) return;

  console.log(`[🧪 TAB ${tabId}] Joining channel: ${channelId}`);
  socket.emit("join_channel", channelId);

  return () => {
    console.log(`[🧪 TAB ${tabId}] Leaving channel: ${channelId}`);
    socket.emit("leave_channel", channelId);
  };
}, [activeChannel?.id]);


useEffect(() => {
  if (messages.length === 0 || !activeChannel?.id) return;

  const lastViewed = useChatStore.getState().lastViewed[activeChannel.id];

  if (lastViewed) {
    const el = document.getElementById(`message-${lastViewed}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}, [messages, activeChannel?.id]);

const setLastViewed = useChatStore((state) => state.setLastViewed);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id) {
            setLastViewed(activeChannel?.id, id);
          }
        }
      });
    },
    { threshold: 1.0 }
  );

  const elements = document.querySelectorAll("[data-id]");
  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [messages, activeChannel?.id]);

const sendMessage = async () => {
  let cleaned = cleanProfanity(text.trim());
  if (!cleaned) return;

  if (cleaned !== text.trim()) {
  toast.warning("Please avoid inappropriate language.");
} // replaces bad words with ****

if (!allClubs || allClubs.length === 0) {
  console.warn("Club list not yet loaded");
  return;
}

const clubObject = allClubs.find(c => String(c.id) === String(selectedClubId));
const clubName = clubObject?.name || "Unknown Club";

  const messageData = {
    text: cleaned,
    channel: activeChannel.name,
    channel_id: activeChannel.id,
    user_id: userId,
    club_id: clubObject?.id,
    timestamp: new Date().toISOString(),
    club_name: clubName
  };

  console.log(messageData);
  setText("");

  try {
    const res = await fetch('/api/chats', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to send message");
    }

    const message_id = result.id; // ✅ this is your insertId

    // Now emit the message via socket including the ID
    socket.emit("new_message", {
      ...messageData,
      message_id,
    });
      console.log("⬆️ Emitted new_message:", messageData);
  } catch (err) {
    console.error("Failed to save message:", err);
  }
};

const restrictedChannels = ['rules', 'faq', 'announcements'];
const isRestricted = role === 'member' && restrictedChannels.includes(activeChannel?.name?.toLowerCase());

const handleEmoji = (e) => {
  setText(prev => prev + e.emoji);
  setOpen(false);
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// const handleChannelClick = (channel) => {
//     setActiveChannel(channel);
//   };
const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
const formattedLastMessageTime = lastMessage
  ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  : '';
let hasShownLastSeen = false;

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <div className="texts">
            <span className="channel-name"> #{activeChannel?.name} </span>
            <span className="last-message">
              {lastMessage ? `Last message at ${formattedLastMessageTime}` : 'No messages yet'}
            </span>
          </div>
        </div>
        <div className="icons flex items-center gap-2">
          <img src="/fonts/feather-icons/icons/info.svg" alt="Info" />
          <DropdownMenu />
        </div>
      </div>

      <div className="center">
        {Object.entries(groupedMessages).map(([date, messages]) => (
      <div key={date}>
      <div className="date-label text-center text-gray-700 my-4">
        {format(new Date(date), 'MMMM d, yyyy')}
      </div>
        {messages.map((msg, idx) => (
          <div
          key={idx}
          id={`message-${msg.id}`}
          data-id={msg.id}
          className={`message ${msg.self ? 'own' : ''}`}
        >
          {/* <div key={idx} className={`message ${msg.self ? 'own' : ''}`}> */}
          {msg.id === lastViewedId && !hasShownLastSeen && (hasShownLastSeen = true) && (
            <div className="last-seen-marker text-center text-sm text-gray-300 my-2">
              <hr />
              <span>Last seen here</span>
              <hr />
            </div>
          )}
            {!msg.self && <img src="/images/avatar/avatar-1.jpg" alt="Avatar" />}
            <div className="texts">
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
         ))}
    </div>
  ))}
        <div ref={endRef}></div>
      </div>

            <div className="bottom">
              {isRestricted ? (
                <div className="restricted-banner">
                  <span>
                    Done reading? Check out <strong>#general-chat</strong>.
                  </span>
                  <button className="redirect-button" onClick={() => {
                  const generalChannel = availableChannels.find(
                            (c) =>
                              c.name === "general-chat" &&
                              String(c.club_id) === String(selectedClubId)
                          );

                          if (generalChannel) {
                            handleChannelClick(generalChannel);
                          } else {
                            toast.warn("Couldn't find the general-chat channel.");
                          }
                  }}>
                    <img src="/fonts/feather-icons/icons/arrow-right-circle.svg" alt="Go" />
                  </button>
                </div>
              ) : (
                <>
                <div className="input-wrapper">
                  <div className="icons">
                    <img src="/fonts/feather-icons/icons/add.svg" alt="Attachment" />
                  </div>
                  <input
                    type="text"
                    placeholder=" Join the conversation..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <img src="/fonts/feather-icons/icons/mic.svg" alt="Mic" /></div>
                  <div className="side-icons">
                  <div className="emoji">
                    <img
                      src="/fonts/feather-icons/icons/emoji.svg"
                      alt="Emoji"
                      onClick={() => setOpen(prev => !prev)}
                    />
                    {open && (
                      <div className="picker">
                        <EmojiPicker onEmojiClick={handleEmoji} />
                      </div>
                    )}
                  </div>
                                          <button className="send-icon" onClick={sendMessage}>
                          <img src="/fonts/feather-icons/icons/send-1.svg" alt="Send" />
                        </button>
                  {/* <button className="sendButton" onClick={sendMessage}>Send</button> */}
                </div></>
              )}
            </div>
            



      <style jsx>{`
        .chat {
          flex: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: white;
        }
.chat .top {
  background:rgba(92, 111, 149, 0.48);
  color: black;
  padding: 2px 9px; /* ↓ Reduced vertical padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  font-size: 11px; /* ↓ Slightly smaller text */
  height: 80px; /* optional: force a consistent height */
}


.chat .top .channel-name {
  font-weight: 600;
  font-size: 8px;
}

.chat .top .last-message {
  color: #6b7280; /* Tailwind's gray-500 */
  font-size: 8px;
  margin-left: 8px;
  flex: 1;
}

        // .chat .top {
        //   background-color: rgba(186, 203, 213, 0.21);
        //   padding: 2px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: space-between;
        //   border-bottom: 1px solid #dddddd35;
        // }
        // .chat .top .user {
        //   display: flex;
        //   align-items: center;
        //   gap: 20px;
        // }
        // .chat .top .user img {
        //   width: 50px;
        //   height: 50px;
        //   border-radius: 50%;
        //   object-fit: cover;
        // }
        .chat .top .user .texts {
          display: flex;
          flex-direction: column;
          gap: 2px;
          line-height: 1.1;
        }
        .chat .top .user .texts span {
          font-size: 15px;
          font-weight: bold;
          margin-top: 18px;
        }
        // .chat .top .user .texts p {
        //   font-size: 14px;
        //   font-weight: 300;
        // }
        .chat .top .icons {
          display: flex;
          gap: 20px;
        }
        .chat .top .icons img {
          width: 20px;
          height: 20px;
        }
 .chat .center {
  padding: 20px;
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat .center .message {
  display: flex;
  gap: 10px;
  max-width: 100%;
  margin-bottom: 10px; 
}

.chat .center .message.own {
  justify-content: flex-end;
}

.chat .center .message img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.chat .center .message .texts {
  display: inline-block;
  max-width: 75%;
  padding: 12px 12px;
  border-radius: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.3;
  background-color: rgba(17, 25, 40, 0.3);
  color: white;
  font-size: 14px;
}

.chat .center .message.own .texts {
  background-color: #5183fe;
}

.chat .center .message .texts span {
  font-size: 12px;
  margin-top: 4px;
  color: #e1e1e1;
  align-self: flex-end;
}

.chat .bottom {
  padding: 12px 16px;
  border-top: 1px solid #e2e2e2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat .input-wrapper {
  display: flex;
  align-items: center;
  background-color:rgba(92, 111, 149, 0.48);
  padding: 6px 10px;
  border-radius: 20px;
  gap: 4px;S
  flex: none;                 /* ← prevent it from stretching too wide */
  width: 100%;                /* allow room for icons */
  max-width: 90%;  
  max-height: 40px;
}

.chat .input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color:rgb(255, 255, 255);
  padding: 4px 0;
}
.chat .input-wrapper input::placeholder {
  color: white;
  opacity: 1; /* Make sure it's not faded */
}

.chat .input-wrapper img {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.chat .side-icons {
  display: flex;
  align-items: center;
  gap: 25px;
}

.chat .side-icons img {
  width: 25px;
  height: 25px;
  position: relative;
  cursor: pointer;
}

.chat .send-icon {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
   cursor: pointer;
}


        // .chat .bottom {
        //   padding: 20px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: space-between;
        //   border-top: 1px solid #dddddd35;
        //   gap: 20px;
        //   margin-top: auto;
        // }
        // .chat .bottom .icons {
        //   display: flex;
        //   gap: 20px;
        // }
        // .chat .bottom img {
        //   width: 24px;
        //   height: 24px;
        //   cursor: pointer;
        // }
        // .chat .bottom input {
        //   flex: 1;
        //   background-color: rgb(152, 172, 183);
        //   border: none;
        //   outline: none;
        //   color: white;
        //   padding: 10px;
        //   border-radius: 10px;
        //   font-size: 16px;
        // }
        // .chat .bottom .emoji {
        //   width: 30px;
        //   height: 30px;
        //   position: relative;
        // }
        .chat .bottom .emoji .picker {
          position: absolute;
          bottom: 30px;
          right: 0;
        }
        // .chat .bottom .sendButton {
        //   background-color: #5183fe;
        //   color: white;
        //   padding: 10px 20px;
        //   border: none;
        //   border-radius: 5px;
        //   cursor: pointer;
        // }
          .restricted-banner {
  background-color: #1e1f22;
  color: #e0e0e0;
  padding: 12px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
}

.restricted-banner strong {
  color: #a3a3ff;
}

.redirect-button {
  background-color: #5865f2;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 12px;
}

.redirect-button img {
  width: 16px;
  height: 16px;
  filter: invert(1);
}
  .last-seen-marker {
  position: relative;
  text-align: center;
  font-size: 13px;
  color: #b0b0b0;
}

.last-seen-marker hr {
  border: none;
  border-top: 1px solid #444;
  margin: 6px 0;
}

      `}</style>
    </div>
  );
};

export default ChatComponent;
