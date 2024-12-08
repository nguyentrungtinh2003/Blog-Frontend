import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import URL from "../URL";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage("Có lỗi xảy ra!");
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
        <Form onSubmit={handleSubmit}>
          {/* Nhập Email */}
          <Form.Group controlId="formEmail">
            <Form.Label>Email của bạn</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </Form.Group>

          {/* Nhập OTP */}
          <Form.Group controlId="formOtp" className="mt-3">
            <Form.Label>Mã OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              required
            />
          </Form.Group>

          {/* Nhập mật khẩu mới */}
          <Form.Group controlId="formNewPassword" className="mt-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </Form.Group>

          {/* Nút Đặt lại mật khẩu */}
          <Button variant="primary" type="submit" className="mt-4">
            Đặt lại mật khẩu
          </Button>
        </Form>

        {/* Hiển thị thông báo nếu có */}
        {message && (
          <Alert variant="success" className="mt-3 text-center">
            {message}
          </Alert>
        )}
      </Col>
    </Row>
  );
};

export default ResetPassword;
