import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const AdminEditCategory = () => {
  const { id } = useParams();

  const [category, setCategory] = useState({
    name: "",
  });

  useEffect(() => {
    // Lấy danh mục theo ID khi component được mount
    axios
      .get(`http://localhost:8080/api/categories/${id}`)
      .then((response) => {
        console.log("Get category by ID success!");
        setCategory(response.data); // Cập nhật trạng thái với dữ liệu danh mục
      })
      .catch((error) => {
        console.error("Error getting category by ID", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleEditCategory = () => {
    axios
      .put(`http://localhost:8080/api/categories/${id}`, category) // Thay POST bằng PUT cho cập nhật
      .then((response) => {
        console.log("Category updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating category!", error);
      });
  };

  return (
    <Container className="mt-4">
      <h2>Chỉnh sửa danh mục</h2>
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
        <Button variant="primary" onClick={handleEditCategory} className="mt-3">
          Lưu thay đổi
        </Button>
      </Form>
    </Container>
  );
};

export default AdminEditCategory;
