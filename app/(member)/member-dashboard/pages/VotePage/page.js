'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VotePage() {
  const [clubs, setClubs] = useState([]);
  const [candidatesByClub, setCandidatesByClub] = useState({});
  const [votedClubs, setVotedClubs] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    
    fetch('/api/votes/clubs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClubs(data);

          // Fetch candidates for each club
          data.forEach(club => {
            fetch(`/api/votes/candidates?clubId=${club.id}`, { credentials: 'include' })
              .then(res => res.json())
              .then(candidates => {
                setCandidatesByClub(prev => ({
                  ...prev,
                  [club.id]: Array.isArray(candidates) ? candidates : [],
                }));
              })
              .catch(err =>
                console.error(`Error loading candidates for club ${club.id}:`, err)
              );
          });

          // Fetch already voted clubs for this user
          fetch('/api/votes/voted-clubs', { credentials: 'include' })
            .then(res => res.json())
            .then(({ votedClubs }) => {
              setVotedClubs(new Set(votedClubs));
            })
            .catch(err => console.error('Error fetching voted clubs:', err));
        }
      })
      .catch(err => console.error('Error fetching clubs:', err));
  }, []);

  const vote = (candidateId, clubId) => {
    fetch('/api/votes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ candidate_id: candidateId, club_id: clubId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Vote submitted successfully!');
          setVotedClubs(prev => new Set(prev).add(clubId)); // update local state
        } else {
          alert(data.message || 'Vote failed');
        }
      })
      .catch(() => alert('Something went wrong while submitting your vote.'));
  };

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
        <div key={club.id} className="card mb-5 shadow-sm border-0 mx-auto" style={{ maxWidth: '950px' }} >
          <div className="card-body" >
            <h3 className="card-title fw-bold">{club.name}</h3>
            <hr className="mb-4" />
            <h4 className="text-muted mb-4">Candidates</h4>

            {(!candidatesByClub[club.id] ||
              candidatesByClub[club.id].length === 0) ? (
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
                        style={{
                          maxHeight: '100px',
                          objectFit: 'cover',
                        }}
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
                          cursor: votedClubs.has(club.id)
                            ? 'not-allowed'
                            : 'pointer',
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
