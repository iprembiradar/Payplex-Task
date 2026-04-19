import axios from "axios";

const API = "http://localhost:5000/api";

export const registerUser = async (data) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await axios.post(`${API}/verify-otp`, data);
  return res.data;
};