import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import { ThemeContext } from "./ThemeContext";

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

  const deleteHandel = (id) => {
    const userConfirm = window.confirm("Bạn có muốn xoá không !");

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/auth/users/${id}`)
        .then((response) => {
          console.log("Delete user success");
        })
        .catch((error) => {
          console.error("Error delete user", error);
        });

      window.location.reload();
    }
  };

  const deleteHandelCategory = (id) => {
    const userConfirm = window.confirm("Bạn có muốn xoá không !");

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/categories/${id}`)
        .then((response) => {
          console.log("Delete category success");
        })
        .catch((error) => {
          console.error("Error delete category", error);
        });

      window.location.reload();
    }
  };

  const handelDeletePost = (id) => {
    const userConfirm = window.confirm("Bạn có muốn xoá không !");

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/posts/${id}`)
        .then((response) => {
          console.log("Delete user success");
        })
        .catch((error) => {
          console.error("Error delete user");
        });

      window.location.reload();
    }
  };

  const context = useContext(ThemeContext);
  return (
    <div className={`${context.theme}`}>
      <Container>
        <h2 className="mb-4">Bảng điều khiển</h2>

        <div className="card-container d-flex justify-content-around flex-wrap">
          {/* Users Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${selectedCard === "users" ? "selected" : ""}`}
            onClick={fetchUsers}
          >
            <Card.Body>
              <Card.Title>Người dùng</Card.Title>
              <Card.Text>Tổng: {userCount}</Card.Text>
              <Button variant="primary">Quản lí người dùng</Button>
            </Card.Body>
          </Card>

          {/* Posts Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${selectedCard === "posts" ? "selected" : ""}`}
            onClick={fetchPosts}
          >
            <Card.Body>
              <Card.Title>Bài viết</Card.Title>
              <Card.Text>Tổng: {postCount}</Card.Text>
              <Button variant="primary">Quản lí bài viết</Button>
            </Card.Body>
          </Card>

          {/* Category Card */}
          <Card
            style={{ width: "18rem" }}
            className={`mb-4 ${
              selectedCard === "categories" ? "selected" : ""
            }`}
          >
            <Card.Body>
              <Card.Title>Danh mục</Card.Title>
              <Card.Text>Tổng: {categoryCount}</Card.Text>
              <Button variant="primary" className="mr-2">
                <a
                  href={`/addCategory`}
                  className="text-white text-decoration-none"
                >
                  Thêm
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
            className={`mb-4 ${selectedCard === "comments" ? "selected" : ""}`}
          >
            <Card.Body>
              <Card.Title>Bình luận</Card.Title>
              <Card.Text>Tổng: {commentCount}</Card.Text>
              <Button variant="primary" onClick={fetchComments}>
                Quản lí bình luận
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Display Users Table */}
        {selectedCard === "users" && users.length > 0 && (
          <div>
            <h3 className="mb-3">Người dùng</h3>
            <Table striped bordered hover>
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
                          width: "100px", // Chiều rộng tối đa
                          height: "100px", // Chiều cao tối đa
                          objectFit: "cover", // Đảm bảo hình ảnh vừa vặn trong khung
                          borderRadius: "5px", // Bo góc cho hình ảnh mềm mại hơn
                        }}
                      />
                    </td>
                    <td>
                      <Button variant="info" className="mr-2">
                        <a
                          href={`/viewUser/${user.id}`}
                          className="text-white text-decoration-none"
                        >
                          Xem
                        </a>
                      </Button>
                      <Button variant="primary" className="mr-2">
                        <a
                          href={`/editUser/${user.id}`}
                          className="text-white text-decoration-none"
                        >
                          Sửa
                        </a>
                      </Button>
                      <Button variant="danger" className="mr-2">
                        <a
                          onClick={() => deleteHandel(user.id)}
                          className="text-white text-decoration-none"
                        >
                          Xoá
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
            <h3 className="mb-3">Bài viết</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th>Tên</th>
                  <th>Nội dung</th>
                  <th>Người dùng</th>
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
                      <Button variant="primary" className="mr-2">
                        <a
                          href={`/editPost/${post.id}`}
                          className="text-white "
                        >
                          Sửa
                        </a>
                      </Button>
                      <Button
                        variant="danger"
                        className="mr-2"
                        onClick={() => handelDeletePost(post.id)}
                      >
                        Xoá
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
            <h3 className="mb-3">Danh mục</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Bài viết</th>
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
                      <Button variant="warning" className="mr-2">
                        <a
                          href={`/editCategory/${cate.id}`}
                          className="text-white text-decoration-none"
                        >
                          Edit
                        </a>
                      </Button>
                      <Button variant="danger" className="mr-2">
                        <a
                          onClick={() => deleteHandelCategory(cate.id)}
                          className="text-white text-decoration-none"
                        >
                          Delete
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
            <h3 className="mb-3">Bình luận</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nội dung</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment.id}>
                    <td>{index + 1}</td>
                    <td>{comment.content}</td>
                    <td>{comment.createdAt}</td>
                    <td>
                      {/* <Button variant="primary" className="mr-2">
                        <a
                          href={`/editUser/${post.id}`}
                          className="text-white text-decoration-none"
                        >
                          Edit
                        </a>
                      </Button>
                      <Button variant="danger" className="mr-2">
                        <a
                          onClick={() => deleteHandel(user.id)}
                          className="text-white text-decoration-none"
                        >
                          Delete
                        </a>
                      </Button> */}
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
