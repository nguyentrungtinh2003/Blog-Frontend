import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "./ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import URL from "./URL";

const MyPosts = () => {
  const [myPost, setMyPost] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${URL}/api/posts/byUser/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setMyPost(response.data);
      })
      .catch((error) => {
        console.log("Error getting posts by user!");
      });
  }, [id]);

  const context = useContext(ThemeContext);

  const handleDeletePost = (postId, name) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá bài viết ${name} không !`
    );
    if (userConfirm) {
      axios
        .delete(`${URL}/api/posts/${postId}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Delete post success");
          // Xóa bài viết khỏi state sau khi xóa thành công
          // Hiển thị thông báo thành công
          toast.success(`Thêm danh mục thành công !`, {
            position: "top-right",
            autoClose: 3000, // Tự động đóng sau 3 giây
          });

          setTimeout(() => {
            window.location.reload();
          }, 3000);
          setMyPost((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
          );
        })
        .catch((error) => {
          console.error("Error deleting post", error);
        });

      window.location.reload();
    }
  };

  return (
    <div className={context.theme}>
      <ToastContainer />
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
            {myPost.length > 0 ? (
              myPost.map((post) => (
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
                      <button className="btn btn-primary btn-sm m-2">
                        <i className="fas fa-edit"></i>
                      </button>
                    </a>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePost(post.id, post.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có bài viết nào !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPosts;
