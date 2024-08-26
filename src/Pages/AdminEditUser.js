import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { ThemeContext } from "./ThemeContext";

const AdminEditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    img: null,
  });

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
  const context = useContext(ThemeContext);
  return (
    <div className={context.theme}>
      <Container>
        <h2>Chỉnh sửa người dùng</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formImg">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control type="file" name="img" onChange={handleFileChange} />
            {/* {typeof post.img === "string" && (
                      <div className="mt-2">
                        <img
                          src={`http://localhost:8080/uploads/${post.img}`}
                          alt="Post"
                          style={{ width: "100px" }}
                        />
                      </div>
                    )} */}
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Lưu
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AdminEditUser;
