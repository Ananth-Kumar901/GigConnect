import axios from "axios";
import { setAuthToken } from "./auth";

const API = "http://localhost:5000/api/users";

// Fetch logged-in user profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  setAuthToken(token);
  const res = await axios.get(`${API}/me`);
  return res.data;
};

// Update logged-in user profile
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  setAuthToken(token);
  const res = await axios.patch(`${API}/me`, data);
  return res.data;
};
