import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NotLoggedIn from './NotLoggedIn'; // Assuming this component handles the not-logged-in state

export default function LandingPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    // If user is not logged in, render the NotLoggedIn component
    if (!userId) {
        return <NotLoggedIn />;
    }

    return (
        <div className="section text-white bg-gradient-to-br from-zinc-950 to-zinc-800 min-h-screen overflow-y-auto">
            {/* Hero Section */}
            <section id="hero" className="relative section flex items-center justify-center h-[70vh] md:h-[80vh] px-6 py-20 bg-cover bg-center text-center overflow-hidden section"
                style={{ backgroundImage: "url('/images/Hero3.jpg')" }} // Placeholder background image
            >
                <div className="absolute inset-0 bg-black opacity-70"></div> {/* Overlay for readability */}
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
                        Connect. Share. Discover. Your World, on <span className="text-purple-400">24</span>.
                    </h1>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
                        Experience a vibrant community designed for authentic interactions and meaningful connections. Join the future of social networking today.
                    </p>
                    <button
                        onClick={() => navigate('/24/explore')}
                        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 noSelect text-lg animate-fade-in-up delay-200"
                    >
                        Explore 24
                    </button>
                </div>
            </section>

            {/* Why Choose 24? (Features Overview) */}
            <section id="features" className="py-20 px-6 bg-zinc-900">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Why 24 is Your Next Social Home.</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="feature-card bg-zinc-800 p-8 rounded-xl shadow-lg hover:bg-zinc-700 transition-all duration-300 transform hover:-translate-y-2">
                            <i className="fas fa-handshake text-5xl text-purple-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Authentic Connections</h3>
                            <p className="text-gray-300">Build genuine relationships with people who truly share your interests and values.</p>
                        </div>
                        <div class="feature-card bg-zinc-800 p-8 rounded-xl shadow-lg hover:bg-zinc-700 transition-all duration-300 transform hover:-translate-y-2">
                        <i class="fas fa-comments text-5xl text-blue-400 mb-4"></i>
                        <h3 class="text-2xl font-semibold mb-3">Engaging Conversations</h3>
                        <p class="text-gray-300">Connect through vibrant discussions, comments, and direct messages with your community.</p>
                    </div>
                        <div className="feature-card bg-zinc-800 p-8 rounded-xl shadow-lg hover:bg-zinc-700 transition-all duration-300 transform hover:-translate-y-2">
                            <i className="fas fa-compass text-5xl text-blue-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Discover Your Passions</h3>
                            <p className="text-gray-300">Explore diverse communities, find new hobbies, and engage with content you love.</p>
                        </div>
                        <div className="feature-card bg-zinc-800 p-8 rounded-xl shadow-lg hover:bg-zinc-700 transition-all duration-300 transform hover:-translate-y-2">
                            <i className="fas fa-lock text-5xl text-green-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Private & Secure</h3>
                            <p className="text-gray-300">Your privacy is paramount. We provide robust controls over your data and interactions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How 24 Works (Simple Steps) */}
            <section id="how-it-works" className="py-20 px-6 bg-zinc-950">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Getting Started on 24 is Easy.</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="step-card p-8 rounded-xl bg-zinc-800 shadow-lg border border-zinc-700">
                            <div className="text-5xl text-purple-400 mb-4 font-bold">1</div>
                            <i className="fas fa-user-circle text-6xl text-purple-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Create Your Profile</h3>
                            <p className="text-gray-300">Personalize your space on **24** and let your unique personality shine.</p>
                        </div>
                        <div className="step-card p-8 rounded-xl bg-zinc-800 shadow-lg border border-zinc-700">
                            <div className="text-5xl text-pink-400 mb-4 font-bold">2</div>
                            <i className="fas fa-users text-6xl text-pink-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Connect & Engage</h3>
                            <p className="text-gray-300">Find friends, join vibrant communities, and start meaningful conversations.</p>
                        </div>
                        <div className="step-card p-8 rounded-xl bg-zinc-800 shadow-lg border border-zinc-700">
                            <div className="text-5xl text-blue-400 mb-4 font-bold">3</div>
                            <i className="fas fa-camera text-6xl text-blue-400 mb-4"></i>
                            <h3 className="text-2xl font-semibold mb-3">Share Your Moments</h3>
                            <p className="text-gray-300">Post updates, photos to share your journey with the world.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Spotlight */}
            <section id="community" className="py-20 px-6 bg-zinc-900">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">Join a Thriving Community on 24.</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="testimonial-card bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-700">
                            <img src="/images/Deepak.jpg" alt="User Avatar" className="testimonial-avatar w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-500"/>
                            <p className="testimonial-quote text-gray-300 italic mb-4">"24 has helped me connect with so many amazing people who share my passion for sustainable living!"</p>
                            <span className="testimonial-name font-semibold text-purple-300">- Deepak</span>
                        </div>
                        <div className="testimonial-card bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-700">
                            <img src="/images/Bhaskar.jpg" alt="User Avatar" className="testimonial-avatar w-20 h-20 rounded-full mx-auto mb-4 border-2 border-pink-500"/>
                            <p className="testimonial-quote text-gray-300 italic mb-4">"The community features on 24 are fantastic. I've found a great photography club here!"</p>
                            <span className="testimonial-name font-semibold text-pink-300">- Bhaskar</span>
                        </div>
                        <div className="testimonial-card bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-700">
                            <img src="/images/Prasad.jpg" alt="User Avatar" className="testimonial-avatar w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500"/>
                            <p className="testimonial-quote text-gray-300 italic mb-4">"Finally, a social platform that prioritizes genuine connection over endless scrolling. Thank you, 24!"</p>
                            <span className="testimonial-name font-semibold text-blue-300">- Prasad</span>
                        </div>
                    </div>
                    <div className="community-stats grid md:grid-cols-3 gap-6 bg-zinc-800 p-8 rounded-xl shadow-inner border border-zinc-700">
                        <div className="stat-item">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">1.2M+</h3>
                            <p className="text-gray-400">Connections Made</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">500+</h3>
                            <p className="text-gray-400">Active Communities</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">10K+</h3>
                            <p className="text-gray-400">New Users Daily</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discover What You Love (Content Categories/Topics) */}
            <section id="discover" className="py-20 px-6 bg-zinc-950">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">Explore a World of Interests on 24.</h2>
                    <p className="text-gray-300 text-lg mb-12">Dive into communities dedicated to your favorite topics or discover something entirely new.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {['Photography', 'Travel', 'Software Development', 'Books', 'Fitness', 'Music', 'Finance', 'Art'].map((category, index) => (
                            <div key={index} className="category-card bg-zinc-800 p-4 rounded-xl shadow-md hover:bg-zinc-700 transition-all duration-300 group cursor-pointer border border-zinc-700">
                                <img src={`/images/${category}.jpeg`} alt={`${category} Category`} className="rounded-lg mb-4 w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
                                <h4 className="text-xl font-semibold text-purple-300 group-hover:text-purple-400">{category}</h4>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16">
                        <button
                            onClick={() => navigate('/24/explore')}
                            className="btn-secondary bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 noSelect text-lg"
                        >
                            Explore communities on 24
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-900 text-gray-400 py-12 px-6 shadow-inner">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10 text-center md:text-left">
                    {/* Left Column: Logo and Tagline - Kept as is */}
                    <div className="flex flex-col items-center justify-end md:w-1/3">
                        <img
                            src='/images/Logo1.png'
                            alt='App Logo'
                            className='w-20 mb-4'
                        />
                        <p className="text-gray-400 text-md mb-3 leading-relaxed">Your Space To Explore</p>
                        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} 24. All rights reserved.</p>
                    </div>

                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                        <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-3">Quick Links</h4>
                        <ul className="space-y-3"> {/* Increased space-y for better visual separation */}
                            <li><Link to="/24/home" className="hover:text-orange-400 transition-colors duration-200 text-lg">Home</Link></li>
                            <li><Link to="/24/messages" className="hover:text-orange-400 transition-colors duration-200 text-lg">Messages</Link></li>
                            <li><Link to="/24/communities" className="hover:text-orange-400 transition-colors duration-200 text-lg">Communities</Link></li>
                            <li><Link to="/24/search" className="hover:text-orange-400 transition-colors duration-200 text-lg">Search</Link></li>
                            <li><Link to="/24/notifications" className="hover:text-orange-400 transition-colors duration-200 text-lg">Notifications</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}