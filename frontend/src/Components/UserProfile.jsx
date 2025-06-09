import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader'; // Assuming this is your loading spinner component
import PostModal from './PostModal';
import { MessageSquare, UserPlus, UserMinus, Loader2, MapPin, Globe } from 'lucide-react'; // Added icons for location, website, etc.
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastSettings = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
};

export default function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId'); // Current logged-in user's ID
    const profilePicture = localStorage.getItem('profilePicture'); // Current logged-in user's profile picture
    const name = localStorage.getItem('name'); // Current logged-in user's name

    const [user, setUser] = React.useState(null); // The target user's profile data
    const [posts, setPosts] = React.useState([]); // The target user's posts
    const [isFollowing, setIsFollowing] = React.useState(false); // If current user follows target user
    const [isProcessingFollow, setIsProcessingFollow] = React.useState(false); // For follow button state

    const [showConnectionModal, setShowConnectionModal] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("");
    const [modalUsers, setModalUsers] = React.useState([]);

    const [selectedPost, setSelectedPost] = React.useState(null);

    // Ensure targetId is correctly retrieved from location.state
    const { targetId } = location.state || {}; // Add || {} to prevent errors if state is null/undefined

    // Redirect if trying to view self on user profile page
    React.useEffect(() => {
        if (targetId === userId) {
            navigate('/24/my-profile');
        }
    }, [targetId, userId, navigate]);

    const fetchProfile = async () => {
        if (!targetId) {
            console.error("No targetId provided in location state.");
            // Handle error or redirect as appropriate
            return;
        }
        try {
            // Updated backend endpoint to pass userId for isFollowing status
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getUserProfile`, { userId: userId, targetId });
            setUser(res.data.userProfile);
            setPosts(res.data.userProfile.posts);
            setIsFollowing(res.data.isFollowing);
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile. Please try again.", toastSettings);
            setUser(null); // Clear user data on error
        }
    };

    const handleShowConnections = async (type) => {
        if (!userId) { // Ensure logged in to view connections
            toast.info("Please log in to view connections.", toastSettings);
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getConnections`, {
                targetId, // Fetch connections for the TARGET user
                type,
            });
            setModalUsers(res.data.users);
            setModalTitle(type);
            setShowConnectionModal(true);
        } catch (err) {
            console.error("Error fetching connections", err);
            toast.error(`Failed to load ${type}.`, toastSettings);
        }
    };

    const handleFollow = async () => {
        if (!userId) {
            toast.error("You must be logged in to follow users.", toastSettings);
            return;
        }
        if (isProcessingFollow) return; // Prevent double clicks

        setIsProcessingFollow(true);
        try {
            // Your backend toggleFollow endpoint is good, ensure it returns updated isFollowing status
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/toggleFollow`, { userId, targetId, isFollowing });
            setIsFollowing(res.data.isFollowing); // Update state based on backend response
            toast.success(res.data.message || (isFollowing ? "Unfollowed!" : "Followed!"), toastSettings);
            fetchProfile(); // Re-fetch profile to update follower/following counts
        } catch (error) {
            console.error("Error performing follow action:", error);
            toast.error("Could not complete action. Please try again.", toastSettings);
        } finally {
            setIsProcessingFollow(false);
        }
    };

    React.useEffect(() => {
        fetchProfile();
    }, [targetId, isFollowing]); // Added isFollowing to dependency array to re-fetch counts after follow/unfollow

    // ConnectionModal remains exactly as you provided
    const ConnectionModal = () => {
        return (
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
                                        if (modalTitle === 'Communities') {
                                            navigate(`/24/community/${item._id}`, { state: { communityId: item._id } });
                                        }
                                        else if (item._id !== userId) {
                                            navigate(`/24/${item.name}/profile`, { state: { targetId: item._id } });
                                        }
                                        setShowConnectionModal(false);
                                    }}
                                >
                                    <img src={item.profilePicture || '/images/DefaultProfile.jpeg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="text-white font-medium">{item.name || item.communityName}</span> {/* Added communityName for communities */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    // Show Loader while fetching profile data
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
                <Loader /> {/* Your Loader component */}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 text-white overflow-y-auto font-poppins">
            {/* Cover Photo & Profile Header */}
            <div
                className="relative w-full h-64 md:h-80 bg-zinc-900 bg-cover bg-center"
                style={{ backgroundImage: `url(${user.coverPhoto || '/images/DefCover.jpg'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div> {/* Gradient overlay */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 sm:left-8 sm:transform-none">
                    <img
                        src={user.profilePicture || '/images/DefaultProfile.jpg'}
                        alt="Profile"
                        className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-purple-600 shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </div>

            {/* Profile Info & Actions */}
            <div className="container mx-auto px-4 pt-20 pb-8 sm:pt-28 md:pt-16 lg:pt-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8">
                    {/* User Info */}
                    <div className="text-center sm:text-left w-full sm:w-auto mt-4 sm:mt-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                            {user.name}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto sm:mx-0 leading-relaxed mb-4">
                            {user.bio || "This user hasn't added a bio yet."}
                        </p>
                    </div>

                    {/* Action Buttons (Message & Follow/Unfollow) */}
                    <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 sm:mt-0 w-full sm:w-auto">
                        <button
                            onClick={() =>
                                navigate(`/24/messages/${targetId}`, {
                                    state: {
                                        targetName: user.name,
                                        targetProfilePicture: user.profilePicture,
                                    },
                                })
                            }
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 noSelect"
                        >
                            <MessageSquare size={20} /> Message
                        </button>
                        <button
                            onClick={handleFollow}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 noSelect ${
                                isFollowing
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                            }`}
                            disabled={isProcessingFollow}
                        >
                            {isProcessingFollow ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> {isFollowing ? 'Unfollowing...' : 'Following...'}
                                </>
                            ) : isFollowing ? (
                                <>
                                    <UserMinus size={20} /> Unfollow
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} /> Follow
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-4 text-gray-300 border-t border-b border-zinc-700 py-4 mb-8">
                    <div
                        onClick={() => handleShowConnections("Followers")}
                        className="cursor-pointer text-center px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 group"
                    >
                        <strong className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 group-hover:from-green-300 group-hover:to-teal-300">
                            {user.followersCount || 0}
                        </strong>
                        <span className="block text-gray-400 group-hover:text-white transition-colors">Followers</span>
                    </div>
                    <div
                        onClick={() => handleShowConnections("Following")}
                        className="cursor-pointer text-center px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 group"
                    >
                        <strong className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:from-yellow-300 group-hover:to-orange-300">
                            {user.followingCount || 0}
                        </strong>
                        <span className="block text-gray-400 group-hover:text-white transition-colors">Following</span>
                    </div>
                    <div
                        onClick={() => handleShowConnections("Communities")}
                        className="cursor-pointer text-center px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 group"
                    >
                        <strong className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 group-hover:from-red-300 group-hover:to-purple-300">
                            {user.communitiesCount || 0}
                        </strong>
                        <span className="block text-gray-400 group-hover:text-white transition-colors">Communities</span>
                    </div>
                    <div className="text-center px-4 py-2">
                        <strong className="text-2xl font-bold text-white">
                            {posts.length}
                        </strong>
                        <span className="block text-gray-400">Posts</span>
                    </div>
                </div>

                {/* Career Interests/Tags */}
                {user.careerInterests && user.careerInterests.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4 text-purple-300 pb-2">Interests</h3>
                        <div className="flex flex-wrap gap-3">
                            {user.careerInterests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-1.5 text-sm rounded-full bg-zinc-700 text-gray-200 hover:bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 cursor-default"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-8 text-center border-b border-zinc-700 pb-4">
                    {user.name}'s Posts
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-xl">
                        <p className="mb-4">{user.name} hasn't made any posts yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="flex flex-col bg-zinc-800 rounded-xl overflow-hidden shadow-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 border border-zinc-700"
                                onClick={() => setSelectedPost(post)}
                            >
                                {post.image && (
                                    <div className="w-full aspect-square overflow-hidden bg-zinc-700 flex items-center justify-center">
                                        <img
                                            src={post.image}
                                            alt="Post content"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="p-4 flex-grow">
                                    <p className={`text-gray-200 ${post.image ? 'line-clamp-3' : 'line-clamp-6'} text-base leading-relaxed`}>
                                        {post.caption || (post.image ? 'Image post' : 'No caption')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showConnectionModal && <ConnectionModal />}
            <PostModal
                post={selectedPost}
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                user={user} // The target user's details for displaying post owner info
                userId={userId} // Current logged-in user's ID for interaction within the modal
                name={name} // Current logged-in user's name
                profilePicture={profilePicture} // Current logged-in user's profile picture
                type='user'
            />

            <ToastContainer />
        </div>
    );
}