// src/services/gig.js
import axios from "axios";
import { setAuthToken } from "./auth";

const API_BASE = "http://localhost:5000/api/gigs";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  setAuthToken(token);
};

// ✅ Fetch all gigs
export const fetchGigs = async () => {
  getAuthToken();
  try {
    const res = await axios.get(API_BASE);
    return res.data;
  } catch (err) {
    console.error("fetchGigs error:", err);
    throw err;
  }
};

// ✅ Fetch single gig by ID
export const fetchGig = async (id) => {
  getAuthToken();
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  } catch (err) {
    console.error("fetchGig error:", err);
    throw err;
  }
};

// ✅ Create new gig (client)
export const createGig = async (gigData) => {
  getAuthToken();
  try {
    const res = await axios.post(API_BASE, gigData);
    return res.data;
  } catch (err) {
    console.error("createGig error:", err);
    throw err;
  }
};

// ✅ Update gig
export const updateGig = async (id, gigData) => {
  getAuthToken();
  try {
    const res = await axios.patch(`${API_BASE}/${id}`, gigData);
    return res.data;
  } catch (err) {
    console.error("updateGig error:", err);
    throw err;
  }
};

// ✅ Delete gig
export const deleteGig = async (id) => {
  getAuthToken();
  try {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  } catch (err) {
    console.error("deleteGig error:", err);
    throw err;
  }
};
