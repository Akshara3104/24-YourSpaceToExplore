import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RegisterPhoto from '../Assests/RegisterPhoto.jpg'
import { toast, ToastContainer } from 'react-toastify'
import toastSettings from './toastSettings'


export default function Login() {

    const [data, setData] = React.useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleChange = (e)=>{
        const {name, value} = e.target
        setData(prev=>{
            return{
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {data})
            .then(res=>{
                if(res.data.success){
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('name', res.data.name)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('profilePicture', res.data.profilePicture)
                    setTimeout(()=>{
                        toast('Login successful', toastSettings)
                        navigate('/24')
                    }, 1500)
                }else{
                    console.log(res.data.message)
                }
            })
            .catch(err=>console.log(err))
    }

    return(
        <div className="min-h-screen bg-neutral-900 text-white font-['Inter']">
        <div className="mx-auto max-w-8xl min-h-screen flex flex-col">

            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Sign In</h1>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={handleChange}
                                    value={data.email}
                                    required
                                />
                            </div>

                            <div className='my-3'>
                                <label className="block text-sm text-gray-300 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={handleChange}
                                    value={data.password}
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-md text-white hover:opacity-90 transition"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <p className="text-gray-400">
                                Don't have an account?{" "}
                                <span 
                                    onClick={() => navigate("/register")} 
                                    className="text-orange-400 hover:underline cursor-pointer"
                                >
                                    Sign up
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <ToastContainer />
    </div>
  )
}
