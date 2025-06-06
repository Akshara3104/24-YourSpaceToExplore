import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotLoggedIn() {

    const navigate = useNavigate()

    return (
        <div className='section d-flex flex-column justify-center items-center h-full gap-3'>
            <div className='fs-4'>Seems like you are not logged in !!!</div>
            <div 
                className='px-3 py-2 text-xl rounded bg-gradient-to-r from-orange-500 to-red-500 cursor-pointer'
                onClick={()=>navigate('/login')}
            >
                Login
            </div>
        </div>
    )
}
