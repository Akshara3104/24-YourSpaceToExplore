import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostModal from "./PostModal";
import { Pencil, Plus, Loader2, Loader, LogOut } from 'lucide-react'
import EditProfileModal from "./EditProfileModal";
import PhotoUploadLoader from "./PhotoUploadLoader";
import { ToastContainer, toast, Bounce } from 'react-toastify'
import toastSettings from "./toastSettings";
 
export default function MyProfile() {

	const userId = localStorage.getItem('userId')
    const profilePicture = localStorage.getItem('profilePicture')
    const name = localStorage.getItem('name')

    const [user, setUser] = React.useState(null);
    const [posts, setPosts] = React.useState([]);

	const [showConnectionModal, setShowConnectionModal] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState("");
	const [modalUsers, setModalUsers] = React.useState([]);

	const [selectedPost, setSelectedPost] = React.useState(null);

	const [showEditProfile, setShowEditProfile] = React.useState(false)
	const [showNewPost, setShowNewPost] = React.useState(false)

	const navigate = useNavigate()
	

	const fetchProfile = async () => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getMyProfile`, {userId});
			setUser(res.data.userProfile);
			setPosts(res.data.userProfile.posts);
		} catch (error) {
			console.error("Error fetching profile:", error);
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
            console.error("Error fetching connections", err);
        }
    };


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


    const NewPostModal = ()=>{

        const [newPost, setNewPost] = React.useState({
            image: '',
            caption: ''
        });

        const [photoUploaded,  setPhotoUploaded] = React.useState(true)

        const createNewPost = async ()=>{
            try {
                if(newPost.image===''){
                    toast('Please select an image', toastSettings);
                    return
                }
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/createUserPost`, {userId, newPost});
                toast('Post successful, Please refresh the page', toastSettings);
                setTimeout(()=>{
                    setShowNewPost(false)
                    window.location.reload()
                }, 1000)
            } catch (error) {
                console.log(error)
            }
        }

        const handleFile = async (event)=>{

            const file = event.target.files[0]
            if(!file) return 
        
            const data = new FormData()
        
            data.append('file', file)
            data.append('upload_preset', 'nquery')
            data.append('cloud_name', `${process.env.REACT_APP_CLOUD_NAME}`)

            setPhotoUploaded(false)
        
            const res = await axios.post(`${process.env.REACT_APP_CLOUDINARY_API}`, data)

            if(res.data)    setPhotoUploaded(true)
        
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
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-800 text-white p-2 rounded"
                        onClick={()=>setShowNewPost(false)}
                    >
                        Cancel    
                    </button>
                    <button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded"
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

    const logout = ()=>{
        localStorage.removeItem('userId')
        localStorage.removeItem('name')
        localStorage.removeItem('token')
        localStorage.removeItem('profilePicture')
        navigate('/')
    }

    React.useEffect(() => {
        fetchProfile();
    }, [userId]);

    if (!user) 
		return(
            <div className="d-flex justify-center items-center h-full fs-3">
                <Loader />
            </div>
        )

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
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-gradient-to-r from-orange-500 to-red-500 transition"
                        >
                            <strong className="text-white text-xl">{user.followerCount}</strong> Followers
                        </div>
                        <div
                            onClick={() => handleShowConnections("Following")}
                            className="cursor-pointer px-2 py-1 rounded-md hover:bg-gradient-to-r from-orange-500 to-red-500 transition"
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
                    <div className="flex flex-start gap-4 mb-3">
						<div 
							className='flex gap-1 rounded p-2 justify-center cursor-pointer bg-gradient-to-r from-orange-500 to-red-500'
							onClick={()=>setShowEditProfile(true)}
						>
							<Pencil /> Edit Profile
						</div>
						<div 
							className='flex gap-1 rounded p-2 justify-center cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-800'
							onClick={()=>setShowNewPost(true)}
						>
							<Plus /> New Post
						</div>
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
            </div>

            { showConnectionModal && <ConnectionModal /> }
            
			{ 
				showEditProfile && 
				<EditProfileModal  
					name={user.name}
                    profilePicture={user.profilePicture}
                    bio={user.bio}
                    careerInterests={user.careerInterests}
					setShowEditProfile={setShowEditProfile}
                    userId={userId}
				/> 
			}

            {
                showNewPost &&
                <NewPostModal />
            }

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
