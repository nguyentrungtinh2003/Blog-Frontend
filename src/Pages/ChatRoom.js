import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import URL from "./URL";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatRoom = () => {
  const userID = localStorage.getItem("userID");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const stompClient = useRef(null);

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new SockJS(`${URL}/chat`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        stompClient.current.subscribe("/topic/messages", (message) => {
          setMessages((prev) => [...prev, JSON.parse(message.body)]);
        });
      },
    });
    stompClient.current.activate();

    // Lấy lịch sử tin nhắn
    axios.get(`${URL}/message`).then((response) => {
      setMessages(response.data);
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input) {
      alert("Hãy nhập tin nhắn!");
      return;
    }

    const message = {
      user: { id: userID }, // Người gửi là ẩn danh
      content: input,
    };

    stompClient.current.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(message),
    });
    setInput("");
  };
  return (
    <div style={{ marginTop: "100px" }}>
      <div className="row">
        <div className="col-12">
          <h3 className="text-center mb-4">Phòng Chat Ẩn Danh</h3>
          <div
            className="border rounded p-3 mb-3"
            style={{
              height: "500px",
              overflowY: "scroll",
              backgroundColor: "#f8f9fa",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${
                  msg.user.id == userID
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                {msg.user.id !== userID && (
                  <img
                    src={msg.user.img}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
                <div
                  className={`p-3 rounded ${
                    msg.user.id === userID
                      ? "bg-primary text-white"
                      : "bg-black-50 text-dark"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  <p className="m-0">{msg.user.username}</p>
                  <p className="m-0">{msg.content}</p>
                </div>
                {msg.user.id === userID && (
                  <img
                    src={msg.user.img}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginLeft: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
