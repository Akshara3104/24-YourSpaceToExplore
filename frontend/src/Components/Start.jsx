import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Start() {

    const navigate = useNavigate()

    return (
        <div className='p-4 h-screen bg-black'>
        <div className='h-full bg-neutral-800 rounded d-flex flex-col justify-center items-center gap-3'>
            <div className='text-5xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>NQuery</div>
            <img
                className='w-40 py-3'
                style={{filter: 'invert(1)'}}
                src='/images/Logo.png' 
            />
            <div className='text-2xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>Ask.Connect.Grow</div>
            <div className='d-flex'>
                <button onClick={()=>navigate('/nquery')} className='text-xl rounded bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 m-2 hover:opacity-90'>Enter</button>
                <button onClick={()=>navigate('/login')} className='text-xl rounded bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 m-2 hover:opacity-90'>Login</button>
            </div>
        </div>
        </div>
    )
}
