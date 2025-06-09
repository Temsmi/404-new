'use client';

export default function Chats() {
  return (
    <div className="sidebar">
      <div className="server-header">
        <span className="server-name">inZOI</span>
      </div>

      <div className="section">
        <p className="section-label">👋 Welcome, Creator</p>
        <div className="channel active">📄 rules</div>
        <div className="channel"># faq</div>
      </div>

      <div className="section">
        <p className="section-label">📢 Info & Announcements</p>
        <div className="channel">📣 announcements</div>
      </div>

      <div className="section">
        <p className="section-label">🏡 Community</p>
        <div className="channel"># inzoi-chat</div>
        <div className="channel active"># inzoi-media</div>
      </div>

      <style jsx>{`
        .sidebar {
          background-color: #1e1f22;
          width: 280px;
          height: 100vh;
          overflow-y: auto;
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          padding: 0.75rem;
        }

        .server-header {
          background-image: url('/your-banner-image.jpg'); /* Replace with actual banner URL */
          background-size: cover;
          background-position: center;
          height: 120px;
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          padding: 0.5rem;
          margin-bottom: 1rem;
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

        .channel.active {
          background-color: #35363a;
          font-weight: bold;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
