import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader'; 
import { Plus, Pencil, MessageSquare, Users, Globe } from 'lucide-react'; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhotoUploadLoader from './PhotoUploadLoader';
import PostModal from './PostModal';
import EditCommunityModal from './EditCommunityModal';

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

export default function CommunityFeed() {
    const [community, setCommunity] = React.useState(null);
    const [posts, setPosts] = React.useState([]);
    const [joined, setJoined] = React.useState(false);
    const [isProcessingJoin, setIsProcessingJoin] = React.useState(false); 

    const [showMembersModal, setShowMembersModal] = React.useState(false);

    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name'); 
    const profilePicture = localStorage.getItem('profilePicture'); 

    const location = useLocation();
    const navigate = useNavigate();

    const { communityId } = location.state || {}; 

    const [selectedPost, setSelectedPost] = React.useState(null);
    const [showEditProfile, setShowEditProfile] = React.useState(false);
    const [showNewPost, setShowNewPost] = React.useState(false);

    const getCommunity = async () => {
        if (!communityId) {
            console.error("No communityId provided in location state.");
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getCommunityDetails`, { communityId, userId });
            setPosts(res.data.posts);
            setCommunity(res.data.community);
            setJoined(res.data.isJoined);
        } catch (error) {
            console.error("Error fetching community details:", error);
            toast.error("Failed to load community. Please try again.", toastSettings);
            setCommunity(null); 
        }
    };

    const toggleJoin = async () => {
        if (!userId) {
            toast.error("You must be logged in to join/leave communities.", toastSettings);
            return;
        }
        if (isProcessingJoin) return;

        setIsProcessingJoin(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/toggleJoin`, { communityId, userId, joined });
            if (res.data.success) {
                setJoined(!joined);
                toast.success(res.data.message || (joined ? "Left community!" : "Joined community!"), toastSettings);
                getCommunity(); 
            } else {
                toast.error(res.data.message || "Failed to toggle join status.", toastSettings);
            }
        } catch (error) {
            console.error("Error toggling join status:", error);
            toast.error("Could not complete action. Please try again.", toastSettings);
        } finally {
            setIsProcessingJoin(false);
        }
    };

    const MembersModal = () => {
        const [members, setMembers] = React.useState([]);
        const [createdBy, setCreatedBy] = React.useState({});

        const getMembers = async () => {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getMembers`, { communityId });
                setMembers(res.data.members);
                setCreatedBy(res.data.createdBy);
            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load members.", toastSettings);
            }
        };

        React.useEffect(() => {
            getMembers();
        }, []);

        return (
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#161616] rounded-lg p-6 w-1/4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-center">
                            <h2 className="text-xl font-semibold text-center relative underline-orange">
                                Members
                            </h2>
                        </div>
                        <button onClick={() => setShowMembersModal(false)} className="text-gray-300 hover:text-white text-xl">&times;</button>
                    </div>

                    {createdBy && ( 
                        <div
                            className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-purple-500 to-indigo-500 transition hover:scale-[1.02] p-2 rounded" 
                            onClick={() => {
                                if (createdBy._id !== userId) {
                                    navigate(`/24/${createdBy.name}/profile`, { state: { targetId: createdBy._id } });
                                    setShowMembersModal(false);
                                }
                            }}
                        >
                            <img src={createdBy.profilePicture || '/images/Defaultprofile.jpeg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                            <span className="text-white font-medium">{createdBy.name}</span>
                            <span className='ms-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full py-1 px-2 text-xs font-semibold'>admin</span>
                        </div>
                    )}

                    {members.length === 0 ? (
                        <p className="text-gray-400 text-center">No members found</p>
                    ) : (
                        <ul className="space-y-3">
                            {members.filter(item => item._id !== createdBy._id).map(item => ( 
                                <li
                                    key={item._id}
                                    className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 transition hover:scale-[1.02] p-2 rounded"
                                    onClick={() => {
                                        if (item._id !== userId) {
                                            navigate(`/24/${item.name}/profile`, { state: { targetId: item._id } });
                                            setShowMembersModal(false);
                                        }
                                    }}
                                >
                                    <img src={item.profilePicture || '/images/Defaultprofile.jpeg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="text-white font-medium">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    const NewPostModal = () => {
        const [newPost, setNewPost] = React.useState({
            image: '',
            caption: ''
        });

        const localToastSettings = { ...toastSettings, hideProgressBar: true, closeOnClick: false, pauseOnHover: false };

        const [photoUploaded, setPhotoUploaded] = React.useState(true); 

        const createNewPost = async () => {
            try {
                if (newPost.image === '') {
                    toast('Please select an image for your post.', localToastSettings);
                    return;
                }
                if (newPost.caption.trim() === '') {
                    toast('Please add a caption for your post.', localToastSettings);
                    return;
                }
                
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/createCommunityPost`, { communityId, newPost, userId }); 
                toast.success('Post created successfully! Please refresh the page.', toastSettings); 
                setShowNewPost(false);
                getCommunity(); 
                setNewPost({ image: '', caption: '' }); 
            } catch (error) {
                console.error("Error creating post:", error);
                toast.error('Failed to create post. Please try again.', toastSettings);
            }
        };

        const handleFile = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'nquery'); 
            data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME); 

            setPhotoUploaded(false); 

            try {
                const res = await axios.post(process.env.REACT_APP_CLOUDINARY_API, data);
                if (res.data && res.data.url) {
                    setPhotoUploaded(true); 
                    setNewPost(prev => ({
                        ...prev,
                        image: res.data.url
                    }));
                    toast.success("Image uploaded!", localToastSettings);
                } else {
                    toast.error("Image upload failed.", localToastSettings);
                    setPhotoUploaded(true); // Reset state even on failure
                }
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                toast.error("Image upload failed. Please try again.", localToastSettings);
                setPhotoUploaded(true); // Reset state on error
            }
        };

        return (
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-zinc-900 rounded-xl p-8 w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto border border-purple-700 shadow-2xl">
                    <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            Create New Post
                        </h2>
                        <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-white text-3xl font-bold transition-colors duration-200">&times;</button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="post-image" className="block text-gray-300 font-semibold mb-2">Upload Image</label>
                            <input
                                id="post-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                            />
                            {!photoUploaded && (
                                <div className="mt-4">
                                    <PhotoUploadLoader />
                                    <p className="text-sm text-gray-400 text-center mt-2">Uploading image...</p>
                                </div>
                            )}
                            {newPost.image && photoUploaded && (
                                <div className="mt-4 w-full h-48 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img src={newPost.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="post-caption" className="block text-gray-300 font-semibold mb-2">Caption</label>
                            <textarea
                                id="post-caption"
                                value={newPost.caption}
                                rows="4"
                                onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                                placeholder="What's on your mind?"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 resize-y"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowNewPost(false)}
                                className="flex-1 px-6 py-3 rounded-full text-zinc-300 border border-zinc-600 hover:bg-zinc-700 transition-all duration-300 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={createNewPost}
                                disabled={!photoUploaded || newPost.caption.trim() === ''} // Disable if photo not uploaded or caption is empty
                                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    React.useEffect(() => {
        getCommunity();
    }, [communityId, joined]);

    if (!community) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-zinc-900 text-white'>
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 text-white overflow-y-auto font-poppins">
            {/* Cover Photo & Community Header */}
            <div
                className="relative w-full h-64 md:h-80 bg-zinc-900 bg-cover bg-center"
                style={{ backgroundImage: `url(${community.coverPhoto || '/images/DefCover.jpg'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div> {/* Gradient overlay */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 sm:left-8 sm:transform-none">
                    <img
                        src={community.image || '/images/DefaultProfile.jpeg'}
                        alt="Community Logo"
                        className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-purple-600 shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </div>

            {/* Community Info & Actions */}
            <div className="container mx-auto px-4 pt-20 pb-8 sm:pt-28 md:pt-16 lg:pt-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8">
                    {/* Community Info */}
                    <div className="text-center sm:text-left w-full sm:w-auto mt-4 sm:mt-0">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
                            {community.title}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto sm:mx-0 leading-relaxed mb-4">
                            {community.description || "This community hasn't added a description yet."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 sm:mt-0 w-full sm:w-auto">
                        <button
                            onClick={() =>
                                navigate(`/24/communities/${communityId}/chat`, {
                                    state: {
                                        communityId,
                                        communityTitle: community.title,
                                        communityImage: community.image
                                    },
                                })
                            }
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 noSelect"
                        >
                            <MessageSquare size={20} /> Chat
                        </button>

                        {community.createdBy !== userId && (
                            <button
                                onClick={toggleJoin}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 noSelect ${
                                    joined
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                }`}
                                disabled={isProcessingJoin}
                            >
                                {isProcessingJoin ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> {joined ? 'Leaving...' : 'Joining...'}
                                    </>
                                ) : joined ? (
                                    <>
                                        <Users size={20} /> Leave
                                    </>
                                ) : (
                                    <>
                                        <Users size={20} /> Join
                                    </>
                                )}
                            </button>
                        )}

                        {community.createdBy === userId && (
                            <>
                                <button
                                    onClick={() => setShowNewPost(true)}
                                    className='flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 noSelect'
                                >
                                    <Plus size={20} /> New Post
                                </button>
                                <button
                                    onClick={() => setShowEditProfile(true)}
                                    className='flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 noSelect'
                                >
                                    <Pencil size={20} /> Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-4 text-gray-300 border-t border-b border-zinc-700 py-4 mb-8">
                    <div
                        onClick={() => setShowMembersModal(true)}
                        className="cursor-pointer text-center px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 group"
                    >
                        <strong className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 group-hover:from-green-300 group-hover:to-teal-300">
                            {community.members.length || 0}
                        </strong>
                        <span className="block text-gray-400 group-hover:text-white transition-colors">Members</span>
                    </div>
                    <div className="text-center px-4 py-2">
                        <strong className="text-2xl font-bold text-white">
                            {posts.length}
                        </strong>
                        <span className="block text-gray-400">Posts</span>
                    </div>
                </div>

                {/* Tags Section */}
                {community.tags && community.tags.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4 text-purple-300 pb-2">Tags</h3>
                        <div className="flex flex-wrap gap-3">
                            {community.tags.map((item, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-1.5 text-sm rounded-full bg-zinc-700 text-gray-200 hover:bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 cursor-default"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 text-center border-b border-zinc-700 pb-4">
                    Community Posts
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-xl">
                        <p className="mb-4">No posts yet in this community.</p>
                        {community.createdBy === userId && (
                            <button
                                onClick={() => setShowNewPost(true)}
                                className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-green-700 transition-all duration-300"
                            >
                                Create Your First Post!
                            </button>
                        )}
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
                                <div className="p-4 border-t border-zinc-700 text-gray-400 text-sm flex justify-between items-center">
                                    <span>{post.likes || 0} Likes</span>
                                    <span>{post.comments || 0} Comments</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showMembersModal && <MembersModal />}
            {showEditProfile && (
                <EditCommunityModal
                    title={community.title}
                    image={community.image}
                    description={community.description}
                    tags={community.tags}
                    setShowEditProfile={setShowEditProfile}
                    communityId={communityId}
                    onCommunityUpdated={getCommunity}
                />
            )}
            {showNewPost && <NewPostModal />}

            <PostModal
                post={selectedPost}
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                user={{
                    name: community.title,
                    profilePicture: community.image,
                    _id: communityId 
                }}
                userId={userId}
                name={name} 
                profilePicture={profilePicture} 
                type='community'
            />
            <ToastContainer />
        </div>
    );
}