    import React, { useState } from 'react';
    import { Outlet, useNavigate } from 'react-router-dom';
    import axios from 'axios';
import NotLoggedIn from './NotLoggedIn';

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

    if(!userId){
        return(
            <NotLoggedIn />
        )
    }

    return (
        <div className="flex h-full">
        <div className="w-80 shadow flex flex-col section">
            <div className="flex justify-center p-4 mt-2 noSelect">
				<h2 className="text-2xl font-semibold relative underline-orange">
					Conversations
				</h2>
			</div>
            <div className="flex flex-col space-y-4 px-4 py-2">
            {people.map((friend, index) => (
                <div
                key={index}
                className="flex items-center space-x-3 p-2 hover:bg-gradient-to-r from-orange-500 to-red-500 rounded-lg cursor-pointer hover:scale-105 transition"
                onClick={()=>navigate(`/24/messages/${friend._id}`, 
                    {state:{targetName: friend.name, targetProfilePicture: friend.profilePicture}})}
                >
                <div className="relative">
                    <img
                    src={friend.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                    />
                </div>
                <span className="text-md font-medium">{friend.name}</span>
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