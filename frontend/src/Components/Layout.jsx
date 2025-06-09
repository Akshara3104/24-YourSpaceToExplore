import { Outlet, useNavigate } from 'react-router-dom'
import { House, MessageCircle, Tag, Users, Search, Bell } from 'lucide-react'
import NotLoggedIn from './NotLoggedIn'
import { ToastContainer } from 'react-toastify'


export default function Layout() {


    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')
    const token = localStorage.getItem('token')
    const profilePicture = localStorage.getItem('profilePicture')

    const navigate = useNavigate()

    const logout = ()=>{
        localStorage.removeItem('userId')
        localStorage.removeItem('name')
        localStorage.removeItem('token')
        localStorage.removeItem('profilePicture')
        navigate('/')
    }

    if(!userId){
        return(
            <div className='h-screen p-4 bg-black'>
                <NotLoggedIn />
            </div>
        )
    }

    return (
    <div className='vh-100 bg-black d-flex'>
        <div className='w-20 m-3 d-flex flex-column justify-between section border-radius py-3'>
        <div className='m-2 mx-auto d-flex flex-column gap-3 items-center'>
            <div className='w-fit rounded cursor-pointer' onClick={()=>navigate('/24')}>
                <img 
                    className='px-3'
                    src='/images/Logo3.png'
                />
            </div>
        </div>
        <div className='m-2 mx-auto d-flex flex-column gap-3 items-center'>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24')}>
                <House />
            </div>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24/messages')}>
                <MessageCircle />
            </div>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24/communities')}>
                <Users />
            </div>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24/search')}>
                <Search />
            </div>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24/explore')}>
                <Tag />
            </div>
            <div className='w-fit p-2 rounded cursor-pointer hover:bg-gradient-to-r from-orange-400 to-red-500 hover:scale-110 transition' onClick={()=>navigate('/24/notifications')}>
                <Bell />
            </div>
        </div>
        <div className='m-2 mx-auto d-flex flex-column gap-3 items-center'>
            <img  
                src={profilePicture || '/images/DefaultProfile.jpg'} 
                alt='No photo' 
                className='w-12 h-12 rounded-full cursor-pointer mb-2'
                spellCheck={false}
                onClick={()=>navigate('/24/me/profile')}
            />
        </div>
        </div>


        <div className='w-full my-3 me-3 overflow-y-scroll outlet flex-1'>
        <Outlet />
        </div>
        <ToastContainer />
    </div>
    )
}
