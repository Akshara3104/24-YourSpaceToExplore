import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import toastSettings from './toastSettings';

export default function Login() {
    const [data, setData] = React.useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, { data })
            .then(res => {
                if (res.data.success) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('name', res.data.name);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('profilePicture', res.data.profilePicture);
                    toast.success('Login successful', toastSettings); // Changed to toast.success
                    setTimeout(() => {
                        navigate('/24');
                    }, 1500);
                } else {
                    toast.error(res.data.message || 'Login failed. Please check your credentials.', toastSettings); 
                }
            })
            .catch(err => {
                toast.error('An error occurred. Please try again.', toastSettings);
            });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-['Inter'] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-5xl rounded-2xl flex flex-col md:flex-row overflow-hidden">

                {/* Left Section: Form */}
                <main className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-white mb-6 text-center md:text-left">Sign In</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
                                onChange={handleChange}
                                value={data.email}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
                                onChange={handleChange}
                                value={data.password}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 py-3 rounded-lg text-white font-semibold text-lg shadow-md hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-purple-400 hover:underline cursor-pointer font-medium"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </main>

                {/* Right Section: Branding Image & Text */}
                <div className="relative w-full md:w-1/2 hidden md:flex items-center justify-center p-8 rounded-r-2xl">
                    <div className="flex flex-col items-center text-center">
                        <img
                            className='w-40 lg:w-50 drop-shadow-lg animate-float'
                            src='/images/Logo3.png'
                            alt='App Logo'
                        />
                        <div className='mt-6 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 bg-clip-text text-transparent leading-tight'>
                            Your Space To Explore
                        </div>
                    </div>
                </div>

            </div>
            <ToastContainer />
        </div>
    );
}