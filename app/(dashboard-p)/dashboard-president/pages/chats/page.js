'use client';

import { useEffect, useState } from "react";
import ChatComponent from "components/ChatComponent";
import { Spinner } from "react-bootstrap";

export default function Sidebar() {
  const [clubIds, setClubIds] = useState([]); // updated to support multiple
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [showLogoPopup, setShowLogoPopup] = useState(null); // changed to track clicked club
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);

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
    console.log("📌 clubIds:", clubIds);
    console.log("📌 all clubs:", clubs);

  const matchedClubs = clubs.filter((club) =>
  clubIds.map(String).includes(String(club.id))
    );

    console.log("✅ matchedClubs:", matchedClubs);

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

  const closeChat = () => {
    setActiveChannel(null);
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
              console.log(selectedClubId);
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
            <ChatComponent activeChannel={activeChannel} selectedClubId={selectedClubId}  handleChannelClick={setActiveChannel}/>
          )}
        </div>
      </div>

      {showLogoPopup && (
        <div className="logo-modal" onClick={() => setShowLogoPopup(null)}>
          <img src={`/images/ClubsLogo/${showLogoPopup}`} alt="Full Logo" />
        </div>
      )}

      <style jsx>{`
        .layout-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          background-color: #212b36;
          width: 280px;
          padding: 0.75rem;
          outline: 2px solid white;
          outline-offset: -2px;
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          overflow-y: auto;
        }

        .main-content {
          flex: 1;
          position: relative;
          background-color:rgb(235, 240, 245);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .club-bg {
          max-width: 70%;
          opacity: 0.2;
        }

        .chat-box {
          background: white;
          width: 80%;
          max-width: 600px;
          height: 70%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          padding: 1.5rem;
          border-radius: 10px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #eee;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
        }

        .server-header {
          height: 130px;
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          padding: 0.5rem;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .server-name {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .section {
          margin-bottom: 1rem;
        }

        .section-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #b5bac1;
          margin: 0.5rem 0;
        }

        .channel {
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #ddd;
        }

        .channel:hover {
          background-color: #2c2d30;
        }

        .logo-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .logo-modal img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
        }
          .club-dropdown-container {
          margin-bottom: 1rem;
        }

        .club-dropdown {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: none;
          font-size: 0.95rem;
          background-color: #2c2d30;
          color: #fff;
        }

        .club-dropdown option {
          background-color: #2c2d30;
          color: #fff;
        }
      `}</style>
    </>
  );
}
