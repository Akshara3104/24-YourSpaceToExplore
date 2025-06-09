import React from 'react'
import axios from 'axios'
import { useNavigate, Outlet } from 'react-router-dom'
import { Plus } from 'lucide-react'
import NotLoggedIn from './NotLoggedIn'
import Select from 'react-select'
import tags from './Tags'
import PhotoUploadLoader from './PhotoUploadLoader'
import { ToastContainer, toast  } from 'react-toastify'


const careerOptions = Object.values(tags).flat()

export default function Communities() {

    const name = localStorage.getItem('name')
    const userId = localStorage.getItem('userId')

    const [communities, setCommunities] = React.useState([])
    const [popup, setPopup] = React.useState(false)

    const navigate = useNavigate();

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

    const getCommunities = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getCommunities`, {userId})
            setCommunities(res.data.communities)
        } catch (error) {
            console.log('Error occured')
        }
    }

    
    
    
    const CreateCommunityModal = ()=>{
        
        const [newCommunity, setNewCommunity] = React.useState({
            title: '',
            description: '',
            image: '',
            tags: []
        })

        const [photoUploaded, setPhotoUploaded] = React.useState(true)

        const selectOptions = careerOptions.map(option => ({
            value: option,
            label: option
        }));
    
        const [selectedOptions, setSelectedOptions] = React.useState([]);

        const handleChange = (e)=>{
            const {name, value} = e.target
            setNewCommunity(prev=>{
                return{
                ...prev,
                [name]: value
                }
            })
        }

        const handleTagChange = (selected) => {
            setSelectedOptions(selected || []);
            setNewCommunity(prev => ({
                ...prev,
                tags: selected ? selected.map(option => option.value) : []
            }));
        };
    
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
    
            if(res.data.url)    setPhotoUploaded(true)

            setNewCommunity(prev=>{
                return{
                ...prev,
                image: res.data.url
                }
            })
    
        }
    
        const createNewCommunity = async ()=>{
            if(newCommunity.title===''){
                alert('Please enter community title')
                return
            }
            if(newCommunity.title.length>=30){
                alert('Tttle length should be <30 characters')
                return
            }
            if(newCommunity.description.length>300){
                alert('Description length should be <300 characters')
                return
            }

            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/createCommunity`, {
                newCommunity,
                createdBy: userId,
            })

            if(res.data.success){
                toast('Community successfully created', toastSettings)
                setTimeout(()=>{
                    navigate(`/24/community/${res.data.communityId}`, {state: { communityId: res.data.communityId }})
                }, 1500)
            }
        }

        return(
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="section p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-center p-4">
                    <h2 className="text-2xl font-semibold relative underline-orange">
                        Create Community
                    </h2>
                </div>
                <div>
                    <div className='mb-3'>
                        <label className="block mb-2 fs-5">Community Title</label>
                        <input 
                            type="text"
                            name='title'
                            value={newCommunity.title}
                            className="w-full p-2 rounded-md bg-neutral-600 ps-3 focus:outline-none" 
                            placeholder="Enter name" 
                            onChange={(e)=>handleChange(e)}
                        />
                    </div>

                    <div className='mb-3'>
                        <label className="block mb-2 fs-5">Select image</label>
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
                    
                    <div className='my-2'>
                        <label className="block my-2 fs-5">Description</label>
                        <textarea 
                            name='description'
                            value={newCommunity.description}
                            className="w-full p-2 rounded-md bg-neutral-600 focus:outline-none" 
                            placeholder="Enter description" 
                            onChange={(e)=>handleChange(e)}
                        />
                    </div>

                    <div className="my-2">
                        <label className="block my-2 fs-5">Tags</label>
                        <Select
                            options={selectOptions}
                            value={selectedOptions}
                            onChange={handleTagChange}
                            isMulti
                            className="react-select-container rounded mb-5"
                            classNamePrefix="react-select"
                            placeholder="Select your interests..."
                            styles={{
                                control: (provided) => ({
                                ...provided,
                                backgroundColor: '#525252', // Tailwind's bg-neutral-600
                                borderColor: '#404040',
                                color: 'white'
                                }),
                                menu: (provided) => ({
                                ...provided,
                                backgroundColor: '#525252',
                                color: 'white'
                                }),
                                option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? '#404040' : '#525252',
                                color: 'white',
                                cursor: 'pointer'
                                }),
                                multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: '#3f3f3f',
                                color: 'white'
                                }),
                                multiValueLabel: (provided) => ({
                                ...provided,
                                color: 'white'
                                }),
                                multiValueRemove: (provided) => ({
                                ...provided,
                                color: 'white',
                                ':hover': {
                                    backgroundColor: '#ef4444',
                                    color: 'white'
                                }
                                }),
                            }}
                        /> 
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button 
                            onClick={()=>{
                            setPopup(false)
                            setNewCommunity({
                                title: '',
                                description: '',
                                isPrivate: false
                            })
                            }}
                            className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white px-4 py-2 rounded-md"
                            onClick={()=>createNewCommunity()}
                            disabled={!photoUploaded}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )
    }


    React.useEffect(()=>{
        getCommunities()
    }, [])

    if(!userId){
        return(
            <NotLoggedIn />
        )
    }


return (

    <div className="flex h-full">
    <div className="w-80 shadow flex flex-col temp section">
        <div className="flex justify-center p-4 mt-2">
            <h2 className="text-2xl font-semibold relative underline-orange">
                Communities
            </h2>
        </div>
        <div className="flex flex-col space-y-4 p-4">
        <div 
            className='flex mx-auto w-full gap-2 rounded bg-neutral-600 hover:bg-gradient-to-r from-orange-500 to-red-500 p-3 justify-center cursor-pointer hover:scale-105 transition'
            onClick={()=>setPopup(true)}
        >
            <Plus /> Create
        </div>
        {communities.map((community, index) => (
            <div
            key={index}
            className="flex items-center space-x-3 p-2 hover:bg-gradient-to-r from-orange-500 to-red-500 rounded-lg cursor-pointer hover:scale-105 transition"
            onClick={()=>navigate(`/24/communities/${community._id}/chat`, 
                    {state: {
                        communityId: community._id, 
                        communityTitle: community.title,
                        communityImage: community.image
                    }})}
            >
            <div className="relative">
                <img
                src={community.image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
                />
            </div>
            <span className="text-sm font-medium">{community.title}</span>
            </div>
        ))}
        </div>
    </div>


    {
        popup && 
        <CreateCommunityModal />   
    }

    <ToastContainer />

    <div className='h-100 flex-1'>
        <Outlet />
    </div>
    </div>   
)
    
}
