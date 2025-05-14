import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MessageHome = () => {


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
    <div className="flex h-screen">
      <div className="w-64 shadow flex flex-col">
        <div className="p-4 flex items-center space-x-3">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          {people.map((friend, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={()=>navigate(`/nquery/messages/${friend._id}`, 
                {state:{targetName: friend.name, targetProfilePicture: friend.profilePicture}})}
            >
              <div className="relative">
                <img
                  src={friend.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <span className="text-sm font-medium">{friend.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='h-100 flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default MessageHome;