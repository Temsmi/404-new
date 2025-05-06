'use client';

import { useEffect, useState } from 'react';

export default function VotePage() {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch('/api/votes/clubs')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched clubs:', data);  // Log to verify the response
        if (Array.isArray(data)) {
          setClubs(data);
        } else {
          console.error('Expected an array but got:', data);
          setClubs([]); // Set clubs to empty if not an array
        }
      })
      .catch(err => console.error('Error fetching clubs:', err));  // Handle fetch errors
  }, []);

  const loadCandidates = (clubId) => {
    setSelectedClubId(clubId);
    fetch(`/api/votes/candidates?clubId=${clubId}`)
      .then(res => res.json())
      .then(setCandidates);
  };

  const vote = (candidateId) => {
    fetch('/api/votes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidateId, club_id: selectedClubId }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Vote submitted.");
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Vote for Club Presidents</h1>

      {clubs.map(club => (
        <div key={club.id} className="my-3">
          <h2 className="text-xl">{club.name}</h2>
          <button onClick={() => loadCandidates(club.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
            Show Candidates
          </button>
        </div>
      ))}

      {selectedClubId && candidates.length > 0 && (
        <div className="mt-5">
          {candidates.map(c => (
            <div key={c.id} className="border p-4 my-2 rounded shadow">
              <img src={c.photo} alt="Candidate" width="100" />
              <h4 className="text-lg">{c.student_name}</h4>
              <p>{c.bio}</p>
              <button onClick={() => vote(c.id)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">
                Vote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
