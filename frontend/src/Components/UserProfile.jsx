import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

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
            console.log(res.data)
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
            setModalUsers(res.data.users);
            setModalTitle(type === "followers" ? "Followers" : "Following");
            setShowConnectionModal(true);
        } catch (err) {
            console.error("Error fetching connections", err);
        }
    };


    React.useEffect(()=>{
        fetchProfile()
    }, [targetId])


    const ConnectionModal = ()=> {
        return(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{modalTitle}</h2>
                        <button onClick={() => setShowConnectionModal(false)} className="text-gray-500 hover:text-black text-xl">&times;</button>
                    </div>
                    {modalUsers.length === 0 ? (
                        <p className="text-gray-500 text-center">No users found</p>
                    ) : (
                        <ul className="space-y-3">
                            {modalUsers.map(item => (
                                <li 
                                    key={user._id} 
                                    className="flex items-center space-x-3 my-3"
                                    onClick={()=>{
                                        navigate(`/nquery/${item.name}/profile`, {state:{targetId: item._id}})
                                        setShowConnectionModal(false)
                                    }
                                    }
                                >
                                    <img src={item.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="text-gray-800 font-medium">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }


    const PostModal = ({isOpen, post, onClose, user, userId})=>{

        const [newComment, setNewComment] = React.useState('')

        const [comments, setComments] = React.useState([])

        const [liked, setLiked] = React.useState(false)
        const [likesCount, setLikesCount] = React.useState(0)

        const handleAddComment = async(postId, comment)=>{
            try {
                console.log(newComment)
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/addComment`, {userId, postId, comment, name, profilePicture})
                setComments(prev=>[{name, comment: newComment, profilePicture}, ...prev])
                setNewComment('')
                console.log(res.data.message)
            } catch (error) {
                console.log(error.message)
            }
        }

        const getComments = async ()=>{
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/getComments`, {postId: post._id, userId})
                setComments(res.data.comments)
                setLiked(res.data.liked)
                setLikesCount(res.data.likesCount)
                console.log(res.data)
            } catch (error) {
                return null
            }
        }

        const toggleLike = async ()=>{
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/toggleLike`, {userId, postId: post._id})
                setLiked(!liked)
                setLikesCount(res.data.likesCount)
                console.log(res.data)
            } catch (error) {
                return null
            }
        }

        React.useEffect(()=>{
            getComments()
        }, [])

        if(!isOpen) return null;

        return(
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-lg overflow-hidden flex">
                    <div className="w-1/2 bg-black/30 flex flex-col">
                        <img src={post.image} alt="Post" className="object-cover h-full w-full p-3" />
                        <div className="p-4 bg-white">
                            <FontAwesomeIcon 
                                icon={liked ? solidHeart:regularHeart} 
                                onClick={()=>toggleLike()}
                                className='fs-3'
                            />
                            {likesCount} likes
                            <strong>{user.name}</strong>
                            <p className="text-sm">{post.caption}</p>
                            <div className="mt-2 text-sm text-gray-600">
                            {/* ❤️ {post.likes.length} Likes */}
                        </div>
                    </div>
                </div>

                <div className="w-1/2 p-4 flex flex-col justify-between bg-white">
                    <div className="overflow-y-auto space-y-3 max-h-[70vh]">
                        <div className='h5'>Comments</div>
                        
                        {comments.map((c, i) => (
                        <div key={i} className="text-sm border-b pb-2 d-flex">
                            <img src={c.profilePicture} className='w-10 h-10 rounded-full object-cover mr-3'/>
                            <div className='d-flex flex-column'>
                                <strong>{c.name}</strong>
                                <div className=''>{c.comment}</div>
                                
                            </div>
                        </div>
                        ))}
                    </div>

                    <form
                        className="mt-4 flex"
                        onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(post._id, newComment)
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e)=>setNewComment(e.target.value)}
                            className="flex-1 border rounded-l px-3 py-2 text-sm"
                        />
                        <button className="bg-blue-500 text-white px-4 rounded-r" disabled={newComment===''}>
                        Post
                        </button>
                    </form>
                </div>
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
            </div>
        )
    }

    if (!user) 
		return <div className="text-center mt-10 text-gray-500">Loading...</div>;


    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center space-x-6">
                <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
                <div>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.bio || "No bio available"}</p>
                    <div className="flex space-x-4 mt-2">
                        <span onClick={() => handleShowConnections("followers")} className="cursor-pointer hover:underline">
                            <strong>{user.followersCount}</strong> Followers
                        </span>
                        <span onClick={() => handleShowConnections("following")} className="cursor-pointer hover:underline">
                            <strong>{user.followingCount}</strong> Following
                        </span>
                        <span>
                            <strong>{posts.length}</strong> Posts
                        </span>
                    </div>
                </div>
            </div>

            <div className='d-flex gap-3 m-3'>
                <div className='btn btn-primary' onClick={()=>navigate(`/nquery/messages/${targetId}`, {state:{targetName: user.name, targetProfilePicture: user.profilePicture}})}>
                    Message
                </div>
                {
                    isFollowing ? 
                    <div className='btn btn-danger'>Unfollow</div> 
                    : 
                    <div className='btn btn-info'>Follow</div>
                }
            </div>

			<div className="h4 my-2">Posts</div>
            
			<div className="mt-6 grid grid-cols-3 gap-4">
				{posts.map((post) => (
					<div 
                        key={post._id} 
                        className="relative bg-gray-900 rounded-lg overflow-hidden shadow-md"
                        onClick={()=>setSelectedPost(post)}
                    >
						<div className="w-full aspect-square overflow-hidden">
							<img 
								src={post.image} 
								alt="Post" 
								className="w-full h-full object-cover"
							/>
						</div>

						<div className="w-full text-center text-white bg-black/70 py-2">
							{post.caption}
						</div>
					</div>
				))}
			</div>

            { showConnectionModal && <ConnectionModal /> }
            

            <PostModal 
                post={selectedPost} 
                isOpen={!!selectedPost} 
                onClose={() => setSelectedPost(null)} 
                user={user}
                userId={userId}
            />

        </div>
    )
}
