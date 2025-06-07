'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BecomeCandidatePage() {
  const [user, setUser] = useState({ name: '', surname: '' });
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyCandidate, setAlreadyCandidate] = useState(false); // Track if the user is already a candidate
  const router = useRouter();

  useEffect(() => {
    // Fetch the user information including their name, surname, and clubs
    fetch('/api/become-candidate', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser({ name: data.name, surname: data.surname });
          setClubs(data.clubs);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load user info.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Check if the user is already a candidate for the selected club
  useEffect(() => {
    if (clubId) {
      fetch(`/api/check-candidate?clubId=${clubId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setAlreadyCandidate(data.isCandidate); // Assume the response has an "isCandidate" boolean
        })
        .catch(err => console.error('Error checking if already a candidate:', err));
    }
  }, [clubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyCandidate) {
      setError('You are already a candidate for this club.');
      return;
    }

    // Check if a photo is selected
    if (!photo) {
      setError('Please upload a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('club_id', clubId);
    formData.append('bio', bio);
    formData.append('photo', photo);

    setLoading(true); // Set loading state to true while submitting

    try {
      const res = await fetch('/api/become-candidate', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await res.json();
      if (result.success) {
        alert('You are now a candidate!');
        router.push('/');
      } else {
        alert(result.error || 'You are already a candidate for this club!');
      }
    } catch (error) {
      console.error(error);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false); // Set loading state to false after submission
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 fw-bold text-center">Become a Candidate</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-semibold">Name</label>
          <input type="text" value={user.name} readOnly className="form-control bg-light" />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Surname</label>
          <input type="text" value={user.surname} readOnly className="form-control bg-light" />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Select Club</label>
          <select
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Choose Club --</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Your Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="form-control"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="form-control"
            required
          />
        </div>

        {alreadyCandidate && (
          <div className="alert alert-warning" role="alert">
            You are already a candidate for this club.
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
          disabled={loading || alreadyCandidate} // Disable button if already a candidate
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        
        {/* Static message below submit button */}
        <p className="mt-3 text-muted text-center" style={{ fontWeight: 'bold' }}>
          * * * * * * * * Only one candidate allowed at a time. It means you can become a candidate just for 1 club only in current elections year.
        </p>
      </form>
    </div>
  );
}
