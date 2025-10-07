import React, { useState, useContext } from "react";
import { applyToGig } from "../services/application";
import { AuthContext } from "../context/AuthContext";

const ApplyButton = ({ gigId }) => {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login as a freelancer to apply.");
      return;
    }
    if (user.role !== "freelancer") {
      alert("Only freelancers can apply for gigs.");
      return;
    }

    try {
      setLoading(true);
      await applyToGig(gigId, { bidAmount, coverLetter });
      alert("Application submitted successfully!");
      setShowForm(false);
      setBidAmount("");
      setCoverLetter("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "freelancer") return null;

  return (
    <div>
      {!showForm ? (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(true)}
        >
          Apply
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Enter cover letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ApplyButton;
