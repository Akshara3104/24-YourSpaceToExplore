import React from 'react'
import axios from 'axios'

export default function Notifications() {

    const userId = localStorage.getItem('userId')

    const [opened, setOpened] = React.useState([])
    const [notOpened, setNotOpened] = React.useState([])


    const getNotifications = async()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getNotifications`, { userId })
            setOpened(res.data.opened)
            setNotOpened(res.data.notOpened)
            console.log(res.data)   
        } catch (error) {
            console.log(error.message)
            return null
        }
    }

    const makeAllRead = async()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/makeAllRead`, { userId })
        } catch (error) {
            console.log(error.message)
            return null
        }
    }

    React.useEffect(()=>{
        getNotifications()
        makeAllRead()
    }, [])

    return (
        <div className="p-6 section h-full overflow-scroll">
            <div className="flex justify-center my-4">
                <h2 className="text-3xl font-semibold relative underline-orange">
                    Notifications
                </h2>
            </div>

            {
            opened.length===0 && notOpened.length===0 ?
            <div className='text-center'>
                No notifications
            </div>
            :
        
            <>
            <div className='w-50 mx-auto'>
            {notOpened.map((n, index) => (
                <div
                key={index}
                className='relative flex items-start gap-4 p-4 rounded-xl shadow-md transition my-2 bg-neutral-800'
                >
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></span>
                    <img
                        src={n.profilePicture || '/images/DefaultProfile.jpg'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                        />
                    <div className="flex flex-col w-full">
                        <span className="text-white text-sm">
                            <b>{n.name}</b>
                            {n.type === "follow" && ( <> started following you</> )}
                            {n.type === "like" && ( <> liked your post.</> )}
                            {n.type === "comment" && ( 
                                <> commented on your post : {n.comment}
                                </> 
                            )}
                        </span>
                        <span className="text-gray-300 text-xs mt-1 ms-auto">
                            {new Date(n.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
            </div>
            <div className='w-50 mx-auto'>
            {opened.map((n, index) => (
                <div
                key={index}
                className='flex items-start gap-4 p-4 rounded-xl shadow-md transition my-2 bg-neutral-800'
                >
                    <img
                        src={n.profilePicture || '/images/DefaultProfile.jpg'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                        />
                    <div className="flex flex-col w-full">
                        <span className="text-white text-sm">
                            <b>{n.name}</b>
                            {n.type === "follow" && ( <> started following you</> )}
                            {n.type === "like" && ( <> liked your post.</> )}
                            {n.type === "comment" && ( 
                                <> commented on your post : {n.comment}
                                </> 
                            )}
                        </span>
                        <span className="text-gray-300 text-xs mt-1 ms-auto">
                            {new Date(n.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>
                ))}
            </div>
            </>
            }
        </div>
    )
}
