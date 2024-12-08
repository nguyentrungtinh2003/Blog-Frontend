import React, { useContext, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import URL from "../URL";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [img, setImg] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    if (img) {
      formData.append("img", img);
    }

    try {
      const response = await axios.post(
        `${URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { withCredentials: true }
      );
      setMessage(response.data.message || "Registration successful");
      setError(false);
    } catch (error) {
      // In ra thông tin chi tiết về lỗi
      console.error("Error response:", error.response);
      setMessage(error.response?.data?.message || "Registration failed");
      setError(true);
    }
  };
  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const context = useContext(ThemeContext);
  return (
    <div className={context.theme}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center">Đăng ký</h2>
            {message && (
              <Alert variant={error ? "danger" : "success"}>{message}</Alert>
            )}
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="profile-form-group" controlId="formImg">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                />
                {img && (
                  <div className="mt-2">
                    <img
                      src={`http://localhost:8080/uploads/${img}`}
                      alt="Hình ảnh hồ sơ"
                      className="profile-form-img"
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button onClick={togglePassword} className="m-3 ">
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </Button>

              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button onClick={togglePassword} className="m-3 ">
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </Button>

              <Button variant="primary" type="submit" className="m-3">
                Đăng ký
              </Button>
              <div className="mt-3">
                <Link to="/login">
                  <Button variant="secondary">Đăng nhập</Button>
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
