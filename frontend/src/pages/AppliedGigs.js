import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../services/application';

const AppliedGigs = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyApplications();
        setApps(data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch your applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading your applications...</p>;
  if (!apps.length) return <p className="text-center mt-4">You have not applied to any gigs yet.</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Applications</h3>
      <div className="list-group">
        {apps.map(a => (
          <div key={a._id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <h5>{a.gig?.title || 'Untitled Gig'}</h5>
              <small className="text-muted">{new Date(a.createdAt).toLocaleString()}</small>
            </div>
            <p className="mb-1">{a.coverLetter}</p>
            <p className="mb-1"><strong>Bid:</strong> ${a.bidAmount}</p>
            <p><strong>Status:</strong> <span className="text-capitalize">{a.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedGigs;
