import axios from 'axios'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Book, House, MessageCircle, Users, Search, Settings, UsersRound, LogOut } from 'lucide-react'


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


  const handleFile = async (event)=>{

    const file = event.target.files[0]
    if(!file) return 
    console.log(file)

    const data = new FormData()

    data.append('file', file)
    data.append('upload_preset', 'nquery')
    data.append('cloud_name', 'ddjqda8cb')

    const res = await axios.post('https://api.cloudinary.com/v1_1/ddjqda8cb/image/upload', data)

    console.log(res.data.url)

  }

  return (
    <div className='vh-100 bg-slate-400 d-flex'>
      <div className='w-20 m-2 my-2 d-flex flex-column justify-between'>
        <div className='m-2 mx-auto d-flex flex-column gap-3'>
          <div className='w-fit p-2 cursor-pointer' onClick={()=>navigate('/nquery')}>
            <House />
          </div>
          <div className='m-2 cursor-pointer' onClick={()=>navigate('/nquery/messages')}>
            <MessageCircle />
          </div>
          <div className='m-2 cursor-pointer' onClick={()=>navigate('/nquery/communities')}>
            <Users />
          </div>
          <div className='m-2 cursor-pointer' onClick={()=>navigate('/nquery/allcommunities')}>
            <UsersRound />
          </div>
          <div className='m-2 cursor-pointer' onClick={()=>navigate('/nquery/search')}>
            <Search />
          </div>
        </div>
        <div className='d-flex flex-column gap-3 justify-between align-items-center'>
          <div className='m-2 cursor-pointer'>
            <Settings />
          </div>
          <div className='m-2 cursor-pointer' onClick={()=>logout()}>
            <LogOut />
          </div>
          <img  
            src={profilePicture} 
            alt='No photo' 
            className='w-10 rounded-full m-2'
            onClick={()=>navigate('/nquery/me/profile')}
          />
        </div>
      </div>


      <div className='bg-slate-300 w-full overflow-y-scroll overflow-hidden outlet flex-1'>
        <Outlet />
      </div>

    </div>
  )
}
