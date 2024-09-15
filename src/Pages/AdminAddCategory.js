import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";

const AdminAddCategory = () => {
  const [message, setMessage] = useState("");

  const [category, setCategory] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleAddCategory = async () => {
    try {
      // Gọi API POST để thêm danh mục mới
      const response = await axios.post(
        "http://localhost:8080/api/categories/create",
        category
      );
      console.log("Add category success!", response.data);

      // Reset form sau khi thêm thành công
      setCategory({ name: "" });

      // Hiển thị thông báo thành công
      setMessage(`Thêm danh mục "${category.name}" thành công!`);
    } catch (error) {
      // Bắt lỗi và hiển thị thông báo lỗi từ server
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage("Có lỗi xảy ra khi thêm danh mục!");
      }
      console.error("Error adding category!", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Thêm danh mục</h2>
      <Form>
        <Form.Group controlId="categoryName">
          <Form.Label>Tên danh mục:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên danh mục..."
            name="name"
            value={category.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* Hiển thị thông báo dựa trên trạng thái */}
        {message && (
          <Alert
            variant={message.includes("thành công") ? "success" : "danger"}
            className="mt-3"
          >
            {message}
          </Alert>
        )}
        <Button variant="primary" onClick={handleAddCategory} className="mt-3">
          Tạo
        </Button>
      </Form>
    </Container>
  );
};

export default AdminAddCategory;
