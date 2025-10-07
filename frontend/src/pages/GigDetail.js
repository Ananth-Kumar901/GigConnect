// src/pages/GigDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGig, updateGig, deleteGig } from '../services/gig';
import { applyToGig } from '../services/application';
import { AuthContext } from '../context/AuthContext';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [gig, setGig] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', budget: '', skills: '' });

  useEffect(() => {
    const getGig = async () => {
      try {
        const data = await fetchGig(id);
        setGig(data);
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          budget: data.budget,
          skills: data.skills.join(', ')
        });
      } catch (err) {
        console.error(err);
        alert('Failed to fetch gig');
      }
    };
    getGig();
  }, [id]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()), budget: Number(form.budget) };
      const updated = await updateGig(id, payload);
      setGig(updated);
      setEditing(false);
      alert('Gig updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;
    try {
      await deleteGig(id);
      alert('Gig deleted!');
      navigate('/gigs');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleApply = async () => {
    if (!user) return alert('Please login to apply.');
    if (user.role !== 'freelancer') return alert('Only freelancers can apply.');

    const coverLetter = window.prompt('Write a short cover letter (optional):', '');
    if (coverLetter === null) return;

    const bidStr = window.prompt('Enter your bid amount (USD):', '0');
    if (bidStr === null) return;

    const bidAmount = Number(bidStr);
    if (isNaN(bidAmount) || bidAmount <= 0) return alert('Invalid bid amount');

    try {
      await applyToGig(id, { coverLetter, bidAmount });
      alert('Applied successfully!');
      navigate('/my-applications');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Apply failed');
    }
  };

  if (!gig) return <p className="text-center mt-5">Loading gig...</p>;

  const isOwner = gig.client && user && String(user.id || user._id) === String(gig.client._id || gig.client.id);

  return (
    <div className="container mt-5">
      {!editing ? (
        <div className="card p-4 shadow">
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p><strong>Budget:</strong> ${gig.budget}</p>
          <p><strong>Location:</strong> {gig.location}</p>
          <p><strong>Skills:</strong> {gig.skills.join(', ')}</p>
          <p><strong>Posted by:</strong> {gig.client.name} ({gig.client.role})</p>

          {user && user.role === 'freelancer' && !isOwner && (
            <button className="btn btn-success me-2 mt-2" onClick={handleApply}>Apply to this Gig</button>
          )}

          {isOwner && (
            <div className="mt-3">
              <button className="btn btn-outline-secondary me-2" onClick={() => navigate(`/gig/${id}/applications`)}>Manage Applications</button>
              <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      ) : (
        <form className="card p-4 shadow" onSubmit={handleUpdate}>
          <h4>Edit Gig</h4>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Budget</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default GigDetail;
