import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../services/application';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading your applications...</p>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <div className="alert alert-info">You have not applied to any gigs yet.</div>
      ) : (
        applications.map(app => (
          <div key={app._id} className="card p-3 mb-3 shadow-sm">
            <h5>{app.gig?.title || 'Untitled Gig'}</h5>
            <p><strong>Bid Amount:</strong> ${app.bidAmount}</p>
            <p>
              <strong>Skills:</strong> {app.gig?.skills ? app.gig.skills.slice(0, 3).join(', ') : 'N/A'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={
                app.status === 'accepted' ? 'text-success' :
                app.status === 'rejected' ? 'text-danger' : 'text-warning'
              }>
                {app.status || 'pending'}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
