import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/user';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    portfolio: '',
    serviceRate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getProfile()
        .then(res => {
          setProfile(res);
          setFormData({
            name: res.name,
            email: res.email,
            skills: res.skills?.join(', ') || '',
            portfolio: res.portfolio?.join(', ') || '',
            serviceRate: res.serviceRate || 0
          });
        })
        .catch(err => console.error(err));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        portfolio: formData.portfolio.split(',').map(p => p.trim()),
        serviceRate: Number(formData.serviceRate)
      };
      const res = await updateProfile(updated);
      setProfile(res);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (!profile) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h3 className="text-center text-primary mb-4">My Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          {profile.role === 'freelancer' && (
            <>
              <div className="mb-3">
                <label className="form-label">Skills (comma separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Portfolio Links (comma separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="portfolio" 
                  value={formData.portfolio} 
                  onChange={handleChange} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Service Rate ($)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="serviceRate" 
                  value={formData.serviceRate} 
                  onChange={handleChange} 
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100">Update Profile</button>
          <button type="button" className="btn btn-danger w-100 mt-2" onClick={logout}>Logout</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
