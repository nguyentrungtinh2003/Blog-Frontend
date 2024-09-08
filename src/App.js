import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Pages//Header";
import { UserProvider } from "./Pages/UserContext";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import "bootstrap/dist/css/bootstrap.min.css";
import UserPage from "./Pages/UserPage";
import AdminPage from "./Pages/AdminPage";
import PostManager from "./Pages/PostManage";
import Home from "./Pages/Home";
import PostDetail from "./Pages/PostDetail";
import Footer from "./Pages/Footer";
import AdminEditUser from "./Pages/AdminEditUser";
import NotMatch from "./Pages/NotMatch/NotMatch";
import AdminEditPost from "./Pages/AdminEditPost";
import MyPosts from "./Pages/MyPosts";
import UserEditPost from "./Pages/UserEditPost";
import MyComment from "./Pages/MyComment";
import UserEditComment from "./Pages/UserEditComment";
import ViewUser from "./Pages/ViewUser";
import AdminAddCategory from "./Pages/AdminAddCategory";
import AdminEditCategory from "./Pages/AdminEditCategory";
import UserEditProfile from "./Pages/UserEditProfile";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/view/:id" element={<PostDetail />} />
          <Route path="/viewUser/:id" element={<ViewUser />} />
          <Route path="/editUser/:id" element={<AdminEditUser />} />
          <Route path="/editPost/:id" element={<AdminEditPost />} />
          <Route path="/userEditPost/:id" element={<UserEditPost />} />
          <Route path="/userEditComment/:id" element={<UserEditComment />} />
          <Route path="/userEditProfile/:id" element={<UserEditProfile />} />
          <Route path="/myPosts/:id" element={<MyPosts />} />
          <Route path="/myComments/:id" element={<MyComment />} />
          <Route path="/addCategory" element={<AdminAddCategory />} />
          <Route path="/editCategory/:id" element={<AdminEditCategory />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotMatch />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
