import React, { useState, useEffect, useContext } from "react";
import { Alert, Carousel } from "react-bootstrap";
import { ThemeContext } from "./ThemeContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Dropdown, Badge } from "react-bootstrap";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Modal,
  Form,
  Nav,
} from "react-bootstrap";
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaSearch,
  FaStreetView,
  FaChevronCircleDown,
  FaEye,
} from "react-icons/fa";
import { UserContext } from "./UserContext";
import { FaUsersViewfinder } from "react-icons/fa6";

const UserPage = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalPostId, setModalPostId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState(null);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState(0);
  const [findCategory, setFindCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState([]);
  const [users, setuser] = useState({});
  // const [postedBy, setPostedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    id: "",
    user_id: "", // New state for user_id
  });

  const { user, userId, setUser } = useContext(UserContext);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (searchTerm == "") {
      axios
        .get("http://localhost:8080/api/posts")
        .then((response) => {
          setPosts(response.data);
          const initialComments = {};
          response.data.forEach((post) => {
            axios
              .get(`http://localhost:8080/api/comments/${post.id}`)
              .then((commentResponse) => {
                initialComments[post.id] = commentResponse.data;
                setComments(initialComments);
              })
              .catch((error) => {
                console.error(
                  `Error fetching comments for post ${post.id}`,
                  error
                );
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  }, [searchTerm]);

  const fetchUserDetails = () => {
    axios
      .get(`http://localhost:8080/api/auth/users/${loggedInUserId}`)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleProfileUpdate = () => {
    const { id, username, email, password } = userDetails;
    const updatedUser = {
      username,
      email,
      password,
    };
    axios
      .put(`http://localhost:8080/api/auth/users/${id}`, updatedUser)
      .then((response) => {
        setUserDetails(response.data);
        setShowProfileModal(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleLike = (postId) => {
    axios
      .put(`http://localhost:8080/api/posts/${postId}/like`)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          )
        );
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
      })
      .catch((error) => {
        console.error("Error liking the post:", error);
      });
  };

  const handleUnlike = (postId) => {
    axios
      .put(`http://localhost:8080/api/posts/${postId}/Unlike`)
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount - 1 }
              : post
          )
        );
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((id) => id !== postId)
        );
      })
      .catch((error) => {
        console.error("Error unliking the post:", error);
      });
  };

  const updateComments = (postId, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...prevComments[postId], newComment],
    }));
  };

  const handleShowModal = (postId) => {
    setModalPostId(postId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalPostId(null);
  };

  const handleAddPost = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("img", img); // appending file here
    formData.append(
      "tags",
      tags
        .split(",")
        .map((tag) => tag.trim())
        .join(",")
    ); // convert array to comma-separated string
    formData.append("postedBy", userId);
    formData.append("category", category);

    axios
      .post("http://localhost:8080/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setPosts([...posts, response.data]);
        setName("");
        setContent("");
        setImg(null);
        setTags("");

        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });

    window.location.reload();
  };

  const handleCommentSubmit = (event, postId) => {
    event.preventDefault();
    const commentData = {
      content: commentContent,
      post: { id: postId },
    };

    axios
      .post("http://localhost:8080/api/comments/create", commentData)
      .then((response) => {
        updateComments(postId, response.data);
        setCommentContent("");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/posts/search/${searchTerm}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    }
  };

  // Hiển thị thời gian đăng bài viết
  const getTimeElapsed = (postDate) => {
    const currentDate = new Date();
    const postDateTime = new Date(postDate);

    const elapsedMilliseconds = currentDate - postDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    // Check if post date is in the current or previous year
    const postYear = postDateTime.getFullYear();
    const currentYear = currentDate.getFullYear();

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
  //
  //API Notification
  useEffect(() => {
    // Lấy thông báo từ API
    axios
      .get(`http://localhost:8080/api/notifications/${userId}`)
      .then((response) => {
        setNotification(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notifications!", error);
      });
  }, [userId]);

  const markAsRead = (id) => {
    axios
      .post(`http://localhost:8080/api/notifications/${id}/mark-read`)
      .then(() => {
        // Cập nhật trạng thái thông báo sau khi đánh dấu là đã đọc
        setNotification(
          notification.map((noti) =>
            noti.id === id ? { ...noti, read: true } : noti
          )
        );
      })
      .catch((error) => {
        console.error("Có lỗi khi đánh dấu thông báo là đã đọc:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/categories`)
      .then((response) => {
        setFindCategory(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Get category navbar error ! ");
      });
  }, []);

  const onCategorySelect = (id) => {
    axios
      .get(`http://localhost:8080/api/categories/${id}`)
      .then((response) => {
        setPosts(response.data.posts);
        setActiveCategory(id);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Get category navbar error ! ");
      });
  };

  const context = useContext(ThemeContext);

  return (
    <div className={`${context.theme}`}>
      <div className="row">
        <div className="col-2">
          <div className="bg-light border-right" style={{ minHeight: "100vh" }}>
            <ul class="list-group">
              {findCategory.map((cate) => (
                <li
                  class={`list-group-item ${
                    activeCategory == cate.id ? "active" : ""
                  }`}
                  aria-current="true"
                  onClick={() => onCategorySelect(cate.id)}
                >
                  {cate.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-10">
          <Container>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button
                  className="mb-2"
                  variant="primary"
                  onClick={() => setShowModal(true)}
                >
                  Thêm bài đăng
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  className="mb-2"
                  variant="secondary"
                  onClick={() => {
                    fetchUserDetails();
                    setShowProfileModal(true);
                  }}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </Col>
              <Col xs="auto">
                <a href={`/myPosts/${userId}`}>
                  <Button className="mb-2" variant="info">
                    Bài viết của tôi
                  </Button>
                </a>
              </Col>
              <Col xs="auto">
                <a href={`/myComments/${userId}`}>
                  <Button className="mb-2" variant="info">
                    Bình luận của tôi
                  </Button>
                </a>
              </Col>
              <Col xs="auto">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Thông báo{" "}
                    <Badge variant="light">{notification.length}</Badge>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {notification.length > 0 ? (
                      notification.map((noti, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => markAsRead(noti.id)}
                          style={{ fontWeight: noti.read ? "normal" : "bold" }}
                        >
                          {noti.message}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item>Không có thông báo nào.</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              {user === "admin" && (
                <Col xs="auto">
                  <a href={`/admin`}>
                    <Button className="mb-2" variant="info">
                      Bảng điều khiển
                    </Button>
                  </a>
                </Col>
              )}
            </Row>

            {/* <Row className="mt-4">
          <Carousel className="mt-4">
            {Array.from({ length: Math.ceil(posts.length / 4) }).map(
              (_, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {posts.slice(index * 4, index * 4 + 4).map((post) => (
                      <Col key={post.id} md={3} className="mb-4 d-flex">
                        <Card className="shadow-sm border-0 flex-fill">
                          {post.img && (
                            <Card.Img
                              variant="top"
                              src={`http://localhost:8080/uploads/${post.img}`}
                              alt="Post image"
                              className="img-fluid"
                            />
                          )}
                          <Card.Body>
                            <Card.Title>{post.name}</Card.Title>
                            {/* <Card.Text>{post.content}</Card.Text> */}
            {/* <Button variant="primary">Xem chi tiết</Button> */}
            {/* </Card.Body>
                          <Card.Footer className="bg-white">
                            <small className="text-muted">
                              Được đăng bởi{" "}
                              <strong>{post.postedBy.username}</strong> vào{" "}
                              <strong>{getTimeElapsed(post.date)}</strong>
                            </small>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              )
            )}
          </Carousel>
        </Row> */}

            <Row className="justify-content-center mb-4">
              <Col md={8} className="text-center">
                <Form.Group className="shadow-lg">
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm bài đăng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
                <Button
                  className="mt-2"
                  variant="primary"
                  onClick={handleSearch}
                >
                  <FaSearch /> Tìm kiếm
                </Button>
                {posts && posts.length === 0 ? (
                  <Alert variant="danger">
                    Không tìm thấy bài viết nào có tên{" "}
                    <strong>{searchTerm}</strong>
                  </Alert>
                ) : (
                  <Alert variant="success">
                    Có <strong>{posts.length}</strong> bài viết !
                  </Alert>
                )}
              </Col>
            </Row>
            <Row className="justify-content-center">
              {(posts.length > 0 ? posts : posts).map((pos) => (
                <Col key={pos.id} md={8} className="mb-4">
                  <Card className="shadow-lg">
                    <Card.Header className="d-flex align-items-center bg-white">
                      <Image
                        src={`http://localhost:8080/uploads/${pos.postedBy.img}`}
                        roundedCircle
                        style={{
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <Card.Title className="mb-0">{pos.name}</Card.Title>
                        <Card.Subtitle className="text-muted mt-2">
                          Được đăng bởi <strong>{pos.postedBy.username}</strong>{" "}
                          vào <strong>{getTimeElapsed(pos.date)}</strong>
                        </Card.Subtitle>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      {/* <Card.Text>{post.content}</Card.Text> */}
                      {pos.img && (
                        <Card.Img
                          variant="top"
                          src={`http://localhost:8080/uploads/${pos.img}`}
                        />
                      )}

                      <a className="btn btn-link" href={`/view/${pos.id}`}>
                        <button className="btn btn-primary mt-2">Xem</button>
                      </a>
                    </Card.Body>
                    <Card.Footer className="bg-white">
                      <div className="d-flex justify-content-around">
                        <Button
                          variant="link"
                          className="text-primary text-decoration-none custom-like-button"
                          onClick={() =>
                            likedPosts.includes(pos.id)
                              ? handleUnlike(pos.id)
                              : handleLike(pos.id)
                          }
                        >
                          <FaThumbsUp
                            style={{
                              color: likedPosts.includes(pos.id)
                                ? "blue"
                                : "gray",
                            }}
                          />{" "}
                          {pos.likeCount} Thích
                        </Button>
                        <Button
                          variant="link"
                          className="text-primary text-decoration-none custom-like-button"
                          onClick={() => handleShowModal(pos.id)}
                        >
                          <FaComment /> Bình luận
                        </Button>
                        <Button
                          variant="link"
                          className="text-primary text-decoration-none custom-like-button"
                        >
                          <FaEye /> {pos.viewCount - 1} Lượt xem
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Modal for adding a new post */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Thêm bài đăng mới</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAddPost}>
                  <Form.Group controlId="formPostName">
                    <Form.Label>Tên bài đăng</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên bài đăng"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPostContent">
                    <Form.Label>Nội dung</Form.Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={content}
                      onChange={(e, editor) => {
                        const data = editor.getData();
                        setContent(data);
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPostImg">
                    <Form.Label>Link ảnh (tùy chọn)</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="Nhập link ảnh"
                      // value={img}
                      onChange={(e) => setImg(e.target.files[0])}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPostTags">
                    <Form.Label>Thẻ (phân cách bởi dấu phẩy)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập các tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
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
                  <Button variant="primary" type="submit" className="mt-2">
                    Đăng
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Modal for commenting on a post
        <Modal
          show={showModal && modalPostId !== null}
          onHide={handleCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Bình luận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => handleCommentSubmit(e, modalPostId)}>
              <Form.Group controlId="formComment">
                <Form.Label>Nội dung bình luận</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập nội dung bình luận"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Gửi bình luận
              </Button>
            </Form>
          </Modal.Body>
        </Modal> */}

            {/* Modal for profile update */}
            <Modal
              show={showProfileModal}
              onHide={() => setShowProfileModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên người dùng..."
                      value={userDetails.username}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          username: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email người dùng</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email người dùng..."
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu..."
                      value={userDetails.password}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          password: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ID người dùng</Form.Label>
                    <Form.Control
                      type="text"
                      value={userDetails.id}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, id: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleProfileUpdate}
                    className="mt-2"
                  >
                    Lưu thay đổi
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
