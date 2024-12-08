import React from "react";

const ConfigToken = () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  // Trả về cấu hình header với Authorization chứa token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export default ConfigToken;
