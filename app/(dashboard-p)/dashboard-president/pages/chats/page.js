'use client';

import 'styles/Chat.scss';
import { useEffect, useState } from "react";
import ChatComponent from "components/ChatComponent";
import { Spinner } from "react-bootstrap";

export default function Sidebar() {
  const [clubIds, setClubIds] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [showLogoPopup, setShowLogoPopup] = useState(null); 
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [chatVisible, setChatVisible] = useState(true);

  if (!chatVisible) return null;
  useEffect(() => {
    fetch("/api/getClubId")
      .then((res) => res.json())
      .then((data) => {
        const ids = Array.isArray(data.club_id) ? data.club_id : [data.club_id];
        setClubIds(ids);
      })
      .catch((error) => console.error("Fetch error (clubId):", error));

    fetch("/api/club")
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((error) => console.error("Fetch error (clubs):", error));
  }, []);

useEffect(() => {
  if (clubIds.length > 0 && clubs.length > 0) {

  const matchedClubs = clubs.filter((club) =>
  clubIds.map(String).includes(String(club.id))
    );

    setUserClubs(matchedClubs);
    setSelectedClubId(matchedClubs[0]?.id || null);
  }
}, [clubIds, clubs]);

useEffect(() => {
  if (selectedClubId) {
    fetch(`/api/channel?clubId=${selectedClubId}`)
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
      });
  }
}, [selectedClubId]);

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };

  return (
    <>
      <div className="layout-container">
        <div className="sidebar">
  {userClubs.length > 0 ? (
    <>
      {userClubs.length > 1 && (
        <div className="club-dropdown-container">
          <select
            value={selectedClubId || ""}
            onChange={(e) => {
              setSelectedClubId(Number(e.target.value));
              setActiveChannel(null);
            }}
            className="club-dropdown"
          >
            {userClubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {userClubs
        .filter((club) => String(club.id) === String(selectedClubId))
        .map((club) => {
          const clubChannels = channels.filter((c) => c.club_id === club.id);
          return (
            <div key={club.id} className="club-section">
              <div
                className="server-header"
                onClick={() => setShowLogoPopup(club.logo)}
                style={{
                  backgroundImage: `url('/images/ClubsLogo/${club.logo}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <span className="server-name">{club.name}</span>

              <div className="section">
                <p className="section-label">👋 Welcome</p>
                {clubChannels
                  .filter((channel) => channel.category === "welcome")
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className="channel"
                      onClick={() => handleChannelClick(channel)}
                    >
                      # {channel.name}
                    </div>
                  ))}
              </div>

              <div className="section">
                <p className="section-label">🏡 Community</p>
                {clubChannels
                  .filter((channel) => channel.category === "general")
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className="channel"
                      onClick={() => handleChannelClick(channel)}
                    >
                      # {channel.name}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
    </>
  ) : (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant="info" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )}
</div>


        <div className="main-content">
          {!activeChannel ? (
            <img src="/images/svg/try.svg" alt="Club Background" className="club-bg" />
          ) : (
        <ChatComponent activeChannel={activeChannel} selectedClubId={selectedClubId}  handleChannelClick={setActiveChannel} onClose={setChatVisible}/>
           )}
        </div>
      </div>

      {showLogoPopup && (
        <div className="logo-modal" onClick={() => setShowLogoPopup(null)}>
          <img src={`/images/ClubsLogo/${showLogoPopup}`} alt="Full Logo" />
        </div>
      )}
    </>
  );
}