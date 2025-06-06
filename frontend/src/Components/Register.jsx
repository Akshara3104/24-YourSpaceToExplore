import React from 'react'
import RegisterPhoto from '../Assests/RegisterPhoto.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import toastSettings from './toastSettings'

export default function Register() {

    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        try {
            e.preventDefault()
            if(data.email===''){
                alert('Please enter your email')
                return
            }
            if(data.name===''){
                alert('Please enter your name')
                return
            }
            if(data.password===''){
                alert('Please enter your password')
                return
            }

            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, data)

            if(!res.data.success)   alert(res.data.message)
                
            if(res.data.success){
                toast('Sign Up successful', toastSettings)
                setTimeout(()=>{
                    navigate('/login')
                }, 1000)
            }
        } catch (error) {
            console.log(error)
        }
        setData({
            name: '',
            email: '',
            password: ''
        })
    }

    const handleChange = (e)=>{
        const {name, value} = e.target
        setData(prev=>{
            return {...prev, [name]: value}
        })
    }


    return (

    <div className="min-h-screen bg-neutral-900 text-white">
        <div className="mx-auto max-w-8xl min-h-screen flex flex-col">

            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16">

                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-bold text-white mb-6">Create Your Account</h1>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-1 text-sm text-gray-300">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-300">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className='mb-3'>
                                <label className="block mb-1 text-sm text-gray-300">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Enter a secure password"
                                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-md text-white hover:opacity-90 transition"
                            >
                                Sign Up
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-neutral-900 text-gray-400">OR</span>
                                </div>
                            </div>
                        </form>

                        <div className="mt-4 text-center text-sm">
                            <p className="text-gray-400">
                                Already have an account?{" "}
                                <span 
                                    onClick={() => navigate("/login")} 
                                    className="text-orange-400 hover:underline cursor-pointer"
                                >
                                    Sign in
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}
