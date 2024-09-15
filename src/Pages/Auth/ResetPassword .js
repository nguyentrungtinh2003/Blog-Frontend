import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage("Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          required
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
