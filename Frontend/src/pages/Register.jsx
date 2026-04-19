import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp } from "../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(form);
      console.log("REGISTER RESPONSE:", res);

      if (res.success) {
        alert("OTP Sent Successfully");
        setShowOtpField(true);
      } else {
        alert(res.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyOtp({
        email: form.email,
        otp: otp.trim()
      });

      console.log("VERIFY RESPONSE:", res);

      if (res.success) {
        toast.success("Account Verified Successfully ✅");
        navigate("/login");
      } else {
        alert(res.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      {!showOtpField ? (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Verify OTP</h2>
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;