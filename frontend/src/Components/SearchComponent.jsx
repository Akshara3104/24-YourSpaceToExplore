import React from 'react'
import { Search } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from './GlobalContext'
import NotLoggedIn from './NotLoggedIn'


export default function SearchComponent() {

    const { query, setQuery, searchUsers, searchCommunities, setSearchUsers, setSearchCommunities } = useGlobalContext()

    const navigate = useNavigate()

    const userId = localStorage.getItem('userId')

    const searchFunction = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/search`, { query })
            setSearchUsers(res.data.users)
            setSearchCommunities(res.data.communities)
        } catch (error) {
            return null
        }
    }


    const SearchRender = ({ users, communities }) => {
        const [activeTab, setActiveTab] = React.useState('people');

        return (
            <div className="p-3 w-full max-w-xl overflow-y-auto tailwind-scrollbar-hide scrollbarNone">
            <div className="flex justify-center gap-4 mb-4">
                <div className="flex justify-center p-4 mt-2 cursor-pointer" onClick={() => setActiveTab('people')}>
                    <h2 className={`text-2xl font-semibold relative ${activeTab==='people' && 'underline-orange'}`}>
                        People
                    </h2>
                </div>
                <div className="flex justify-center p-4 mt-2 cursor-pointer" onClick={() => setActiveTab('communities')}>
                    <h2 className={`text-2xl font-semibold relative ${activeTab==='communities' && 'underline-orange'}`}>
                        Communities
                    </h2>
                </div>
            </div>

            {activeTab === 'people' && (
                <>
                {users.length > 0 ? users.map((user, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md cursor-pointer transition my-2 hover:scale-105"
                        onClick={() => {
                            if(userId!==user._id){
                            navigate(`/24/${user.name}/profile`, {
                            state: { targetId: user._id }
                        })}}}
                    >
                        {/* Profile Image */}
                        <img
                            src={user.profilePicture || '/images/DefaultProfile.jpg'}
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover"
                        />

                        {/* Text Content */}
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-white">{user.name}</span>
                            <p className="text-sm line-clamp-2 max-w-md">
                            {user.bio || "This user hasn’t added a bio yet."}
                            </p>
                        </div>
                    </div>
                )) : <div className="text-gray-400">No users found.</div>}
                </>
            )}

            {/* Communities Section */}
            {activeTab === 'communities' && (
                <>
                {communities.length > 0 ? communities.map((community, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md cursor-pointer transition my-2 hover:scale-105"
                        onClick={() => navigate(`/24/community/${community._id}`, {
                        state: { communityId: community._id }
                        })}
                    >
                        {/* Profile Image */}
                        <img
                            src={community.image}
                            alt="Community"
                            className="w-14 h-14 rounded-full object-cover"
                        />

                        {/* Text Content */}
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-white">{community.title}</span>
                            <p className="text-sm line-clamp-2 max-w-md">
                            {community.description || "This user hasn’t added a bio yet."}
                            </p>
                        </div>
                    </div>
                )) : <div className="text-gray-400">No communities found.</div>}
                </>
            )}
            </div>
        );
    };

    if(!userId){
        return(
            <NotLoggedIn />
        )
    }


    return (
        <div className="section h-full w-full flex flex-col items-center justify-start p-6">
            <div className="flex gap-2 w-full max-w-xl justify-center">
                <input 
                    className="p-2 ps-4 w-full bg-neutral-600 text-white outline-none rounded-md"
                    type="text"
                    placeholder="Search for users, communities"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Search 
                    onClick={() => searchFunction()} 
                    className="p-2 rounded bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 cursor-pointer" 
                />
            </div>

            <SearchRender 
                users={searchUsers} 
                communities={searchCommunities} 
            />
        </div>
    )
}
