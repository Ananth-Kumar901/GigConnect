// src/pages/Gigs.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchGigs } from '../services/gig';
import { AuthContext } from '../context/AuthContext';

const Gigs = () => {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGigs = async () => {
      try {
        const data = await fetchGigs();
        setGigs(data);
      } catch (err) {
        console.error('Error fetching gigs:', err);
        setError('Failed to load gigs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadGigs();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div><p>Loading gigs...</p></div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Gigs</h2>
      {gigs.length === 0 ? (
        <div className="alert alert-info">No gigs available at the moment.</div>
      ) : (
        gigs.map(gig => (
          <div key={gig._id} className="card p-3 mb-3 shadow-sm">
            <h5>{gig.title}</h5>
            <p>{gig.description}</p>
            <p><strong>Budget:</strong> ${gig.budget}</p>
            <p><strong>Location:</strong> {gig.location}</p>
            <p><strong>Skills:</strong> {gig.skills.join(', ')}</p>
            <p><strong>Posted by:</strong> {gig.client?.name || 'Client'}</p>
            <Link to={`/gigs/${gig._id}`} className="btn btn-primary btn-sm mt-2">View Details</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Gigs;
