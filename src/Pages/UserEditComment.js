import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import URL from "./URL";
const UserEditComment = () => {
  const { id } = useParams(); // Get the id from the URL parameters
  const navigate = useNavigate(); // For navigation after form submission
  const { theme } = useContext(ThemeContext); // Access the theme context

  const [comment, setComment] = useState({
    content: "",
  });

  useEffect(() => {
    axios
      .get(`${URL}/api/comments/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setComment(response.data);
      })
      .catch((error) => {
        console.log("Error getting comment by id", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${URL}/api/comments/${id}`, comment, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Comment updated successfully");
        navigate(-1); // Navigate to the comment view or list page
      })
      .catch((error) => {
        console.log("Error updating comment", error.response?.data);
      });
  };

  return (
    <div className={theme}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header>
                <h3>Chỉnh sửa bình luận</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formContent">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      type="text"
                      name="content"
                      value={comment.content}
                      onChange={handleInputChange}
                      placeholder="Nhập nội dung ..."
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    <li className="fas fa-check"></li>
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserEditComment;
