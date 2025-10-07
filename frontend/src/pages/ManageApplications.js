// src/pages/ManageApplications.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsForGig, updateApplicationStatus } from '../services/application';

const ManageApplications = () => {
  const { gigId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchApplications = async () => {
    try {
      if (!gigId) throw new Error('Gig ID is required');
      const data = await getApplicationsForGig(gigId);
      setApplications(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, status } : app));
      setMessage(`Application ${status === 'accepted' ? 'accepted ✅' : 'rejected ❌'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update application status');
    }
  };

  useEffect(() => { fetchApplications(); }, [gigId]);

  if (loading) return <p className="text-center mt-5">Loading applications...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Applications</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {applications.length === 0 ? (
        <div className="alert alert-info">No applications yet for this gig.</div>
      ) : (
        applications.map(app => (
          <div key={app._id} className="card p-3 mb-3 shadow-sm">
            <h5>{app.freelancer?.name || 'Unnamed Freelancer'}</h5>
            <p><strong>Email:</strong> {app.freelancer?.email || 'N/A'}</p>
            <p><strong>Bid:</strong> ${app.bidAmount}</p>
            <p><strong>Status:</strong> <span className={
              app.status === 'accepted' ? 'text-success' : app.status === 'rejected' ? 'text-danger' : 'text-warning'
            }>{app.status}</span></p>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(app._id, 'accepted')} disabled={app.status==='accepted'}>Accept</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(app._id, 'rejected')} disabled={app.status==='rejected'}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageApplications;
