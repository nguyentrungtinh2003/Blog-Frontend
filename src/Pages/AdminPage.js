import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import { ThemeContext } from "./ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card

  // Function to fetch users
  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/auth/users")
      .then((response) => {
        setUsers(response.data);
        setUserCount(response.data.length); // Update userCount state
        setSelectedCard("users"); // Set selected card to users
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // Function to fetch posts
  const fetchPosts = () => {
    axios
      .get("http://localhost:8080/api/posts")
      .then((response) => {
        setPosts(response.data);
        setPostCount(response.data.length); // Update postCount state
        setSelectedCard("posts"); // Set selected card to posts
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  // Function to fetch likes
  const fetchCategory = () => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => {
        setCategory(response.data);
        setCategoryCount(response.data.length); // Update postCount state
        setSelectedCard("categories"); // Set selected card to posts
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Function to fetch users
  const fetchComments = () => {
    axios
      .get("http://localhost:8080/api/comments")
      .then((response) => {
        setComments(response.data);
        setCommentCount(response.data.length); // Update userCount state
        setSelectedCard("comments"); // Set selected card to users
      })
      .catch((error) => {
        console.error("Error fetching comment:", error);
      });
  };

  useEffect(() => {
    // Fetch initial data
    fetchUsers();
    fetchPosts();
    fetchCategory();
    fetchComments();
  }, []); // Empty dependency array to run only once on component mount

  const deleteHandel = (id, name) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá người dùng ${name} không !`
    );

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/auth/users/${id}`)
        .then((response) => {
          console.log("Delete user success");
        })
        .catch((error) => {
          console.error("Error delete user", error);
        });
    }
  };

  const deleteHandelCategory = (id, name) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá danh mục ${name} không !`
    );

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/categories/${id}`)
        .then((response) => {
          console.log("Delete category success");
          // Hiển thị thông báo thành công
          toast.success(`Xoá danh mục ${name} thành công !`, {
            position: "top-right",
            autoClose: 3000, // Tự động đóng sau 3 giây
          });
        })
        .catch((error) => {
          console.error("Error delete category", error);
        });

      window.location.reload();
    }
  };

  const handelDeletePost = (id, name) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá bài viết ${name} không !`
    );

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/posts/${id}`)
        .then((response) => {
          console.log("Delete post success");
          // Hiển thị thông báo thành công
          toast.success(`Xoá bài viết ${name} thành công !`, {
            position: "top-right",
            autoClose: 3000, // Tự động đóng sau 3 giây
          });
        })
        .catch((error) => {
          console.error("Error delete post");
        });
    }
  };

  const handleDeleteComment = (id, content) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá bình luận ${content} không !`
    );

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/comments/${id}`)
        .then((response) => {
          console.log("Delete comment success !");
          // Hiển thị thông báo thành công
          toast.success(`Xoá bình luận ${content} thành công !`, {
            position: "top-right",
            autoClose: 3000, // Tự động đóng sau 3 giây
          });
        })
        .catch((error) => {
          console.log("Error delete comment !");
        });
      window.location.reload();
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

  // active user
  const activateUser = async (userId, enable) => {
    try {
      await axios.put(`http://localhost:8080/api/auth/${userId}/enable`, null, {
        params: {
          enable: enable,
        },
      });
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // Ví dụ sử dụng hàm activateUser trong một component
  const handleActivateUser = (id) => {
    activateUser(id, true);
  };

  const handleKickUser = (id) => {
    activateUser(id, false);
  };

  //

  const handelSendEmailWarning = (email) => {
    axios
      .post(`http://localhost:8080/api/email/sendWarning`, { email: email })
      .then((response) => {
        console.log(`Send email warning with email : ${email} success !`);
      })
      .catch((error) => {
        console.log(`Fail send email with email : ${email} !`);
      });
  };

  const context = useContext(ThemeContext);
  return (
    <div className={`${context.theme}`}>
      <ToastContainer />
      <Container>
        <h2 className="mb-4">
          <i
            className="fas fa-tachometer-alt"
            style={{ color: "blue", fontSize: "30px" }}
          ></i>
        </h2>

        <div className="card-container d-flex justify-content-around flex-wrap">
          {/* Users Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${
              selectedCard === "users" ? "selected" : ""
            } shadow-lg`}
            onClick={fetchUsers}
          >
            <Card.Body>
              <Card.Title>
                {" "}
                <i
                  className="fas fa-user"
                  style={{ color: "blue", fontSize: "24px" }}
                ></i>
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem" }}>
                Tổng: <strong>{userCount}</strong>
              </Card.Text>
              <Button variant="primary">Quản lí người dùng</Button>
            </Card.Body>
          </Card>

          {/* Posts Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${
              selectedCard === "posts" ? "selected" : ""
            } shadow-lg`}
            onClick={fetchPosts}
          >
            <Card.Body>
              <Card.Title>
                {" "}
                <i
                  className="fas fa-book"
                  style={{ color: "blue", fontSize: "24px" }}
                ></i>
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem" }}>
                Tổng: <strong>{postCount}</strong>
              </Card.Text>
              <Button variant="primary">Quản lí bài viết</Button>
            </Card.Body>
          </Card>

          {/* Category Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${
              selectedCard === "categories" ? "selected" : ""
            } shadow-lg`}
          >
            <Card.Body>
              <Card.Title>
                {" "}
                <i
                  className="fas fa-th"
                  style={{ color: "blue", fontSize: "24px" }}
                ></i>
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem" }}>
                Tổng: <strong>{categoryCount}</strong>
              </Card.Text>
              <Button variant="primary" className="m-2">
                <a
                  href={`/addCategory`}
                  className="text-white text-decoration-none"
                >
                  <i className="fas fa-add"></i>
                </a>
              </Button>
              <Button variant="primary" onClick={fetchCategory}>
                Quản lí danh mục
              </Button>
            </Card.Body>
          </Card>

          {/* Comments Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${
              selectedCard === "comments" ? "selected" : ""
            } shadow-lg`}
          >
            <Card.Body>
              <Card.Title>
                {" "}
                <i
                  className="fas fa-comments"
                  style={{ color: "blue", fontSize: "24px" }}
                ></i>
              </Card.Title>
              <Card.Text style={{ fontSize: "1.5rem" }}>
                Tổng: <strong>{commentCount}</strong>
              </Card.Text>
              <Button variant="primary" onClick={fetchComments}>
                Quản lí bình luận
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Display Users Table */}
        {selectedCard === "users" && users.length > 0 && (
          <div>
            <h3 className="mb-3">
              <li
                className="fas fa-user"
                style={{ color: "blue", fontSize: "30px" }}
              ></li>
            </h3>
            <Table striped bordered hover className="shadow-lg">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Hình ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <img
                        src={`http://localhost:8080/uploads/${user.img}`}
                        alt={user.username}
                        style={{
                          width: "60px", // Chiều rộng tối đa
                          height: "60px", // Chiều cao tối đa
                          objectFit: "cover", // Đảm bảo hình ảnh vừa vặn trong khung
                          borderRadius: "5px", // Bo góc cho hình ảnh mềm mại hơn
                        }}
                      />
                    </td>
                    <td>
                      <Button variant="info" className="m-2">
                        <a
                          href={`/viewUser/${user.id}`}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                      </Button>
                      <Button variant="primary" className="m-2">
                        <a
                          href={`/editUser/${user.id}`}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                      </Button>
                      {/* <Button variant="danger" className="mr-2">
                        <a
                          onClick={() => deleteHandel(user.id, user.username)}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-remove"></i>
                        </a>
                      </Button> */}
                      <Button variant="primary" className="m-2">
                        <a
                          onClick={() => handleActivateUser(user.id)}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-unlock"></i>
                        </a>
                      </Button>
                      <Button variant="danger" className="m-2">
                        <a
                          onClick={() => handleKickUser(user.id)}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-lock"></i>
                        </a>
                      </Button>
                      <Button variant="warning" className="m-2">
                        <a
                          onClick={() => handelSendEmailWarning(user.email)}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Display Posts Table */}
        {selectedCard === "posts" && posts.length > 0 && (
          <div>
            <h3 className="mb-3">
              <li
                className="fas fa-book"
                style={{ color: "blue", fontSize: "30px" }}
              ></li>
            </h3>
            <Table striped bordered hover className="shadow-lg">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th>Tên</th>
                  <th>Nội dung</th>
                  <th>Người đăng</th>
                  <th>Hình ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{post.name}</td>
                    <td>{post.content}</td>
                    <td>{post.postedBy.username}</td>
                    <td>
                      {post.img && (
                        <img
                          src={`http://localhost:8080/uploads/${post.img}`}
                          alt={post.name}
                          className="img-fluid"
                          style={{ maxWidth: "100px", height: "auto" }}
                        />
                      )}
                    </td>
                    <td>
                      <Button variant="primary" className="m-2">
                        <a
                          href={`/editPost/${post.id}`}
                          className="text-white "
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                      </Button>
                      <Button
                        variant="danger"
                        className="mr-2"
                        onClick={() => handelDeletePost(post.id, post.name)}
                      >
                        <i className="fas fa-remove"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Similar sections for Likes and Comments tables */}

        {/* Display Users Table */}
        {selectedCard === "categories" && category.length > 0 && (
          <div>
            <h3 className="mb-3">
              <li
                className="fas fa-th"
                style={{ color: "blue", fontSize: "30px" }}
              ></li>
            </h3>
            <Table striped bordered hover className="shadow-lg">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Bài viết</th>
                  <th>Hình ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {category.map((cate, index) => (
                  <tr key={cate.id}>
                    <td>{index + 1}</td>
                    <td>{cate.name}</td>
                    <td>
                      {cate.posts.map((post) => (
                        <div key={post.id}>{post.name}</div>
                      ))}
                    </td>
                    <td>
                      {cate.posts.map(
                        (post) =>
                          post.img && (
                            <img
                              key={post.id}
                              src={`http://localhost:8080/uploads/${post.img}`}
                              alt={post.name}
                              className="img-fluid"
                              style={{ maxWidth: "60px", height: "auto" }}
                            />
                          )
                      )}
                    </td>
                    <td>
                      <Button variant="primary" className="m-2">
                        <a
                          href={`/editCategory/${cate.id}`}
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                      </Button>
                      <Button variant="danger" className="mr-2">
                        <a
                          onClick={() =>
                            deleteHandelCategory(cate.id, cate.name)
                          }
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-remove"></i>
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Display Users Table */}
        {selectedCard === "comments" && comments.length > 0 && (
          <div>
            <h3 className="mb-3">
              <li
                className="fas fa-comments"
                style={{ color: "blue", fontSize: "30px" }}
              ></li>
            </h3>
            <Table striped bordered hover className="shadow-lg">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nội dung</th>
                  <th>Ngày tạo</th>
                  <th>Người đăng</th>
                  <th>Hình ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment.id}>
                    <td>{index + 1}</td>
                    <td>{comment.content}</td>
                    <td>{getTimeElapsed(comment.createdAt)}</td>
                    <td>{comment.postedBy.username}</td>
                    <td>
                      {comment.postedBy.img && (
                        <img
                          src={`http://localhost:8080/uploads/${comment.postedBy.img}`}
                          alt={comment.postedBy.username}
                          className="img-fluid"
                          style={{ maxWidth: "60px", height: "auto" }}
                        />
                      )}
                    </td>
                    <td>
                      {/* <Button variant="primary" className="mr-2">
                        <a
                          href={`/editUser/${post.id}`}
                          className="text-white text-decoration-none"
                        >
                          Edit
                        </a>
                      </Button> */}
                      <Button variant="danger" className="mr-2">
                        <a
                          onClick={() =>
                            handleDeleteComment(comment.id, comment.content)
                          }
                          className="text-white text-decoration-none"
                        >
                          <i className="fas fa-remove"></i>
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminPage;
