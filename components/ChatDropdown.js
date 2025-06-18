import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ChatHeader({ selectedClubId, onClose }) {
  const [showClubInfo, setShowClubInfo] = useState(true);
  const [club, setClub] = useState(null);

  const handleClose = () => {
    setShowClubInfo(false);
    onClose();
  };

  useEffect(() => {
    if (!selectedClubId) return;
      console.log(selectedClubId);
    fetch(`/api/selectedClubID?club_id=${selectedClubId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setClub(data[0]); 
        } else if (data && typeof data === 'object') {
          setClub(data); 
        } else {
          console.warn("Unexpected club data:", data);
        }
      })
      .catch(err => console.error("Club fetch error:", err));
  }, [selectedClubId]);

  return (
    <Modal
      show={showClubInfo}
      onHide={handleClose}
      centered
      dialogClassName="popup-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {club?.logo && (
            <img src={`/images/Clubslogo/${club.logo}`} alt="Club Logo" className="me-2" style={{ width: 50, height: 50, borderRadius: '50%' }} />
          )}
          {club?.name || "Club Info"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Description:</strong> {club?.description || "Not available"}</p>
        <p><strong>Member count:</strong> {club?.member_count ?? "N/A"}</p>
        <p><strong>Date created:</strong> {club?.created_at ? new Date(club.created_at).toLocaleDateString() : "Unknown"}</p>
        <p><strong>President:</strong> {club?.president_name || "Not listed"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .popup-modal .modal-dialog {
          max-width: 400px;
        }
      `}</style>
    </Modal>
  );
}