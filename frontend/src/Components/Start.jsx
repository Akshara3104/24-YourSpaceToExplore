import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Start() {

    const navigate = useNavigate()

    return (
        <div className='p-4 h-screen bg-black'>
        <div className='h-full bg-neutral-950 rounded d-flex flex-col justify-center items-center gap-3'>
            <img
                className='w-40 shadowLog'
                src='/images/Logo3.png' 
            />
            <div className='text-2xl font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent'>Your Space To Explore</div>
            <div className='d-flex'>
                <button onClick={()=>navigate('/24')} className='text-xl rounded bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 m-2 hover:opacity-90'>Enter</button>
                <button onClick={()=>navigate('/login')} className='text-xl rounded bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 m-2 hover:opacity-90'>Login</button>
            </div>
            <FontAwesomeIcon className='w-20' icon="fa-solid fa-heart" style={{color: "#f97316",}} />
        </div>
        </div>
    )
}
