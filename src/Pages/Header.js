import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = () => {
  const { user, userId, userImg, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear user context
    // Redirect to home page after clearing user context
    navigate("/", { replace: true });
  };

  const context = useContext(ThemeContext);

  return (
    <Navbar bg="light" variant="light" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/" style={{ color: "blue" }}>
        Blog Application
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            <i
              className="fas fa-home"
              style={{ color: "blue", fontSize: "20px" }}
            ></i>
          </Nav.Link>
        </Nav>
        <button onClick={context.toggleTheme} className="btn btn-primary m-2">
          {context.theme === "light" ? <FaSun /> : <FaMoon />}
        </button>
        <Nav>
          {user ? (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={`http://localhost:8080/uploads/${userImg}`}
                  alt="User Avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }} // Điều chỉnh kích thước và bo tròn hình ảnh
                />
                <Nav.Link
                  href="/user"
                  className="text-dark ms-2" // Thay đổi màu chữ thành đen
                >
                  <span>{`${user} ID: ${userId}`}</span>
                </Nav.Link>
              </div>

              <Nav.Link onClick={handleLogout} className="text-dark">
                <i
                  class="fas fa-sign-out-alt"
                  style={{ color: "blue", fontSize: "20px" }}
                ></i>
              </Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login" className="text-dark">
              <i
                className="fa fa-user me-2"
                style={{ color: "blue", fontSize: "20px" }}
              ></i>
              <i
                class="fas fa-sign-in-alt"
                style={{ color: "blue", fontSize: "20px" }}
              ></i>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
