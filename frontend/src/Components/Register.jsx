import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import toastSettings from './toastSettings';

export default function Register() {
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, data);

            if (res.data.success) {
                toast.success('Sign Up successful! Redirecting to login...', toastSettings);
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error(res.data.message || 'Registration failed. Please try again.', toastSettings);
            }
        } catch (error) {
            toast.error('An error occurred during registration. Please try again.', toastSettings);
        } finally {
            setData({
                name: '',
                email: '',
                password: ''
            });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-['Inter'] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-5xl rounded-2xl flex flex-col md:flex-row-reverse overflow-hidden">

                {/* Right Section: Branding Image & Text (on left for register) */}
                <div className="relative w-full md:w-1/2 hidden md:flex items-center justify-center p-4 rounded-l-2xl">
                    <div className="flex flex-col items-center text-center">
                        <img
                            className='w-48 lg:w-50 drop-shadow-lg animate-float'
                            src='/images/Logo3.png'
                            alt='App Logo'
                        />
                        <div className='mt-6 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 bg-clip-text text-transparent leading-tight'>
                            Your Space To Explore
                        </div>
                    </div>
                </div>

                {/* Left Section: Form */}
                <main className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-white mb-6 text-center md:text-left">Create Your Account</h1>

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
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
                                onChange={handleChange}
                                value={data.name}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter a secure password"
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
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                className="text-purple-400 hover:underline cursor-pointer font-medium"
                            >
                                Sign in
                            </span>
                        </p>
                    </div>
                </main>
            </div>
            <ToastContainer /> 
        </div>
    );
}