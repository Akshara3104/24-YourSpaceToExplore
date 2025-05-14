import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function MessagesHome() {

  const name = localStorage.getItem('name')
  const userId = localStorage.getItem('userId')

  const navigate = useNavigate()


  const [people, setPeople] = React.useState([])

  const getPeople = async ()=>{

    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/message/getPeople`, {userId})

    setPeople(res.data.recentChats)

  }

  React.useEffect(()=>{
    getPeople()
  }, [userId])

  return (
    <div className='m-3'>
      <div className=''>{name}'s' Messages</div> 
      {
        people.map((chat, i)=>(
          <div 
            className='p-3 bg-info rounded cursor-pointer w-auto mb-2' 
            key={i} 
            onClick={()=>navigate(`/nquery/chat/${chat._id}`, {state:{targetName: chat.name}})}
          >
            {chat.name}
          </div>
        ))
      }
    </div>
  )
}
