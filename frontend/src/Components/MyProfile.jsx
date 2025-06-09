
import EditProfileModal from "./EditProfileModal";
import PhotoUploadLoader from "./PhotoUploadLoader";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, LogOut, Loader2 } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import NotLoggedIn from './NotLoggedIn';
import PostModal from './PostModal';
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

export default function MyProfile() {
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name'); 
    const profilePicture = localStorage.getItem('profilePicture');

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true); 
    const [error, setError] = useState(null);

    const [showConnectionModal, setShowConnectionModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalUsers, setModalUsers] = useState([]); 

    const [selectedPost, setSelectedPost] = useState(null); 

    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getMyProfile`, { userId: userId });
            setUser(res.data.userProfile);
            setPosts(res.data.userProfile.posts);
            setError(null); 
        } catch (error) {
            setError("Failed to load profile. Please try again.");
            setUser(null); 
            setPosts([]); 
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleShowConnections = async (type) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getConnections`, {
                targetId: userId,
                type,
            });
            setModalUsers(res.data.users);
            setModalTitle(type);
            setShowConnectionModal(true);
        } catch (err) {
            toast.error(`Failed to load ${type}.`, toastSettings);
        }
    };

    useEffect(() => {
        if (!userId) {
            return;
        }
        fetchProfile();
    }, [userId]);


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
                                    className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded hover:scale-[1.02] transition"
                                    onClick={() => {
                                        if(modalTitle==='Communities'){
                                        navigate(`/24/community/${item._id}`, { state: { communityId: item._id } });
                                        }
                                        else if(item._id !== userId){
                                        navigate(`/24/${item.name}/profile`, { state: { targetId: item._id } });
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


    const NewPostModal = () => {
        const [newPost, setNewPost] = useState({
            image: null,
            caption: ''
        });
        const [photoUploaded, setPhotoUploaded] = useState(true);
        const [isSubmitting, setIsSubmitting] = useState(false); 

        const createNewPost = async () => {
            if (isSubmitting) return;
            if (!newPost.image && !newPost.caption.trim()) {
                toast.error("Please add an image or a caption.", toastSettings);
                return;
            }

            setIsSubmitting(true);
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/createUserPost`, { userId: userId, newPost });
                toast.success('Post created successfully! Refreshing page...', toastSettings);
                setTimeout(() => {
                    setShowNewPost(false);
                    window.location.reload();
                }, 1500);
            } catch (error) {
                toast.error('Failed to create post. Please try again.', toastSettings);
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleFile = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            setPhotoUploaded(false); 

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'nquery'); 
            data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME);

            try {
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
                    data
                );
                setNewPost(prev => ({
                    ...prev,
                    image: res.data.url
                }));
                toast.success("Photo uploaded!", { ...toastSettings, autoClose: 1000 });
            } catch (error) {
                toast.error("Photo upload failed.", toastSettings);
                setNewPost(prev => ({ ...prev, image: null }));
            } finally {
                setPhotoUploaded(true); 
            }
        };

        return (
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-700">
                    <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                            Create New Post
                        </h2>
                        <button
                            onClick={() => setShowNewPost(false)}
                            className="text-gray-400 hover:text-white transition text-3xl font-light leading-none"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="post-image" className="block text-gray-300 text-sm font-medium mb-2">
                                Select Picture (Optional)
                            </label>
                            <input
                                id="post-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-500 file:text-white
                                hover:file:bg-purple-600 transition duration-150 ease-in-out cursor-pointer"
                            />
                            {!photoUploaded && <PhotoUploadLoader />} {/* Show loader during upload */}
                            {newPost.image && photoUploaded && (
                                <div className="mt-4 flex items-center justify-center bg-zinc-700 p-2 rounded-lg">
                                    <img src={newPost.image} alt="Selected preview" className="max-h-48 object-contain rounded-md" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="post-caption" className="block text-gray-300 text-sm font-medium mb-2">
                                Caption
                            </label>
                            <textarea
                                id="post-caption"
                                value={newPost.caption}
                                rows="4"
                                onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                                placeholder="What's on your mind?"
                                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700 mt-6">
                            <button
                                onClick={() => setShowNewPost(false)}
                                className="px-6 py-2 rounded-full text-white bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 font-medium"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createNewPost}
                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-medium flex items-center justify-center"
                                disabled={isSubmitting || (!newPost.image && !newPost.caption.trim()) || !photoUploaded} // Disable if nothing to post or photo not uploaded
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} /> Posting...
                                    </>
                                ) : (
                                    'Post'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('profilePicture');
        navigate('/');
        toast.info("You have been logged out.", toastSettings);
    };

    // If not logged in, render NotLoggedIn component
    if (!userId) {
        return <NotLoggedIn />;
    }

    // Show a loading spinner while profile data is being fetched
    if (loadingProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
                <Loader2 className="animate-spin text-purple-500" size={48} />
                <p className="ml-4 text-xl">Loading profile...</p>
            </div>
        );
    }

    // Show error message if profile data fetch failed
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-red-400 p-6">
                <p className="text-2xl font-bold mb-4">{error}</p>
                <button
                    onClick={fetchProfile}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry Loading Profile
                </button>
            </div>
        );
    }

    // If no user data despite not loading and no error (shouldn't happen with good API), fallback
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-gray-400">
                <p>No user data available. Please log in or try again.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 text-white overflow-y-auto font-poppins section rounded">
            {/* Cover Photo & Profile Header */}
            <div className="relative w-full h-64 md:h-80 bg-zinc-900 bg-cover bg-center"
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
                            {user.bio || "No bio available. Express yourself!"}
                        </p>
                        {user.location && (
                            <p className="text-gray-400 text-base flex items-center justify-center sm:justify-start mb-2">
                                <i className="fas fa-map-marker-alt mr-2 text-purple-400"></i> {user.location}
                            </p>
                        )}
                        {user.website && (
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center justify-center sm:justify-start">
                                <i className="fas fa-globe mr-2 text-blue-400"></i> {user.website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                            </a>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 sm:mt-0 w-full sm:w-auto">
                        <button
                            onClick={() => setShowEditProfile(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 noSelect"
                        >
                            <Pencil size={20} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setShowNewPost(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 noSelect"
                        >
                            <Plus size={20} /> New Post
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-700 text-gray-300 font-semibold shadow-lg hover:bg-zinc-600 transition-colors duration-300 transform hover:scale-105 noSelect"
                        >
                            <LogOut size={20} /> Log Out
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
                            {user.followerCount || 0}
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
                    My Posts
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-xl">
                        <p className="mb-4">You haven't made any posts yet.</p>
                        <button
                            onClick={() => setShowNewPost(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors duration-300 font-semibold flex items-center justify-center mx-auto"
                        >
                            <Plus size={20} className="mr-2" /> Create Your First Post
                        </button>
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
            {showEditProfile && (
                <EditProfileModal
                    name={user.name}
                    profilePicture={user.profilePicture}
                    bio={user.bio}
                    careerInterests={user.careerInterests}
                    setShowEditProfile={setShowEditProfile}
                    userId={userId}
                    onProfileUpdated={fetchProfile}
                />
            )}
            {showNewPost && <NewPostModal />}
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

            <ToastContainer />
        </div>
    );
}