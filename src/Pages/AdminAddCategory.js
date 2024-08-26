import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

const AdminAddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleAddCategory = () => {
    axios
      .post(`http://localhost:8080/api/categories`, category)
      .then((response) => {
        console.log("Add category success!");
        setCategory({ name: "" }); // Reset form sau khi thêm thành công
      })
      .catch((error) => {
        console.error("Error adding category!", error);
      });
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
        <Button variant="primary" onClick={handleAddCategory} className="mt-3">
          Tạo
        </Button>
      </Form>
    </Container>
  );
};

export default AdminAddCategory;
