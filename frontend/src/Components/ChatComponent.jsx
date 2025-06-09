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
            targetId: targetId,
            text: text,
            createdAt: new Date().toISOString(),
        };
        socket.emit("sendMessage", messageData);

        if (!text.trim()) return;


        setMessages((prev) => {
            const dateKey = new Date(messageData.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            });

            console.log(prev)

            return {
            ...prev,
            [dateKey]: prev[dateKey] ? [...prev[dateKey], messageData] : [messageData],
            };
        });
        setText("");
    };

    React.useEffect(() => {
        getMessages();
        socket.emit("joinRoom", userId);

        socket.on("receiveMessage", (message) => {
        if (message.senderId === targetId || message.targetId === targetId) {
            // setMessages((prev) => [...prev, message]); 
            setMessages((prev) => {
                const dateKey = new Date(message.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                });

                console.log(prev)

            return {
                ...prev,
                [dateKey]: prev[dateKey] ? [...prev[dateKey], message] : [message],
            };
        });
        } else {
            // Handle unseen messages (like notifications)
        }
        });

        return () => socket.off("receiveMessage");
    }, [targetId]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col ms-3 h-full">
            {/* Header */}
            <div 
                className="shadow p-4 flex justify-between items-center cursor-pointer mb-3 section" 
                onClick={()=>navigate(`/24/${targetName}/profile`, {state: {targetId}})}
            >
                <div className="flex items-center space-x-3">
                    <img
                        src={targetProfilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-lg font-semibold">{targetName}</h2>
                </div>
            </div>

            <div
            className="flex-1 p-6 overflow-y-auto section"
            style={{ minHeight: Object.keys(messages).length === 0 ? "200px" : "auto" }}
            >
            {Object.entries(messages).length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                No messages yet. Start the conversation!
                </div>
            ) : (
                Object.entries(messages).map(([date, msgs]) => (
                <div key={date}>
                    {/* Date Badge */}
                    <div className="text-center my-4">
                    <span className="inline-block bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                        {date}
                    </span>
                    </div>

                    {/* Messages */}
                    {msgs.map((message, i) => (
                    <div
                        key={i}
                        className={`flex items-start mb-4 ${
                        message.senderId === userId ? "justify-end" : ""
                        }`}
                    >
                        <div>
                        {/* Time */}
                        <div className="flex items-baseline space-x-2 mb-1">
                            <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`p-3 rounded-lg max-w-xs ${
                            message.senderId === userId
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gradient-to-r from-blue-500 to-indigo-800 text-white"
                            }`}
                        >
                            {message.text}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                ))
            )}

            <div ref={messagesEndRef} />
            </div>



            {/* Message Input */}
            <div className="flex items-center space-x-3 section mt-3 px-5">
                <input
                    type="text"
                    placeholder="Message..."
                    className="flex-1 p-3 rounded-lg outline-none focus:outline-none focus:ring-0 inp"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => text!=='' && e.key === "Enter" && sendMessage()}
                />
                <button className="text-white py-3 px-4 rounded hover:text-gray-700 me-5 bg-gradient-to-r from-orange-500 to-red-500" onClick={sendMessage} disabled={text===''}>
                Send
                </button>
            </div>
        </div>
    );
}

export default ChatComponent;
