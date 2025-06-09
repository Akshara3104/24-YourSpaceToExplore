import axios from 'axios'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ExploreAccounts() {


    const [users, setUsers] = React.useState([])
    const [communities, setCommunities] = React.useState([])

    const tag = useParams().tag

    const navigate = useNavigate()

    const fetchData = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/fetchByTags`, { tag })
            setUsers(res.data.users)
            setCommunities(res.data.communities)
        } catch (error) {
            console.log('Error occured')
        }
    }
    const [activeTab, setActiveTab] = React.useState('people');
    
    React.useEffect(()=>{
        fetchData()
    }, [])

    return (
        <div className='p-4 section h-full d-flex w-full'>
            <div
                key={tag}
                className="relative rounded-lg overflow-hidden flex-1 my-auto"
                style={{ aspectRatio: '4 / 3' }}
            >
                <div className="flex justify-center mb-3">
                    <h2 className="text-2xl font-semibold mb-6 relative underline-orange">
                        Explore {tag}
                    </h2>
                </div>
                <img
                    src={`/images/${tag}.jpeg`}
                    alt={tag}
                    className="object-cover w-full h-full rounded-lg transition brightness-50"
                />  
            </div>            
            <div className="p-3 w-full flex-1">
            {/* Toggle Tabs */}
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

            {/* People Section */}
            {activeTab === 'people' && (
                <>
                {users.length > 0 ? users.map((user, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-gradient-to-r from-orange-500 to-orange-500 rounded-xl shadow-md cursor-pointer transition my-2 hover:scale-[1.02]"
                        onClick={() => navigate(`/24/${user.name}/profile`, {
                            state: { targetId: user._id }
                        })}
                    >
                        {/* Profile Image */}
                        <img
                            src={user.profilePicture}
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
                        className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-gradient-to-r from-orange-500 to-orange-500 rounded-xl shadow-md cursor-pointer transition my-2 hover:scale-[1.02]"
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
        </div>
    )
}
