import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../services/user";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getProfile().then(setProfile).catch(err => console.error(err));
    }
  }, [user, navigate]);

  if (!profile) return <p className="text-center mt-5">Loading profile...</p>;

  // Avatar initials
  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  // Role badge color
  const roleBadgeClass =
    profile.role === "client" ? "badge bg-primary" : "badge bg-success";

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-gradient text-white text-center rounded-top-4"
                 style={{ background: "linear-gradient(90deg, #007bff, #00c6ff)" }}>
              <h4 className="mb-0 fw-bold">Profile Overview</h4>
            </div>

            <div className="card-body text-center p-4">
              {/* Avatar */}
              <div
                className="rounded-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center shadow"
                style={{ width: "90px", height: "90px", fontSize: "30px", fontWeight: "bold" }}
              >
                {initials}
              </div>

              {/* Name */}
              <h3 className="fw-bold text-dark">{profile.name}</h3>
              <span className={roleBadgeClass}>{profile.role}</span>

              <hr className="my-4" />

              {/* Profile Info */}
              <div className="text-start px-4">
                <p className="mb-2">
                  <strong>Email:</strong> {profile.email}
                </p>
                <p className="mb-0">
                  <strong>Member Since:</strong>{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Logout button */}
              <button
                className="btn btn-danger w-100 mt-4 fw-semibold"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
