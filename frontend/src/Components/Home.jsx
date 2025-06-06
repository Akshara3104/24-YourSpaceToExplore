import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotLoggedIn from './NotLoggedIn';

export default function LandingPage() {

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId')

    if(!userId){
        return(
            <NotLoggedIn />
        )
    }

    return (
        <div className="section text-white bg-zinc-900 h-full overflow-y-auto">
        {/* Hero Section */}
            <section className="text-center py-20 px-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <h1 className="text-5xl font-bold mb-4">Welcome to NQuery</h1>
                <p className="text-xl mb-6 max-w-2xl mx-auto">
                Discover diverse careers, connect with mentors, and grow with a like-minded student community.
                </p>
                <button
                onClick={() => navigate('/nquery/explore')}
                className="bg-white text-black font-semibold py-2 px-6 rounded hover:bg-gray-200 transition noSelect"
                >
                Get Started
                </button>
            </section>

            {/* About the App */}
            <section className="py-16 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">What is NQuery?</h2>
                <p className="text-gray-300 text-lg">
                NQuery is a platform that helps students (14+) explore career paths beyond STEM, find mentorship, and connect with peers across fields like technology, art, literature, and more.
                </p>
            </section>

            {/* Features */}
            <section className="py-12 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center">
                {[
                { title: "Explore Careers", emoji: "🔍" },
                { title: "Find Mentors", emoji: "🎓" },
                { title: "Ask Questions", emoji: "❓" },
                { title: "Join Communities", emoji: "👥" },
                { title: "Build Connections", emoji: "🤝" },
                { title: "Chat Privately", emoji: "💬" },
                ].map((item, i) => (
                <div key={i} className="bg-zinc-800 p-6 rounded-xl shadow hover:scale-105 transition noSelect hover:bg-gradient-to-r from-orange-500 to-red-600">
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                ))}
            </section>

            {/* CTA */}
            <section className="text-center py-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <h2 className="text-3xl font-bold mb-4">Start your journey today!</h2>
                <p className="mb-6 text-lg">Explore, connect, and grow with NQuery.</p>
                <button
                    onClick={() => navigate('/nquery/explore')}
                    className="bg-white text-black font-semibold py-2 px-6 rounded hover:bg-indigo-500 noSelect"
                >
                Get Started
                </button>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-950 text-gray-400 text-center py-6 text-sm">
                © {new Date().getFullYear()} NQuery. All rights reserved.
            </footer>
        </div>
    );
}
