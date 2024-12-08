import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data);
      // Chuyển hướng sang trang reset-password nếu OTP được gửi thành công
      navigate("/reset-password", { state: { email } }); // Chuyển email qua state
    } catch (error) {
      setMessage("Có lỗi xảy ra!");
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2 className="text-center mb-4">Quên mật khẩu</h2>
        <Form onSubmit={handleSubmit}>
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

          <Button variant="primary" type="submit" className=" mt-3">
            OTP
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

export default ForgotPassword;
