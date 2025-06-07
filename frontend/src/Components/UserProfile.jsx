import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader';
import PostModal from './PostModal'

export default function UserProfile() {

    const location = useLocation()
    const navigate = useNavigate()

    const userId = localStorage.getItem('userId')
    const profilePicture = localStorage.getItem('profilePicture')
    const name = localStorage.getItem('name')

    const [user, setUser] = React.useState(null)
    const [posts,setPosts] = React.useState([])
    const [isFollowing, setIsFollowing] = React.useState(false)

    const [showConnectionModal, setShowConnectionModal] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("");
    const [modalUsers, setModalUsers] = React.useState([]);

    const [selectedPost, setSelectedPost] = React.useState(null);

    const { targetId } = location.state

    const fetchProfile = async () => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserProfile`, {userId, targetId});
			setUser(res.data.userProfile);
			setPosts(res.data.userProfile.posts);
            setIsFollowing(res.data.isFollowing)
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	};

    const handleShowConnections = async (type) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getConnections`, {
                targetId,
                type,
            });
            console.log(res.data)
            setModalUsers(res.data.users);
            setModalTitle(type);
            setShowConnectionModal(true);
        } catch (err) {
            console.error("Error fetching connections", err);
        }
    };


    const handleFollow = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/toggleFollow`, { userId, targetId, isFollowing })
            setIsFollowing(res.data.isFollowing)
        } catch (error) {
            console.log(error.message)
        }
    }


    React.useEffect(()=>{
        fetchProfile()
    }, [targetId, isFollowing])


    const ConnectionModal = ()=> {
        return(
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#161616] rounded-lg p-6 w-1/4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-center">
                            <h2 className="text-xl font-semibold text-center relative underline-orange">
                                {modalTitle}
                            </h2>
                        </div>
                        <button onClick={() => setShowConnectionModal(false)} className="text-gray-300 hover:text-white text-xl">&times;</button>
                    </div>

                    {modalUsers.length === 0 ? (
                        <p className="text-gray-400 text-center">No users found</p>
                    ) : (
                        <ul className="space-y-3">
                            {modalUsers.map(item => (
                                <li 
                                    key={item._id} 
                                    className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 transition hover:scale-[1.02] p-2 rounded"
                                    onClick={() => {
                                        if(modalTitle==='Communities'){
                                        navigate(`/nquery/community/${item._id}`, { state: { communityId: item._id } });
                                        }
                                        else if(item._id !== userId){
                                        navigate(`/nquery/${item.name}/profile`, { state: { targetId: item._id } });
                                        }
                                        setShowConnectionModal(false);
                                    }}
                                >
                                    <img src={item.profilePicture || '/images/DefaultProfile.jpg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="text-white font-medium">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }


    if (!user) 
		return <div className="w-full h-full d-flex justify-center items-center"><Loader /></div>;


    return (
        <div className="w-full h-full mx-auto p-4 section d-flex flex-column items-center overflow-y-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-white p-6 rounded-xl">
                {/* Left: Profile Picture */}
                <div className="w-40 h-40 flex-shrink-0">
                    <img
                    src={user.profilePicture || '/images/DefaultProfile.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-4 border-zinc-700 shadow-md"
                    />
                </div>

                {/* Right: Info Section */}
                <div className="flex-1">
                    {/* Name & Bio */}
                    <div className="mb-2">
                        <h2 className="text-3xl font-bold">{user.name}</h2>
                        <p className="text-gray-400">{user.bio || "No bio available"}</p>
                    </div>

                    {/* Stats: Followers, Following, Posts */}
                    <div className="flex flex-wrap gap-6 text-gray-300 mb-3">
                        <div
                            onClick={() => handleShowConnections("Followers")}
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-zinc-800 transition hover:bg-gradient-to-r from-orange-500 to-red-500 "
                        >
                            <strong className="text-white text-xl">{user.followersCount}</strong> Followers
                        </div>
                        <div
                            onClick={() => handleShowConnections("Following")}
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-zinc-800 transition hover:bg-gradient-to-r from-orange-500 to-red-500 "
                        >
                            <strong className="text-white text-xl">{user.followingCount}</strong> Following
                        </div>
                        <div
                            onClick={() => handleShowConnections("Communities")}
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-zinc-800 transition hover:bg-gradient-to-r from-orange-500 to-red-500 "
                        >
                            <strong className="text-white text-xl">{user.communitiesCount}</strong> communities
                        </div>
                        <div className="px-2 py-1 rounded-md">
                            <strong className="text-white text-xl">{posts.length}</strong> Posts
                        </div>
                    </div>


                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mb-4">
                    <button
                        className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white px-4 py-2 rounded-lg transition"
                        onClick={() =>
                        navigate(`/nquery/messages/${targetId}`, {
                            state: {
                            targetName: user.name,
                            targetProfilePicture: user.profilePicture,
                            },
                        })
                        }
                    >
                        Message
                    </button>
                    {isFollowing ? (
                        <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        onClick={handleFollow}
                        >
                        Unfollow
                        </button>
                    ) : (
                        <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                        onClick={handleFollow}
                        >
                        Follow
                        </button>
                    )}
                    </div>

                    {/* Career Interests */}
                    <div className="flex flex-wrap gap-2">
                    {user.careerInterests.map((item, i) => (
                        <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-gray-100"
                        >
                        {item}
                        </span>
                    ))}
                    </div>
                </div>
            </div>

            <hr />
			<div className="flex justify-center">
                <h2 className="text-2xl font-semibold relative underline-orange">
                    Posts
                </h2>
            </div>
            
            <div className='w-2/3  h-full'>
                <div className="my-6 grid grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <div 
                            key={post._id} 
                            className="relative bg-gray-900 rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={()=>setSelectedPost(post)}
                        >
                            {
                                post.image &&
                                <div className="w-full aspect-square overflow-hidden">
                                    <img 
                                        src={post.image} 
                                        alt="Post" 
                                        className="w-full h-full object-cover"
                                        />
                                </div>
                            }

                            <div className={`w-full text-center text-white bg-black/70 p-3 ${post.image ? 'line-clamp-2' : 'line-clamp-6'}`}>
                                {post.caption}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            { showConnectionModal && <ConnectionModal /> }
            

            <PostModal 
                post={selectedPost} 
                isOpen={!!selectedPost} 
                onClose={() => setSelectedPost(null)} 
                user={user}
                userId={userId}
                name={name}
                profilePicture={profilePicture}
                type='user'
            />

        </div>
    )
}
