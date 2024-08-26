import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "./ThemeContext";

const MyPosts = () => {
  const [myPost, setMyPost] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/byUser/${id}`)
      .then((response) => {
        setMyPost(response.data);
      })
      .catch((error) => {
        console.log("Error getting posts by user!");
      });
  }, [id]);

  const context = useContext(ThemeContext);

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:8080/api/posts/${postId}`)
      .then((response) => {
        console.log("Delete post success");
        // Xóa bài viết khỏi state sau khi xóa thành công
        setMyPost((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
      })
      .catch((error) => {
        console.error("Error deleting post", error);
      });

    window.location.reload();
  };

  return (
    <div className={context.theme}>
      <div className="container">
        <h2 className="mb-4">Bài viết của tôi</h2>
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Tên</th>
              <th>Nội dung</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {myPost.map((post) => (
              <tr key={post.id}>
                <td>{post.name}</td>
                <td dangerouslySetInnerHTML={{ __html: post.content }}></td>
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
                  <a href={`/userEditPost/${post.id}`}>
                    <button className="btn btn-primary btn-sm mr-2">Sửa</button>
                  </a>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPosts;
