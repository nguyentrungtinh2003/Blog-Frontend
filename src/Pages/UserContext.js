import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userImg, setUserImg] = useState(null); // Thêm trạng thái cho img

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");
    const storedUserImg = localStorage.getItem("userImg"); // Lấy img từ localStorage
    if (storedUser && storedUserId && storedUserImg) {
      setUser(storedUser);
      setUserId(storedUserId);
      setUserImg(storedUserImg);
    }
  }, []);

  // Update localStorage when user state changes
  useEffect(() => {
    if (user && userId && userImg) {
      localStorage.setItem("user", user);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userImg", userImg); // Lưu img vào localStorage
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userImg"); // Xóa img khỏi localStorage nếu không có
    }
  }, [user, userId, userImg]);

  return (
    <UserContext.Provider
      value={{ user, userId, userImg, setUser, setUserId, setUserImg }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
