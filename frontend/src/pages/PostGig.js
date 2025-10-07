import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createGig } from '../services/gig';
import AlertMessage from '../components/AlertMessage';
import { useNavigate } from 'react-router-dom';

const PostGig = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    skills: ''
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  if (!user) return <p className="text-center mt-4">Please login to post a gig.</p>;
  if (user.role !== 'client') return <p className="text-center mt-4">Only clients can post gigs.</p>;

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()),
        budget: Number(form.budget)
      };
      await createGig(payload);
      setMsg('Gig posted successfully!');
      setForm({ title:'', description:'', location:'', budget:'', skills:'' });
      setTimeout(() => navigate('/gigs'), 700);
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to post gig');
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="card p-4" style={{ width: 700 }}>
        <h4 className="mb-3">Post a New Gig</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="form-control" rows={4} />
          </div>

          <div className="mb-3 row">
            <div className="col">
              <label className="form-label">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="form-control" />
            </div>
            <div className="col">
              <label className="form-label">Budget ($)</label>
              <input name="budget" value={form.budget} onChange={handleChange} type="number" className="form-control" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="form-control" placeholder="e.g., React, Node.js" />
          </div>

          <button className="btn btn-primary w-100" type="submit">Post Gig</button>
        </form>

        { (msg || err) && <AlertMessage type={msg ? 'success' : 'danger'} message={msg || err} /> }
      </div>
    </div>
  );
};

export default PostGig;
