import { useState } from "react";
import { verifyOtp } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email missing. Please register again.");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp });

      console.log("VERIFY RESPONSE:", res);

      if (res.success) {
       toast.success("Account Verified Successfully");
        navigate("/login");   
      } else {
        alert(res.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Verify OTP</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default OTPVerification;