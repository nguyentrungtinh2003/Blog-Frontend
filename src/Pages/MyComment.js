import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeContext } from "./ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyComment = () => {
  const [myComment, setMyComment] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/comments/byUser/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setMyComment(response.data);
      })
      .catch((error) => {
        console.log("Error getting posts by user!");
      });
  }, [id]);

  const context = useContext(ThemeContext);

  const handleDeleteComment = (id, content) => {
    const userConfirm = window.confirm(
      `Bạn có muốn xoá bình luận ${content} không !`
    );

    if (userConfirm) {
      axios
        .delete(`http://localhost:8080/api/comments/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Delete comment success !");
          // Hiển thị thông báo thành công
          toast.success(`Thêm danh mục thành công !`, {
            position: "top-right",
            autoClose: 3000, // Tự động đóng sau 3 giây
          });

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.log("Error delete comment !");
        });
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
  return (
    <div className={context.theme}>
      <ToastContainer />
      <div className="container">
        <h2 className="mb-4">Bình luận của tôi</h2>
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Nội dung</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {myComment.length > 0 ? (
              myComment.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.content}</td>
                  <td>{getTimeElapsed(comment.createdAt)}</td>
                  <td>
                    <a href={`/userEditComment/${comment.id}`}>
                      <button className="btn btn-primary btn-sm m-2">
                        <i className="fas fa-edit"></i>
                      </button>
                    </a>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDeleteComment(comment.id, comment.content)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Không có bình luận nào !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyComment;
