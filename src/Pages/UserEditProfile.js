import React from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { ThemeContext } from "./ThemeContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const UserEditProfile = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    img: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/auth/users/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.log("Error get user by id !");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, img: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.img) {
      data.append("img", formData.img);
    }

    axios
      .put(`http://localhost:8080/api/auth/users/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("User updated successfully");
        // Có thể cập nhật state hoặc chuyển hướng mà không cần reload trang
      })
      .catch((error) => {
        console.error("Error updating user!", error);
      });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const context = useContext(ThemeContext);
  return (
    <div className={context.theme}>
      <Container className="profile-form-container">
        <h2 className="text-center mb-4">Chỉnh sửa hồ sơ</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="profile-form-group" controlId="username">
            <Form.Label className="profile-form-label">
              Tên đăng nhập
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
            />
          </Form.Group>

          <Form.Group className="profile-form-group" controlId="email">
            <Form.Label className="profile-form-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
            />
          </Form.Group>

          <Form.Group className="profile-form-group" controlId="password">
            <Form.Label className="profile-form-label">Mật khẩu</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
            />
            <Button onClick={togglePassword} className="m-3 ">
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </Button>
          </Form.Group>

          <Form.Group className="profile-form-group" controlId="formImg">
            <Form.Label className="profile-form-label">Hình ảnh</Form.Label>
            <Form.Control type="file" name="img" onChange={handleFileChange} />
            {formData.img && (
              <div className="mt-2">
                <img
                  src={`http://localhost:8080/uploads/${formData.img}`}
                  alt="Hình ảnh hồ sơ"
                  className="profile-form-img"
                />
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3 w-100">
            Lưu
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default UserEditProfile;