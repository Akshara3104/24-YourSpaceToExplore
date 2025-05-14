import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RegisterPhoto from '../Assests/RegisterPhoto.jpg'


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
        axios.post(`http://localhost:3001/auth/login`, {data})
            .then(res=>{
                console.log(data)
                console.log(res.data)
                if(res.data.success){
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('name', res.data.name)
                    localStorage.setItem('userId', res.data.userId)
                    localStorage.setItem('profilePicture', res.data.profilePicture)
                    navigate('/')
                }else{
                    console.log(res.data.message)
                }
                alert(res.data.message)
            })
            .catch(err=>console.log(err))
    }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
        <div className="mx-auto max-w-8xl min-h-screen flex flex-col">
            <header className="py-4 px-6 flex justify-between items-center border-b border-gray-200">
                <a href="/" className="flex items-center space-x-2">
                    <img src={null} alt="NQuery Logo" className="h-8 w-auto" />
                    <span className="text-xl font-semibold text-gray-900">NQuery</span>
                </a>
            </header>

            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-6xl grid grid-cols-2 gap-16">
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-12">
                        <img src={RegisterPhoto} alt="signin" className="w-full h-auto object-contain" />
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in</h1>

                        <form className="space-y-2">
                            <p className="text-gray-600 mb-1">Enter your email</p>
                            <div>
                                <input 
                                    type="email" 
                                    name='email'
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                                    onChange={handleChange}
                                    value={data.email}
                                    />
                            </div>
                            <p className="text-gray-600 mb-2">Enter password</p>
                            <div>
                                <input 
                                    type="password" 
                                    name='password'
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom focus:border-custom" 
                                    onChange={handleChange}
                                    value={data.password}
                                />
                            </div>

                            <button 
                                className="w-full bg-[#465a65] p-2 rounded text-white my-3"
                                onClick={handleSubmit}
                            >
                                Sign in
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 text-gray-500 bg-gray-50">OR</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" 
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 !rounded-button hover:bg-gray-50">
                                    <i className="fab fa-apple mr-2"></i>
                                    Continue with Apple
                                </button>
                                <button type="button" 
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 !rounded-button hover:bg-gray-50">
                                    <i className="fab fa-google mr-2"></i>
                                    Continue with Google
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">Don't have an account?</p>
                            <a href="#" className="text-custom hover:underline">Sign up</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}
