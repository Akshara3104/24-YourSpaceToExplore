import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

function ChatComponent() {
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const profilePicture = localStorage.getItem("profilePicture");

  const { targetId } = useParams();
  const location = useLocation();
  const { targetName, targetProfilePicture } = location.state;

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  const navigate = useNavigate()

  const getMessages = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/message/getMessages`,
      { userId, targetId }
    );
    setMessages(res.data.messages);
  };

  const sendMessage = async () => {
    const messageData = {
      senderId: userId,
      targetId,
      text: text,
      image: "",
    };

    if(text==='') return;

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]); // Optimistic UI update
    setText("");
  };

  React.useEffect(() => {
    getMessages();
    socket.emit("joinRoom", userId);

    socket.on("receiveMessage", (message) => {
      if (message.senderId === targetId || message.targetId === targetId) {
        setMessages((prev) => [...prev, message]); 
    } else {
        // Handle unseen messages (like notifications)
    }
    });

    return () => socket.off("receiveMessage");
  }, [targetId]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center cursor-pointer" onClick={()=>navigate(`/nquery/${targetName}/profile`, {state: {targetId}})}>
        <div className="flex items-center space-x-3">
          <img
            src={targetProfilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{targetName}</h2>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 p-6 overflow-y-auto bg-gray-50"
        style={{ minHeight: messages.length === 0 ? "200px" : "auto" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start mb-4 ${
                message.senderId === userId ? "justify-end" : ""
              }`}
            >
              {message.senderId !== userId && (
                <img
                  src={targetProfilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
              )}
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-semibold text-sm">
                    {message.senderId === userId ? name : targetName}
                  </span>
                  <span className="text-xs text-gray-500">4:06 PM</span>
                </div>
                <div
                  className={`p-3 rounded-lg mt-1 max-w-xs ${
                    message.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 flex items-center space-x-3">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => text!=='' && e.key === "Enter" && sendMessage()}
        />
        <button className="text-gray-500 hover:text-gray-700" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
