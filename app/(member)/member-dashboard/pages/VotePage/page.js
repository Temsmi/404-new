'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VotePage() {
  const [status, setStatus] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [candidatesByClub, setCandidatesByClub] = useState({});
  const [votedClubs, setVotedClubs] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    fetch('/api/votes/election-status')
      .then(res => res.json())
      .then(setStatus)
      .catch(err => console.error('Error fetching election status:', err));
  }, []);

  useEffect(() => {
    if (!status) return;

    if (status.stop && status.publish) {
      // Fetch results only if election stopped AND published
      fetch('/api/votes/results')
        .then(res => res.json())
        .then(data => {
          setClubs(data);
          const mapped = {};
          data.forEach(club => {
            mapped[club.id] = club.candidates;
          });
          setCandidatesByClub(mapped);
        });
    } else if (status.start && !status.stop) {
      // Normal voting mode
      fetch('/api/votes/clubs')
        .then(res => res.json())
        .then(data => {
          setClubs(data);
          data.forEach(club => {
            fetch(`/api/votes/candidates?clubId=${club.id}`)
              .then(res => res.json())
              .then(candidates => {
                setCandidatesByClub(prev => ({
                  ...prev,
                  [club.id]: Array.isArray(candidates) ? candidates : [],
                }));
              });
          });

          fetch('/api/votes/voted-clubs')
            .then(res => res.json())
            .then(({ votedClubs }) => setVotedClubs(new Set(votedClubs)));
        });
    }
  }, [status]);

  const vote = (candidateId, clubId) => {
    fetch('/api/votes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidateId, club_id: clubId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Vote submitted!');
          setVotedClubs(prev => new Set(prev).add(clubId));
        } else {
          alert(data.message || 'Vote failed');
        }
      });
  };

  if (!status) {
    return <div className="text-center mt-5">Loading election status...</div>;
  }

  if (status.stop && !status.publish) {
    // Election stopped but results not published yet
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">⛔ Elections have been stopped.</h2>
      </div>
    );
  }

  if (status.stop && status.publish) {
    // Show election results only if stopped AND published
    return (
      <div className="container py-5">
        <h1 className="mb-4 fw-bold text-center">🗳️ Election Results</h1>

       {Array.isArray(clubs) && clubs.map(club => {
  const candidates = candidatesByClub[club.id] || [];
  const topCandidateId = candidates[0]?.id;
          return (
            <div
              key={club.id}
              className="card mb-5 shadow border-0 mx-auto"
              style={{ maxWidth: '950px' }}
            >
              <div className="card-body">
              <div className="d-flex align-items-center mb-3">

<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <img
    src={club.logo}
    alt={`${club.name} logo`}
    style={{
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    }}
    onError={(e) => (e.target.src = '/images/default-logo.png')}
  />
  <h3 className="fw-bold m-0">{club.name}</h3>
</div>

</div>

                <h4 className="text-muted mb-4">Candidates</h4>

              {candidates.map(c => (
  <div
    key={c.id}
    className="card mb-3 p-3 shadow-sm "
    style={{
      backgroundColor: '#f8f9fa',
      border: c.id === topCandidateId ? '4px solid rgba(255, 187, 0, 0.71)' : '1px solid #dee2e6',
      boxShadow: c.id === topCandidateId ? '0 0 15px 5px rgba(255, 215, 0, 0.7)' : 'none',
      fontWeight: c.id === topCandidateId ? '700' : '400',
      borderRadius: '0.25rem',
    }}
  >
    <div className="row g-3 align-items-center">
      <div className="col-md-2 text-center">
        <img
          src={c.photo}
          alt="Candidate"
          className="img-fluid rounded"
          style={{ maxHeight: '100px', objectFit: 'cover' }}
        />
      </div>
      <div className="col-md-7">
        <h4 className="fw-semibold">
          {c.student_name} {c.id === topCandidateId && '👑'}
        </h4>
        <p className="mb-1 text-muted">{c.bio}</p>
      </div>
      <div className="col-md-3 text-end">
        <span className="badge bg-success fs-5">{c.votes} votes</span>
      </div>
    </div>
  </div>
))}

              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: show voting UI (when election started and not stopped)
  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold text-center">Club President Elections</h1>

      <div className="mb-4 text-center">
        <button
          onClick={() => router.push('./become-candidate')}
          className="btn btn-outline-primary"
        >
          Become a Candidate
        </button>
      </div>

      {clubs.map(club => (
        <div
          key={club.id}
          className="card mb-5 shadow-sm border-0 mx-auto"
          style={{ maxWidth: '950px' }}
        >
          <div className="card-body">
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <img
    src={club.logo}
    alt={`${club.name} logo`}
    style={{
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    }}
    onError={(e) => (e.target.src = '/images/default-logo.png')}
  />
  <h3 className="fw-bold m-0">{club.name}</h3>
</div>

            <hr className="mb-4" />
            <h4 className="text-muted mb-4">Candidates</h4>

            {!candidatesByClub[club.id] || candidatesByClub[club.id].length === 0 ? (
              <p className="text-secondary">No candidates found for this club.</p>
            ) : (
              candidatesByClub[club.id].map(c => (
                <div
                  key={c.id}
                  className="card mb-3 p-3 shadow-sm border"
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  <div className="row g-3 align-items-center">
                    <div className="col-md-2 text-center">
                      <img
                        src={c.photo}
                        alt="Candidate"
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-7">
                      <h4 className="fw-semibold">{c.student_name}</h4>
                      <p className="mb-1 text-muted">{c.bio}</p>
                    </div>
                    <div className="col-md-3 text-end">
                      <button
                        onClick={() => vote(c.id, club.id)}
                        disabled={votedClubs.has(club.id)}
                        className="btn btn-primary w-100"
                        style={{
                          backgroundColor: '#6f42c1',
                          borderColor: '#6f42c1',
                          opacity: votedClubs.has(club.id) ? 0.6 : 1,
                          cursor: votedClubs.has(club.id) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {votedClubs.has(club.id) ? 'Already Voted' : 'Vote'}
                      </button>
                      <button className="btn btn-outline-secondary btn-sm mt-2 d-block w-100">
                        Ask Question
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}