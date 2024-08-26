import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");
    if (storedUser && storedUserId) {
      setUser(storedUser);
      setUserId(storedUserId);
    }
  }, []);

  // Update localStorage when user state changes
  useEffect(() => {
    if (user && userId) {
      localStorage.setItem("user", user);
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }, [user, userId]);

  return (
    <UserContext.Provider value={{ user, userId, setUser, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
