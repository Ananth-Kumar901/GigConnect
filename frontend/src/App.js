import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import PostGig from "./pages/PostGig";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import AppliedGigs from "./pages/AppliedGigs";
import ManageApplications from "./pages/ManageApplications";
import MyApplications from "./pages/MyApplications";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">GigConnect</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}

              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/gigs">Browse Gigs</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/post-gig">Post a Gig</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-applications">My Applications</Link>
                  </li>
                  <li className="nav-item">
                    <span className="text-white ms-3">
                      👋 Hi, <strong>{user?.name}</strong>
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-light btn-sm ms-3" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/:id" element={<GigDetail />} />

          <Route
            path="/post-gig"
            element={
              <ProtectedRoute>
                <PostGig />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gig/:gigId/applications"
            element={
              <ProtectedRoute>
                <ManageApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="text-center mt-5">
                <h2 className="fw-bold text-primary">Welcome to GigConnect 🚀</h2>
                <p className="text-muted">Your one-stop platform for freelancing opportunities.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
