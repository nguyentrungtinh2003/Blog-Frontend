import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

const UserEditPost = () => {
  const { id } = useParams(); // Lấy id từ tham số URL

  const [category, setCategory] = useState(0);
  const [categories, setCategories] = useState([]);

  const [post, setPost] = useState({
    name: "",
    content: "",
    img: "",
    postedBy: { id: 0 },
    tags: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.log("Error get post by id");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setPost({ ...post, [name]: value.split(",") });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handlePostedByChange = (e) => {
    const { value } = e.target;
    setPost({ ...post, postedBy: { ...post.postedBy, id: value } });
  };

  const handleFileChange = (e) => {
    setPost({ ...post, img: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", post.name);
    formData.append("content", post.content);
    formData.append("postedBy", post.postedBy.id);
    formData.append("tags", post.tags);
    if (post.img) {
      formData.append("img", post.img);
    }
    formData.append("category", category);

    axios
      .put(`http://localhost:8080/api/posts/${id}`, formData)
      .then((response) => {
        console.log("Post updated successfully");
        console.log("Form date : " + formData);
      })
      .catch((error) => {
        console.log("Error updating post", error.response.data);
      });

    window.location.reload();
  };

  //Goi API category cho vao Option de tao moi bai viet
  useEffect(() => {
    try {
      axios
        .get(`http://localhost:8080/api/categories`)
        .then((response) => [setCategories(response.data)]);
    } catch (error) {
      console.error("Error get all categories !", error);
    }
  }, []);

  const context = useContext(ThemeContext);

  return (
    <div className={context.theme}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header>
                <h3>Chỉnh sửa bài viết</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={post.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tiêu đề"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formContent">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="content"
                      value={post.content}
                      onChange={handleInputChange}
                      placeholder="Nhập nội dung"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formImg">
                    <Form.Label>Hình ảnh</Form.Label>
                    <Form.Control
                      type="file"
                      name="img"
                      onChange={handleFileChange}
                    />
                    {typeof post.img === "string" && (
                      <div className="mt-2">
                        <img
                          src={`http://localhost:8080/uploads/${post.img}`}
                          alt="Post"
                          style={{ width: "100px" }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formPostedBy">
                    <Form.Label>Người đăng</Form.Label>
                    <Form.Control
                      type="number"
                      name="postedBy"
                      value={post.postedBy.id}
                      onChange={handlePostedByChange}
                      placeholder="Nhập ID người đăng"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formTags">
                    <Form.Label>Thẻ</Form.Label>
                    <Form.Control
                      type="text"
                      name="tags"
                      value={post.tags.join(",")}
                      onChange={handleInputChange}
                      placeholder="Nhập tags, cách nhau bởi dấu phẩy"
                    />
                  </Form.Group>
                  <Form.Group controlId="formPostCategory">
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Control
                      as="select" // Thay đổi từ type="text" thành as="select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)} // Giá trị sẽ là ID của danh mục
                      required
                    >
                      <option value="">Chọn một danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {/* Hiển thị tên danh mục */}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    Lưu
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

export default UserEditPost;
