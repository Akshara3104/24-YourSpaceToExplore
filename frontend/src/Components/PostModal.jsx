import React from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Delete, Trash2 } from 'lucide-react';

const PostModal = ({ isOpen, post, onClose, user, userId, name, profilePicture, type }) => {
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
            setComments(prev => [{ name:name, comment: newComment, profilePicture }, ...prev]);
            setNewComment('');
        } catch (error) {
            console.log(error.message);
        }
    };

    const getCommentsLikes = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/getCommentsLikes`, { postId: post._id, userId, type });
            console.log(res.data, 'in post')
            setComments(res.data.comments);
            setLiked(res.data.liked);
            setLikesCount(res.data.likesCount);
            setLikedBy(res.data.likedBy);
            console.log(res.data)
        } catch (error) {
            return null;
        }
    };
 
    const toggleLike = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/toggleLike`, { userId, postId: post._id, type, name, profilePicture, fromId: user._id });
            setLiked(!liked);
            setLikesCount(res.data.likesCount);
        } catch (error) {
            return null;
        }
    };

    const deletePost = async()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/deletePost`, { postId: post._id, type })
            onClose()
            window.location.reload()
        } catch (error) {
            return null
        }
    }

    React.useEffect(() => {
        getCommentsLikes();
        console.log('opened')
    }, [post]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-lg overflow-hidden flex bg-zinc-900 text-white relative">

                {/* Left Section: Post image and caption */}
                <div className="w-1/2 flex flex-col overflow-y-auto">
                    <img src={post.image} alt="Post" className="object-cover h-full w-full p-3 rounded-lg" />
                    <div className="px-4 py-3">
                        <div className="flex items-center gap-3 mb-2">
                            <FontAwesomeIcon
                                icon={liked ? solidHeart : regularHeart}
                                onClick={toggleLike}
                                style={{ color: '#ffa500' }}
                                size='2xl'
                                className="cursor-pointer text-lg"
                            />
                            <span className="text-sm">{likesCount} likes</span>
                        </div>
                        <strong className="block mb-1 text-xl">{user.name}</strong>
                        <p className="text-md text-gray-300">{post.caption}</p>

                        {/* Right-aligned delete button */}
                        <div className="flex justify-end">
                            <div 
                                className="inline-flex items-center gap-2 rounded p-2 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 bg-neutral-800"
                                onClick={()=>deletePost()}
                            >
                                <Trash2  /> Delete Post
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Comments / Likes toggle */}
                <div className="w-1/2 p-4 flex flex-col border-l border-gray-700">
                    {/* Toggle Buttons */}
                    <div className="flex justify-center gap-4 mb-4">
                        <div 
                            className="flex justify-center mt-2 cursor-pointer" 
                            onClick={()=>setActiveTab('likes')}
                        >
                            <h2 className={`text-xl font-semibold relative ${activeTab==='likes' && 'underline-orange'}`}>
                                Likes
                            </h2>
                        </div>
                        <div 
                            className="flex justify-center mt-2 noSelect cursor-pointer"
                            onClick={()=>setActiveTab('comments')}
                        >
                            <h2 className={`text-xl font-semibold relative ${activeTab==='comments' && 'underline-orange'}`}>
                                Comments
                            </h2>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {activeTab === "comments" && (
                        <>
                            <div className="overflow-y-auto space-y-4 max-h-[70vh] pr-2">
                                {comments.map((c, i) => (
                                    <div key={i} className="flex items-start gap-3 border-b border-gray-700 pb-3">
                                        <img
                                            src={c.profilePicture}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt={c.name}
                                        />
                                        <div>
                                            <strong className="text-white">{c.name}</strong>
                                            <p className="text-sm text-gray-300">{c.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Comment */}
                            <form
                                className="mt-auto flex"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddComment(post._id, newComment);
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 bg-zinc-800 text-white px-3 py-2 text-sm rounded-l focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-r disabled:opacity-50"
                                    disabled={newComment === ""}
                                >
                                    Post
                                </button>
                            </form>
                        </>
                    )}

                    {/* Likes Section */}
                    {activeTab === "likes" && (
                        <div className="overflow-y-auto space-y-4 max-h-[80vh] pr-2">
                            {likedBy && likedBy.length > 0 ? likedBy.map((user, i) => (
                                <div key={i} className="flex items-center gap-3 border-b border-gray-700 pb-3">
                                    <img
                                        src={user.profilePicture}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt={user.name}
                                    />
                                    <strong>{user.name}</strong>
                                </div>
                            )) : <p className="text-sm text-gray-400">No likes yet.</p>}
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

export default PostModal;