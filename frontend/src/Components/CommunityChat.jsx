import axios from 'axios';
import React, {useRef} from 'react'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

export default function CommunityChat() {

    const location = useLocation();

    const { communityId, communityTitle, communityImage } = location.state;

    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');

    const [members, setMembers] = React.useState([])

    const [messages, setMessages] = React.useState([])

    const [text, setText] = React.useState('')

    const messagesEndRef = useRef(null); // Ref for auto-scrolling
    

    const getMembers = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getMembers`, {communityId})
            // console.log(res.data)
            setMembers(res.data.members)
        } catch (error) {
            console.log(error.message)
        }
    }

    const getChatMessages = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getMessages`, {communityId})
            setMessages(res.data.messages)
            // console.log(messages)

        } catch (error) {
            
        }
    }

    const sendMessage = async ()=>{

        if(text.trim()==='') return;

        const tempId = Date.now();
        const message = {
            tempId,
            text,
            senderId:{
                _id: userId,
            },
            communityId,
            image: ''
        }

        console.log('sent', message)


        socket.emit("sendCommunityMessage", message);
        setMessages((prev) => [...prev, message]); // Optimistic UI update
        setText("");
    }

    React.useEffect(() => {
        getMembers();
        getChatMessages();
    
        socket.emit("joinCommunity", communityId); // Join the community on mount
    
        const handleMessage = (message) => {
            setMessages((prev) => {
                if (prev.some((msg) => msg.tempId === message.tempId)) return prev;
                return [...prev, {
                    ...message,
                    senderId: {
                        _id: message.senderId,
                        name: message.photoName[0].name,
                        profilePicture: message.photoName[0].profilePicture
                    }
                }];
            });
            // console.log(messages)
        };
        
        socket.off("receiveCommunityMessage").on("receiveCommunityMessage", handleMessage);
    
        return () => {
            socket.emit("leaveCommunity", communityId); // Leave the community on unmount
            socket.off("receiveCommunityMessage", handleMessage); // Cleanup event listener
        };
    }, [communityId]);
    
    React.useEffect(()=>{
        // console.log(messages)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    

    return (
    <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
            <img
                src={communityImage}
                alt="Profile"
                className="w-10 h-10 rounded-full"
            />
            <div>
                <h2 className="text-lg font-semibold">{communityTitle}</h2>
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
                        message.senderId._id === userId ? "justify-end" : ""
                    }`}
                >
                {message.senderId._id !== userId && (
                    <img
                        src={message.senderId.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-3"
                    />
                )}
                <div>
                    <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-sm">
                            {message.senderId.name}
                        </span>
                        <span className="text-xs text-gray-500">4:06 PM</span>
                        </div>
                    <div
                        className={`p-3 rounded-lg mt-1 max-w-xs ${
                            message.senderId._id === userId
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
    )
}
