import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

const PostDetail = () => {
  const { id } = useParams(); // Lấy id từ tham số URL
  const { user, userId, setUser } = useContext(UserContext);

  const [postDetail, setPostDetail] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State để quản lý nội dung bình luận mới
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading
  const [showAllComments, setShowAllComments] = useState(false); // State để quản lý hiển thị tất cả bình luận

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/${id}`)
      .then((response) => {
        setPostDetail(response.data);
      })
      .catch((error) => {
        console.log("Error get post by id");
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/comments/post/${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log("Error get comments by id");
      });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/comments", {
        content: newComment,
        post: { id: postDetail.id },
        postedBy: { id: userId },
      });
      setComments([...comments, response.data]);
      setNewComment(""); // Reset nội dung bình luận
    } catch (error) {
      console.error(
        "Error creating comment:",
        error.response ? error.response.data : error.message
      );
    }

    setLoading(false);
  };

  if (!postDetail.id) {
    return <div>Đang tải dữ liệu ...</div>;
  }

  const getTimeElapsed = (postDate) => {
    const currentDate = new Date();
    const postDateTime = new Date(postDate);

    const elapsedMilliseconds = currentDate - postDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 365) {
      return `${Math.floor(elapsedDays / 365)} năm trước`;
    } else if (elapsedDays > 30) {
      return `${Math.floor(elapsedDays / 30)} tháng trước`;
    } else if (elapsedDays > 0) {
      return `${elapsedDays} ngày trước`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} giờ trước`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} phút trước`;
    } else if (elapsedSeconds > 0) {
      return `${elapsedSeconds} giây trước`;
    } else {
      return "vừa xong";
    }
  };

  // Lấy danh sách bình luận hiển thị
  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} className="mb-4">
          <Card className="shadow-lg">
            <Card.Header className="d-flex align-items-center bg-white">
              <Image
                src={`http://localhost:8080/uploads/${postDetail.postedBy.img}`}
                roundedCircle
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <div>
                <Card.Title className="mb-0">{postDetail.name}</Card.Title>

                <Card.Subtitle className="text-muted mt-2">
                  Được đăng bởi <strong>{postDetail.postedBy?.username}</strong>{" "}
                  vào <strong>{getTimeElapsed(postDetail.date)}</strong>
                </Card.Subtitle>
              </div>
            </Card.Header>
            <Card.Body>
              {postDetail.img && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:8080/uploads/${postDetail.img}`}
                />
              )}
              <p dangerouslySetInnerHTML={{ __html: postDetail.content }}></p>
              <a className="btn btn-link" href="/user">
                <button className="btn btn-primary mt-2">
                  {" "}
                  <i className="fas fa-arrow-left"></i>
                </button>
              </a>
            </Card.Body>
            <Card.Footer className="bg-light border-top">
              <div className="p-3">
                <h5 className="mb-3">
                  <i
                    className="fas fa-comments"
                    style={{ color: "blue", fontSize: "24px" }}
                  ></i>{" "}
                  Bình luận
                </h5>
                {displayedComments.length > 0 ? (
                  displayedComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="mb-3 p-3 border rounded bg-white shadow-sm"
                    >
                      <div className="d-flex align-items-center">
                        <Image
                          src={`http://localhost:8080/uploads/${comment.postedBy.img}`}
                          roundedCircle
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                          }}
                        />
                        <strong className="m-2">
                          {comment.postedBy.username}
                        </strong>
                        <span className="text-muted small">
                          <strong>{getTimeElapsed(comment.createdAt)}</strong>
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Chưa có bình luận nào .</p>
                )}

                {/* Nút "Xem thêm" hoặc "Ẩn bớt" */}
                {comments.length > 2 && (
                  <Button
                    variant="link"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "Ẩn bớt" : "Xem thêm"}
                  </Button>
                )}

                {/* Form thêm bình luận */}
                <Form onSubmit={handleCommentSubmit} className="mt-3">
                  <Form.Group controlId="newComment">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Viết bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      className="shadow-sm"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-2"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : <i className="fas fa-check"></i>}
                  </Button>
                </Form>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
