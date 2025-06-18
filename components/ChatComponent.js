'use client';

import 'styles/Chat.scss';
import { useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatDropdown';
import EmojiPicker from 'emoji-picker-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatStore } from '/widgets/store';
import { format } from 'date-fns';
import { Filter } from 'bad-words';
import socket from 'app/lib/socket';

export function groupMessagesByDate(messages) {
  return messages.reduce((acc, msg) => {
    const date = format(new Date(msg.timestamp), 'yyyy-MM-dd');
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});
}

const ChatComponent =  ({ activeChannel, selectedClubId, handleChannelClick, availableChannels, onClose}) => {
  const setActiveChannelId = useChatStore((state) => state.setActiveChannelId);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const endRef = useRef(null);
  const [clubIds, setClubIds] = useState([]); 
  const [allClubs, setAllClubs] = useState([]);
  const [role, setRole] = useState(null);
  const [showClubInfo, setShowClubInfo] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const falsePositives = ['am', 'i am', 'I am'];
  
const filter = new Filter();
filter.removeWords(...falsePositives);

function cleanProfanity(input) {
  return filter.clean(input);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

  useEffect(() => {
    setActiveChannelId(activeChannel?.id || null);
  }, [activeChannel]);

useEffect(() => {
  fetch("/api/getClubId")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.club_id)) {
        setClubIds(data.club_id);
      } else if (data.club_id) {
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

  fetch(`/api/chats?channel=${activeChannel.name}&club_id=${selectedClubId}`)
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

    const isDifferentChannel = messageChannelId !== currentChannelId;

    if (isDifferentChannel) {
      toast.info(`${message.text || 'New message'} from another channel`, {
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
  if (messages.length === 0 || !activeChannel?.id) return;

  const el = endRef.current;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
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

const sendMessage = async (audioOverride = null) => {
const trimmedText = text.trim();
const cleaned = cleanProfanity(trimmedText);

  if (cleaned !== trimmedText) {
    toast.warning("Please avoid inappropriate language.");
    return;
  }

  const isTextMessage = !!trimmedText;
  const isAudioMessage = !!audioOverride || !!audioURL;

  if (!isTextMessage && !isAudioMessage) return;

  if (cleaned !== trimmedText) {
    toast.warning("Please avoid inappropriate language.");
  }

  if (!allClubs || allClubs.length === 0) {
    console.warn("Club list not yet loaded");
    return;
  }


const clubObject = allClubs.find(c => String(c.id) === String(selectedClubId));
const clubName = clubObject?.name || "Unknown Club";

  const messageData = {
    text: isTextMessage ? cleaned : 'audio message',
    audio: isAudioMessage ? (audioOverride || audioURL) : null,
    image: null,
    message_type: isAudioMessage ? 'audio' : 'text',
    channel: activeChannel.name,
    channel_id: activeChannel.id,
    user_id: userId,
    club_id: clubObject?.id,
    timestamp: new Date().toISOString(),
    club_name: clubName
  };

  setText("");
   setAudioURL(null);

  try {
  const res = await fetch('/api/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to send message");
    }

    const message_id = result.id;

    setMessages(prev => [...prev, {
      ...messageData,
      id: message_id,
      self: true
        }]);

    socket.emit("new_message", {
      ...messageData,
      message_id,
    });
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

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
      ? 'audio/ogg;codecs=opus'
      : '';

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = []; 
    setRecording(true);
    setRecordingTime(0);

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunksRef.current.push(e.data); 
      }
    };

    recorder.onstop = async () => {
      clearInterval(timerRef.current);

      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });

      if (audioBlob.size === 0) {
        console.error("Audio blob is empty → skipping upload.");
        toast.error("Recording failed — please try again.");
        setRecording(false);
        setRecordingTime(0);
        return;
      }

      const audioFile = new File([audioBlob], "recording.webm", { type: audioBlob.type });
      const cloudinaryUrl = await uploadToCloudinary(audioFile);

      setAudioURL(cloudinaryUrl);
      setRecording(false);
      setRecordingTime(0);

      audioChunksRef.current = [];

      sendMessage(cloudinaryUrl);
    };

    recorder.start();

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  } catch (err) {
    console.error("Error starting recording:", err);
    toast.error("Could not start recording — please check microphone permissions.");
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
    mediaRecorderRef.current.stop();
  }
};
  if (!MediaRecorder.isTypeSupported('audio/webm')) {
  toast.error("Your browser does not support WebM audio recording.");
  return;
}

 const uploadToCloudinary = async (audioBlob) => {
  const formData = new FormData();

  const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
  formData.append('file', audioFile);
  formData.append('upload_preset', 'audio_unsigned');
  formData.append('folder', 'audio_uploads');

  const res = await fetch('https://api.cloudinary.com/v1_1/dl7wibkyz/raw/upload', {
    method: 'POST',
    body: formData,
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Cloudinary upload failed:", res.status, text);
    throw new Error("Cloudinary upload failed");
  }

  const data = JSON.parse(text);
  return data.secure_url;
};

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return  `${min}:${sec}`;
  }

const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
const formattedLastMessageTime = lastMessage
  ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  : '';
  const handleClick = () => {
    fileInputRef.current.click();
  };

    const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      const clubObject = allClubs.find(c => String(c.id) === String(selectedClubId));
      const clubName = clubObject?.name || "Unknown Club";

      const messageData = {
        text: 'media',
        image: data.url,
        audio: null,
        message_type: "media",
        channel: activeChannel.name,
        channel_id: activeChannel.id,
        user_id: userId,
        club_id: selectedClubId,
        club_name: clubName,
        timestamp: new Date().toISOString(),
      };

      const chatRes = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const result = await chatRes.json();
      if (!chatRes.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      socket.emit("new_message", {
        ...messageData,
        message_id: result.id,
      });

    } else {
      console.error("Upload response missing URL:", data);
    }
  } catch (err) {
    console.error("❌ Upload or send failed:", err);
  }
};


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
        <div className="icons flex items-center gap-3">
  <img
    src="/fonts/feather-icons/icons/info.svg"
    alt="Info"
    onClick={() => setShowClubInfo(true)}
    className="cursor-pointer"
  />
</div>
      </div>
        {showClubInfo && (
  <ChatHeader selectedClubId= {selectedClubId} onClose={() => setShowClubInfo(false)} />
)}

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
          {!msg.self && (
            <div className="message-meta">
              <img
                src={msg.avatar || '/images/avatar/avatar.jpg'}
                alt={`${msg.username || 'User'} avatar`}
                className="avatar"
              />
              <div className="meta-info">
                <span className="username">{msg.username || 'User'}</span>
              </div>
            </div>
          )}

     {msg.text === 'media' && msg.image?.startsWith('http') ? (
    <div
      className="uploaded-image-container"
      style={{
        marginTop: '10px',
        marginBottom: '10px',
        textAlign: msg.self ? 'right' : 'left',
      }}
    >
      <img
        src={msg.image}
        alt="Uploaded media"
        className="uploaded-image"
        style={{ maxWidth: '300px', borderRadius: '8px' }}
      />
    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
) : (
  <div className="texts">
 {msg.text === 'audio message' && msg.audio?.startsWith('http') ? (
    <audio controls src={msg.audio} />
  ) : (
    <p>{msg.text}</p>
  )}
    <span className="timestamp-inside">
      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>
)}
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
                    {activeChannel?.name?.toLowerCase() === 'club-media' && (
                      <>
                        <img
                          src="/fonts/feather-icons/icons/add.svg"
                          alt="Attachment"
                          onClick={handleClick}
                          style={{ cursor: "pointer" }}
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          accept="image/,video/"
                        />
                      </>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder=" Join the conversation..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                     {!recording && (
    <img
      src="/fonts/feather-icons/icons/mic.svg"
      alt="Mic"
      onClick={startRecording}
      style={{ cursor: 'pointer' }}
    />
  )}
</div>
{recording && (
  <div style={{
    padding: '10px',
    border: '1px solid red',
    borderRadius: '8px',
    marginTop: '8px',
    background: '#ffeaea',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap', 
  }}>
    <span style={{ color: 'red', fontWeight: 'bold' }}>● Recording</span>
    <span>{formatTime(recordingTime)}</span>
    <button onClick={stopRecording} style={{ padding: '4px 8px' }}>
      Stop Recording
    </button>
  </div>
)}

{audioURL && (
                <div style={{ marginTop: '10px' }}>
                  <p>Uploaded Audio:</p>
                  <audio controls src={audioURL}></audio>
                </div> )}


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
                       <button className="send-icon" onClick={() => sendMessage()}>
                        <img src="/fonts/feather-icons/icons/send-1.svg" alt="Send" />
                        </button>
                </div></>
              )}
            </div>
    </div>
  );
};

export default ChatComponent;