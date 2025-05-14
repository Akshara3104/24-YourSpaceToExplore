import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Start() {


  const navigate = useNavigate()


  return (
    <div>
      Start page
      <button onClick={()=>navigate('/nquery')} className='btn btn-primary p-2 m-2'>Enter</button>
      <button onClick={()=>navigate('/login')} className='btn btn-primary p-2 m-2'>Login</button>
    </div>
  )
}
