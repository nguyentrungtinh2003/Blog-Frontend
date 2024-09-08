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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Blog Application
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            <i className="fas fa-home"></i>
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
                  className="text-white text-decoration-none ms-2" // Thêm khoảng cách giữa ảnh và tên người dùng
                >
                  <span>{`${user} ID: ${userId}`}</span>
                </Nav.Link>
              </div>

              <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">
              <i className="fa fa-user me-2"></i>
              Đăng nhập
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
