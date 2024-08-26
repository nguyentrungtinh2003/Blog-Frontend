import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ThemeContext } from "../ThemeContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { setUser, setUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password }
      );
      const { username: loggedInUser, user_id: loggedInUserId } = response.data;
      setMessage(`User: ${loggedInUser} logged in successfully!`);
      setError(false);
      setUser(loggedInUser);
      setUserId(loggedInUserId);
      if (username === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      setMessage("Invalid credentials");
      setError(true);
    }
  };

  const context = useContext(ThemeContext);

  return (
    <div className={context.theme}>
      <Container style={{ minWidth: "500px" }}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center">Đăng nhập</h2>
            {message && (
              <Alert variant={error ? "danger" : "success"}>{message}</Alert>
            )}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Đăng nhập
              </Button>
              <div className="mt-3">
                <Link to="/register">
                  <Button variant="secondary">Đăng ký</Button>
                </Link>
              </div>
              {/* <a href="/forgotPassword">
            <Button variant="primary" className="mt-3">
              Forgot Password
            </Button>
            </a> */}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
