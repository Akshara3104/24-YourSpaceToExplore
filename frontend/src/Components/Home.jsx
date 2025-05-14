import React from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const [name, setName] = React.useState('')

  const navigate = useNavigate();

  React.useEffect(()=>{
    setName(localStorage.getItem('name'))
  }, [])
  return (
    <div className='p-4'>
      This is home {name}

      <button className='btn btn-primary m-3' onClick={()=>navigate('/nquery/messages')}>Messages</button>
    </div>
  )
}
