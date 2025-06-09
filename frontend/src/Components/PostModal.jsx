import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Trash2 } from 'lucide-react';

const PostModal = ({ isOpen, post, onClose, user, userId, name, profilePicture, type, admin }) => {
    const [newComment, setNewComment] = React.useState('');
    const [comments, setComments] = React.useState([]);
    const [likedBy, setLikedBy] = React.useState([]);

    const [liked, setLiked] = React.useState(false);
    const [likesCount, setLikesCount] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState("likes"); // "comments" or "likes"

    const handleAddComment = async (postId, comment) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/addComment`, {
                userId, postId, comment, name, profilePicture, type, fromId: user._id
            });
            setComments(prev => [{
                name: name,
                comment: newComment,
                profilePicture,
                userId,
                _id: res.data.commentId
            }, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const getCommentsLikes = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/getCommentsLikes`, { postId: post._id, userId, type });
            setComments(res.data.comments);
            setLiked(res.data.liked);
            setLikesCount(res.data.likesCount);
            setLikedBy(res.data.likedBy);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/deleteComment`, { commentId });
            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error(error.message);
        }
    };

    const toggleLike = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/toggleLike`, { userId, postId: post._id, type, name, profilePicture, fromId: user._id });
            if(!liked){
                setLikedBy(prev=>[{
                    name,profilePicture
                }, ...prev])
            }else{
                setLikedBy(prev=>prev.filter(like=>like.userId!==userId))
            }
            setLiked(!liked);
            setLikesCount(res.data.likesCount);
        } catch (error) {
            console.error(error.message);
        }
    };

    const deletePost = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/deletePost`, { postId: post._id, type });
            onClose();
            window.location.reload(); 
        } catch (error) {
            console.error(error.message);
        }
    };

    React.useEffect(() => {
        if (isOpen && post && post._id) { 
            getCommentsLikes();
        }
    }, [isOpen, post, likedBy]);

    if (!isOpen || !post) return null; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-xl overflow-hidden flex bg-zinc-900 text-white relative border border-purple-700 shadow-2xl animate-fade-in-up">

                {/* Left Section: Post image and caption */}
                <div className="w-1/2 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                    {post.image && (
                        <div className="w-full h-auto max-h-[60%] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-zinc-700">
                            <img src={post.image} alt="Post content" className="object-contain w-full h-full" />
                        </div>
                    )}
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <button onClick={toggleLike} className="focus:outline-none transition-transform transform hover:scale-110">
                                <FontAwesomeIcon
                                    icon={liked ? solidHeart : regularHeart}
                                    className="text-2xl"
                                    style={{ color: '#ffa500' }} // Keep the orange accent for the heart
                                />
                            </button>
                            <span className="text-lg font-semibold text-gray-200">{likesCount} likes</span>
                        </div>
                        <div className="mb-4">
                            <strong className="block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-1">{user.name}</strong>
                            <p className="text-base text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{post.caption}</p>
                        </div>

                        {/* Delete Post Button - only visible if it's the user's post */}
                        {(post.userId === userId) || (admin===userId) && (
                            <div className="mt-auto pt-4 border-t border-zinc-700 flex justify-end">
                                <button
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                                    onClick={deletePost}
                                >
                                    <Trash2 size={18} /> Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Comments / Likes toggle */}
                <div className="w-1/2 p-4 flex flex-col border-l border-zinc-700">
                    {/* Toggle Buttons */}
                    <div className="flex justify-around mb-6 border-b border-zinc-800 pb-2">
                        <button
                            className={`flex-1 text-center py-2 text-xl font-semibold relative transition-colors duration-200 ${activeTab === 'likes' ? 'text-orange-400 after:block after:h-0.5 after:bg-orange-500 after:absolute after:bottom-0 after:left-0 after:w-full after:animate-slide-in' : 'text-gray-400 hover:text-gray-200'}`}
                            onClick={() => setActiveTab('likes')}
                        >
                            Likes
                        </button>
                        <button
                            className={`flex-1 text-center py-2 text-xl font-semibold relative transition-colors duration-200 ${activeTab === 'comments' ? 'text-red-400 after:block after:h-0.5 after:bg-red-500 after:absolute after:bottom-0 after:left-0 after:w-full after:animate-slide-in' : 'text-gray-400 hover:text-gray-200'}`}
                            onClick={() => setActiveTab('comments')}
                        >
                            Comments
                        </button>
                    </div>

                    {/* Comments Section */}
                    {activeTab === "comments" && (
                        <>
                            <div className="overflow-y-auto space-y-2 max-h-[calc(100vh-250px)] pr-2 custom-scrollbar flex-grow">
                                {comments && comments.length > 0 ? comments.map((c) => (
                                    <div
                                        key={c._id} // Use unique comment ID as key
                                        className="relative flex items-start gap-3 group p-3 rounded-lg transition-colors duration-200"
                                    >
                                        <img
                                            src={c.profilePicture}
                                            className="w-10 h-10 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                                            alt={c.name}
                                        />
                                        <div className="flex-1 flex flex-col">
                                            <strong className="text-white text-md font-semibold">{c.name}</strong>
                                            <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">{c.comment}</p>
                                        </div>
                                        {c.userId === userId  && (
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors duration-200 "
                                                onClick={() => handleDeleteComment(c._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-center text-lg text-gray-500 py-10">No comments yet. Be the first to comment!</p>
                                )}
                            </div>

                            <form
                                className="mt-auto flex gap-2 pt-4 border-t border-zinc-700"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (newComment.trim()) { // Prevent adding empty comments
                                        handleAddComment(post._id, newComment);
                                    }
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 bg-zinc-800 text-white px-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-zinc-700 placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={newComment.trim() === ""}
                                >
                                    Post
                                </button>
                            </form>
                        </>
                    )}

                    {/* Likes Section */}
                    {activeTab === "likes" && (
                        <div className="overflow-y-auto space-y-2 max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
                            {likedBy && likedBy.length > 0 ? likedBy.map((likedUser) => ( // Renamed 'user' to 'likedUser' to avoid conflict with prop
                                <div key={likedUser._id} className="flex items-center gap-2 hover:bg-zinc-800 p-3 rounded-lg transition-colors duration-200">
                                    <img
                                        src={likedUser.profilePicture}
                                        className="w-10 h-10 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                                        alt={likedUser.name}
                                    />
                                    <strong className="text-white text-md font-semibold">{likedUser.name}</strong>
                                </div>
                            )) : (
                                <p className="text-center text-lg text-gray-500 py-10">No likes yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors duration-200"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default PostModal;