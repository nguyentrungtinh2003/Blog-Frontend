import React, { useState, useEffect, useContext } from "react";
import { Alert, Carousel } from "react-bootstrap";
import { ThemeContext } from "./ThemeContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Dropdown, Badge } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfigToken from "./Auth/ConfigToken";
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
import { MdToken } from "react-icons/md";
import URL from "./URL";

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
  const [notificationType, setNotificationType] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [findCategory, setFindCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState([]);
  const [users, setuser] = useState({});
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [contentSearch, setContentSearch] = useState("");
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
        .get(`${URL}/api/posts`, ConfigToken)
        .then((response) => {
          setPosts(response.data);
          const initialComments = {};
          response.data.forEach((post) => {
            axios
              .get(`${URL}/api/comments/${post.id}`, {
                withCredentials: true,
              })
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
      .get(`${URL}/api/auth/users/${loggedInUserId}`)
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
      .put(`${URL}/api/auth/users/${id}`, updatedUser)
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
      .put(`${URL}/api/posts/${postId}/like`, ConfigToken)
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
      .put(`${URL}/api/posts/${postId}/Unlike`, ConfigToken)
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
    if (img) {
      formData.append("img", img); // appending file here
    }
    formData.append(
      "tags",
      tags
        .split(",")
        .map((tag) => tag.trim())
        .join(",")
    ); // convert array to comma-separated string
    formData.append("postedBy", userId);
    formData.append("category", category);
    // formData.append("notificationType", notificationType);
    // formData.append("recipientEmail", recipientEmail);

    axios
      .post(`${URL}/api/posts`, formData, {
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

        // Hiển thị thông báo thành công
        toast.success(`Thêm bài viết ${name} thành công !`, {
          position: "top-right",
          autoClose: 3000, // Tự động đóng sau 3 giây
        });
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });
  };

  const handleCommentSubmit = (event, postId) => {
    event.preventDefault();
    const commentData = {
      content: commentContent,
      post: { id: postId },
    };

    axios
      .post(`${URL}/api/comments/create`, commentData)
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
          `${URL}/api/posts/search/${searchTerm}`,
          ConfigToken
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
        .get(`${URL}/api/categories`, ConfigToken)
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
      .get(`${URL}/api/notifications/${userId}`, ConfigToken)
      .then((response) => {
        setNotification(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notifications!", error);
      });
  }, [userId]);

  const markAsRead = (id) => {
    axios
      .post(`${URL}/api/notifications/${id}/mark-read`, ConfigToken)
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
    window.location.reload();
  };

  useEffect(() => {
    axios
      .get(`${URL}/api/categories`, ConfigToken)
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
      .get(`${URL}/api/categories/${id}`, ConfigToken)
      .then((response) => {
        setPosts(response.data.posts);
        setActiveCategory(id);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Get category navbar error ! ");
      });
  };
  // Search with design pattern
  const handleSearchDesignpattern = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${URL}/api/posts/search`,
        {
          params: {
            author,
            title,
            content,
          },
        },
        ConfigToken
      );
      // Hiển thị thông báo thành công
      toast.success("Thành công !", {
        position: "top-right", // Sửa vị trí ở đây
        autoClose: 3000, // Tự động đóng sau 3 giây
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Có lỗi xảy ra khi tìm kiếm:", error);
      // Thêm thông báo lỗi nếu cần
      toast.error("Có lỗi xảy ra!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  //

  const context = useContext(ThemeContext);

  return (
    <div className={`${context.theme}`}>
      <div className={`${context.theme} row`}>
        <div className="col-2">
          <div
            className=" fixed-top-bar"
            style={{ minHeight: "100vh", padding: "15px" }}
          >
            <ul className="list-group">
              {findCategory.map((cate) => (
                <li
                  key={cate.id}
                  className={`list-group-item list-group-item-action ${
                    activeCategory === cate.id ? "active" : ""
                  }`}
                  onClick={() => onCategorySelect(cate.id)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {cate.name}
                </li>
              ))}
              <li
                className="list-group-item list-group-item-action"
                onClick={() => window.location.reload()}
              >
                Tất cả
              </li>
            </ul>
          </div>
        </div>

        <div className={`col-10`}>
          <div className={`${context.theme} `}>
            {/* fixed-top-bar*/}
            <Row className={`${context.theme} justify-content-center`}>
              <Col xs="auto" className={context.theme}>
                <Button
                  className={`${context.theme} `}
                  variant={context.theme === "dark" ? "dark" : "primary"}
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-add"></i>
                </Button>
              </Col>
              <Col xs="auto" className={context.theme}>
                <a href={`/userEditProfile/${userId}`}>
                  <Button
                    className={context.theme}
                    variant={context.theme === "dark" ? "dark" : "primary"}
                  >
                    <i className="fas fa-user"></i>
                  </Button>
                </a>
              </Col>
              <Col xs="auto" className={context.theme}>
                <a href={`/myPosts/${userId}`}>
                  <Button
                    className={`${context.theme} mb-2`}
                    variant={context.theme === "dark" ? "dark" : "primary"}
                  >
                    <i className="fas fa-book"></i>
                  </Button>
                </a>
              </Col>
              <Col xs="auto" className={context.theme}>
                <a href={`/myComments/${userId}`}>
                  <Button
                    className={`${context.theme} mb-2`}
                    variant={context.theme === "dark" ? "dark" : "primary"}
                  >
                    <i className="fas fa-comment"></i>
                  </Button>
                </a>
              </Col>
              <Col xs="auto" className={context.theme}>
                <Dropdown className={context.theme}>
                  <Dropdown.Toggle
                    variant={context.theme === "dark" ? "dark" : "primary"}
                    id="dropdown-basic"
                  >
                    <i className="fas fa-bell"></i>{" "}
                    <Badge bg="danger">{notification.length}</Badge>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className={
                      context.theme === "dark" ? "bg-dark text-white" : ""
                    }
                  >
                    {notification.length > 0 ? (
                      notification.map((noti, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => markAsRead(noti.id)}
                          style={{
                            fontWeight: noti.read ? "normal" : "bold",
                          }}
                          className={
                            context.theme === "dark" ? "text-white" : ""
                          }
                        >
                          {noti.message}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item
                        className={context.theme === "dark" ? "text-white" : ""}
                      >
                        Không có thông báo nào.
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              {user === "admin" && (
                <Col xs="auto" className={context.theme}>
                  <a href={`/admin`}>
                    <Button
                      className={`${context.theme} mb-2`}
                      variant={context.theme === "dark" ? "dark" : "primary"}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                    </Button>
                  </a>
                </Col>
              )}
            </Row>

            <Row className={`${context.theme} justify-content-center `}>
              <Col md={8} className={`text-center ${context.theme}`}>
                <Form.Group className="shadow-lg">
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm bài viết ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${
                      context.theme === "dark" ? "input-dark" : "input-light"
                    }`} // Sử dụng lớp custom
                  />
                </Form.Group>
                <Button
                  className={`${context.theme} mt-2`}
                  variant={context.theme === "dark" ? "dark" : "primary"}
                  onClick={handleSearch}
                >
                  <FaSearch />
                </Button>
              </Col>
            </Row>
            <div className="container mt-5">
              {/* <h1 className="text-center mb-4">Tìm kiếm bài viết</h1> */}
              <form
                onSubmit={handleSearchDesignpattern}
                className="border p-4 shadow-sm bg-light"
              >
                <div className="form-group mb-3">
                  <label htmlFor="author">Người tạo:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tìm theo người tạo"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="title">Tiêu đề:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tìm theo tiêu đề"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="content">Nội dung:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tìm theo nội dung"
                  />
                </div>
                <button type="submit" className="btn btn-primary ">
                  <li className="fas fa-search"></li>
                </button>
              </form>
            </div>
          </div>
          <ToastContainer />

          <div className={`${context.theme} scrollable-content`}>
            <Container>
              <Row className={`${context.theme} justify-content-center`}>
                {(posts.length > 0 ? posts : posts).map((pos) => (
                  <Col key={pos.id} md={8} className={`${context.theme} mb-4`}>
                    <Card className="shadow-lg w-100">
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
                            Được đăng bởi{" "}
                            <strong>{pos.postedBy.username}</strong> vào{" "}
                            <strong>{getTimeElapsed(pos.date)}</strong>
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
                          <button className="btn btn-primary mt-2">
                            <li className="fas fa-eye"></li>
                          </button>
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
                            <FaEye /> {pos.viewCount} Lượt xem
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
                    {/* <Form.Group controlId="formToEmail">
                      <Form.Label>Thông báo đến</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập email người nhận"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </Form.Group> */}
                    {/* <Form.Group controlId="formSend">
                      <Form.Label>Gửi thông báo qua</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Gửi qua Email, SMS, Push ..."
                        value={notificationType}
                        onChange={(e) => setNotificationType(e.target.value)}
                      />
                    </Form.Group> */}
                    <Button variant="primary" type="submit" className="mt-2">
                      <li className="fas fa-check"></li>
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

              {/* Modal for profile update
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
            </Modal> */}
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
