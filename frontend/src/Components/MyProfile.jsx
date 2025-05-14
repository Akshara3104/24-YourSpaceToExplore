import React from "react";
import axios from "axios";

export default function Profile() {

	const userId = localStorage.getItem('userId')
    const [user, setUser] = React.useState(null);
    const [posts, setPosts] = React.useState([]);

	const [newPost, setNewPost] = React.useState({
		image: '',
		caption: ''
	});

	const [show, setShow] = React.useState(false);

	const fetchProfile = async () => {
		try {
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getMyProfile`, {userId});
			console.log(res.data.userProfile)
			setUser(res.data.userProfile);
			setPosts(res.data.userProfile.posts);
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	};

	const createNewPost = async ()=>{
		try {
			console.log('posted', newPost)
			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/createPost`, {userId, newPost});
			console.log(res.data)
			setShow(false)
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
		data.append('cloud_name', 'ddjqda8cb')
	
		const res = await axios.post('https://api.cloudinary.com/v1_1/ddjqda8cb/image/upload', data)

		console.log(res.data)
	
		setNewPost(prev=>{
		  return{
			...prev,
			image: res.data.url
		  }
		})
	}

	const handleChange = (e)=>{
		const {name, value} = e.target
		setNewPost(prev=>{
		  return{
			...prev,
			[name]: value
		  }
		})
	}

    React.useEffect(() => {
        fetchProfile();
    }, [userId]);

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
                        <span><strong>{user.followerCount}</strong> Followers</span>
                        <span><strong>{user.followingCount}</strong> Following</span>
                        <span><strong>{posts.length}</strong> Posts</span>
                    </div>
                </div>
            </div>

			<div className="h4 my-2">Posts</div>
			<button className="btn btn-primary" onClick={()=>setShow(!show)}>New +</button>
            
			<div className="mt-6 grid grid-cols-3 gap-4">
				{posts.map((post) => (
					<div key={post._id} className="relative bg-gray-900 rounded-lg overflow-hidden shadow-md">

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




			{
				show && 
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div className="bg-white p-6 rounded-lg shadow-lg w-96">
					<h2 className="text-xl font-semibold mb-4">Create a post</h2>
					
					<div>
						<label className="block mb-2">Select image</label>
						<input
							type='file'
							onChange={(e)=>handleFile(e)}
						/>
						
						<label className="block mb-2">Caption</label>
						<textarea 
							name='caption'
							value={newPost.caption}
							className="w-full p-2 border rounded-md mb-3" 
							placeholder="Enter description" 
							onChange={(e)=>handleChange(e)}
						/>

						<div className="flex justify-end space-x-2">
							<button 
								onClick={()=>{
								setShow(false)
								setNewPost({
									image: '',
									caption: ''
								})
								}}
								className="bg-gray-400 text-white px-4 py-2 rounded-md"
							>
								Cancel
							</button>
							<button 
								className="bg-blue-600 text-white px-4 py-2 rounded-md"
								onClick={()=>createNewPost()}
							>
								Create
							</button>
						</div>
					</div>
					</div>
				</div>
			}
        </div>
    );
}
