import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader'
import { Plus } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import PhotoUploadLoader from './PhotoUploadLoader'
import PostModal from './PostModal'

export default function CommunityFeed() {

    const [community, setCommunity] = React.useState(null)
    const [posts, setPosts] = React.useState([])
    const [joined, setJoined] = React.useState(false)

    const [showMembersModal, setShowMembersModal] = React.useState(false)

    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')
    const profilePicture = localStorage.getItem('profilePicture')

    const location = useLocation()
    const navigate = useNavigate()

    const { communityId } = location.state

    const [selectedPost, setSelectedPost] = React.useState(null)

    const [showNewPost, setShowNewPost] = React.useState(false)

    const getCommunity = async()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getCommunityDetails`, { communityId, userId })
            console.log(res.data)
            setPosts(res.data.posts)
            setCommunity(res.data.community)
            setJoined(res.data.isJoined)
        } catch (error) {
            console.log(error.message)
        }
    }

    const toggleJoin = async()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/toggleJoin`, { communityId, userId, joined })
            if(res.data.success){
                setJoined(!joined)
                window.location.reload()
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const MembersModal = ()=> {

        const [members, setMembers] = React.useState([])
        const [createdBy, setCreatedBy] = React.useState({})

        const getMembers = async ()=>{
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getMembers`, { communityId })

                console.log(res.data)
                setMembers(res.data.members)
                setCreatedBy(res.data.createdBy)
            } catch (error) {
                console.log(error.message)
            }
        }

        React.useEffect(()=>{
            getMembers()
        }, [])

        return(
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#161616] rounded-lg p-6 w-1/4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex justify-center">
                            <h2 className="text-xl font-semibold text-center relative underline-orange">
                                Members
                            </h2>
                        </div>
                        <button onClick={() => setShowMembersModal(false)} className="text-gray-300 hover:text-white text-2xl">&times;</button>
                    </div>

                    <div 
                        className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 transition hover:scale-[1.02] p-2 rounded"
                        onClick={() => {
                            if(createdBy._id !== userId){
                            navigate(`/nquery/${createdBy.name}/profile`, { state: { targetId: createdBy._id } });
                            setShowMembersModal(false);
                            }
                        }}
                    >
                        <img src={createdBy.profilePicture||'/images/DefaultProfile.jpg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-white font-medium">{createdBy.name}</span>
                        <span className='ms-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full py-1 px-2 text-xs'>admin</span>
                    </div>

                    {members.length !== 0 && (
                        <ul className="space-y-3">
                            {members.map(item => (
                                <li 
                                    key={item._id} 
                                    className="flex items-center space-x-3 my-3 cursor-pointer hover:bg-gradient-to-r from-orange-500 to-red-500 transition hover:scale-[1.02] p-2 rounded"
                                    onClick={() => {
                                        if(item._id !== userId){
                                        navigate(`/nquery/${item.name}/profile`, { state: { targetId: item._id } });
                                        setShowMembersModal(false);
                                        }
                                    }}
                                >
                                    <img src={item.profilePicture||'/images/DefaultProfile.jpg'} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="text-white font-medium">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    const NewPostModal = ()=>{

        const [newPost, setNewPost] = React.useState({
            image: '',
            caption: ''
        });

        const toastSettings = {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    }

        const [photoUploaded,  setPhotoUploaded] = React.useState(true)

        const createNewPost = async ()=>{
            try {
                if(newPost.image===''){
                    toast('Please select an image', toastSettings);
                    return
                }
                console.log('posted', newPost)
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/createCommunityPost`, {communityId, newPost});
                console.log(res.data)
                toast('Post successful, Please refresh the page', toastSettings);
                setShowNewPost(false)
            } catch (error) {
                console.log(error)
            }
        }

        const handleFile = async (event)=>{

            const file = event.target.files[0]
            if(!file) return 
            console.log(file)
        
            const data = new FormData()
        
            data.append('file', file)
            data.append('upload_preset', 'nquery')
            data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME)

            setPhotoUploaded(false)
        
            const res = await axios.post(process.env.REACT_APP_CLOUDINARY_API, data)

            if(res.data)    setPhotoUploaded(true)
            console.log(res.data)
        
            setNewPost(prev=>{
            return{
                ...prev,
                image: res.data.url
            }
            })
        }

        return(
            <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#161616] rounded-lg p-6 w-1/3 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <div className="flex justify-center py-3">
                        <h2 className="text-2xl font-semibold relative underline-orange">
                            Create New Post
                        </h2>
                    </div>
                    <button onClick={()=>setShowNewPost(false)} className="text-gray-300 hover:text-white text-xl">&times;</button>
                </div>

                <div className="space-y-4">
                <div className="">
                    <label className="block text-gray-400 mb-1">Select picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e)}
                        className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-300"
                    />
                    {
                        !photoUploaded &&
                        <PhotoUploadLoader />
                    }
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Caption</label>
                    <textarea
                    value={newPost.caption}
                    rows="3"
                    onChange={(e)=>setNewPost(prev=>{return{...prev, caption:e.target.value}})}
                    className="w-full px-3 py-2 rounded bg-zinc-800 text-white outline-none"
                    />
                </div>

                <div className="d-flex gap-2 ms-auto">
                    <button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-800 hover:opacity-90 text-white p-2 rounded"
                        onClick={()=>setShowNewPost(false)}
                    >
                        Cancel    
                    </button>
                    <button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white p-2 rounded"
                        onClick={()=>createNewPost()}
                        disabled={!photoUploaded}

                    >
                        Post
                    </button>
                </div>
                </div>
            </div>
        </div>
        )
    }

    React.useEffect(()=>{
        getCommunity()
    }, [communityId])

    if(!community){
        return(
        <div className='w-full section h-full d-flex justify-center items-center'>
            <Loader />
        </div>
    )}

    return (
        <div className="w-full h-full mx-auto p-4 section d-flex flex-column items-center overflow-y-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-white p-6 rounded-xl">
                {/* Left: Profile Picture */}
                <div className="w-40 h-40 flex-shrink-0">
                    <img
                    src={community.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-4 border-zinc-700 shadow-md"
                    />
                </div>

                {/* Right: Info Section */}
                <div className="flex-1">
                    {/* Name & Bio */}
                    <div className="mb-2">
                        <h2 className="text-3xl font-bold">{community.title}</h2>
                        <p className="text-gray-400">{community.description || "No bio available"}</p>
                    </div>

                    {/* Stats: Followers, Following, Posts */}
                    <div className="flex flex-wrap gap-6 text-gray-300 mb-3">
                        <div
                            onClick={() => setShowMembersModal(true)}
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-gradient-to-r from-orange-500 to-red-500 transition"
                        >
                            <strong className="text-white">{community.members.length}</strong> members
                        </div>
                        <div className="px-2 py-1 rounded-md">
                            <strong className="text-white">{posts.length}</strong> Posts
                        </div>
                    </div>


                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 mb-4">
                    <button
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition"
                        onClick={() =>
                        navigate(`/nquery/communities/${communityId}/chat`, {
                            state: {
                            communityId,
                            communityTitle: community.title,
                            communityImage: community.image
                            },
                        })
                        }
                    >
                        Chat
                    </button>
                    {
                        community.createdBy!==userId &&
                        <button
                            className="bg-gradient-to-r from-blue-500 to-indigo-800 hover:opacity-90 text-white px-4 py-2 rounded-lg transition"
                            onClick={() => toggleJoin()}
                        >
                            { joined ? 'Leave':'Join'}
                        </button>
                    }
                    {community.createdBy===userId && (
                        <div 
							className='flex gap-1 rounded p-2 justify-center cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-800 hover:opacity-90'
							onClick={()=>setShowNewPost(true)}
						>
							<Plus /> New Post
						</div>
                    )}
                    </div>

                    {/* Career Interests */}
                    <div className="flex flex-wrap gap-2">
                    {community.tags.map((item, i) => (
                        <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
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

            { showMembersModal && <MembersModal /> }
            
            {
                showNewPost &&
                <NewPostModal />
            }

            <PostModal 
                post={selectedPost} 
                isOpen={!!selectedPost} 
                onClose={() => setSelectedPost(null)}
                user={{name}}
                userId={userId}
                name={community.title}
                profilePicture={profilePicture}
                type='community'
            />
            <ToastContainer />
        </div>
    )
}
