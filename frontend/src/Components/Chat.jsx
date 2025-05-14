import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

export default function Chat() {

    const userId = localStorage.getItem('userId')

    const { targetId } = useParams()

    const location = useLocation()

    const { targetName } = location.state

    const [text, setText] = React.useState('')

    const [messages, setMessages] = React.useState([])

    const getMessages = async ()=>{
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/message/getMessages`, {userId, targetId})
        console.log(res)
        setMessages(res.data.messages)
    }

    const sendMessage = async ()=>{
        const messageData = {
            senderId: userId,
            targetId,
            text: text,
            image: "",
        };
      
        socket.emit("sendMessage", messageData);
        setMessages((prev) => [...prev, messageData]); // Optimistic UI update
        setText("");
    }
 
    React.useEffect(()=>{

        getMessages()

        socket.emit("joinRoom", userId);

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });
      
        return () => socket.off("receiveMessage");

    }, [targetId])

  return (
    <div className='my-3 row w-50 mx-auto'>
        <div className='col-12 mx-auto p-3 bg-primary mb-2 text-center text-white fs-4'>{targetName}</div>
        <div className='col-12 row mx-auto'>
        {
            messages.map((message, i)=>{
                if(message.senderId===userId){
                    return(
                        <div className='p-2 mb-1 rounded ms-auto col-8 bg-info' key={i}>
                            {message.text}
                        </div>
                )}
                else{
                    return(
                        <div className='p-2 mb-1 col-8 rounded bg-success text-white' key={i}>
                            {
                            message.image &&
                            <img src={message.image} alt='NA' style={{width: '100px'}}/>
                            }
                            {message.text}
                        </div>
                    )
                }
            })
        }
        </div>
        <br />
        <div className='mx-auto'>
            <input
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className='col-8'
            />
            <button 
                className='btn btn-primary col-4'
                disabled={text===''}
                onClick={()=>sendMessage()}
                >
                Send message
            </button>
        </div>
    </div>
  )
}
