import React from 'react'
import axios from 'axios'
import { useNavigate, Outlet } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function Communities() {

    const name = localStorage.getItem('name')
    const userId = localStorage.getItem('userId')

    const [communities, setCommunities] = React.useState([])
    const [popup, setPopup] = React.useState(false)

    const [newCommunity, setNewCommunity] = React.useState({
      title: '',
      description: '',
      image: '',
      isPrivate: false
    })

    const navigate = useNavigate();

    const getCommunities = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getCommunities`, {userId})
            // console.log(res.data.communities)
            setCommunities(res.data.communities)
        } catch (error) {
            console.log('Error occured')
        }
    }

    const handleChange = (e)=>{
      const {name, value} = e.target
      setNewCommunity(prev=>{
        return{
          ...prev,
          [name]: value
        }
      })
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
      console.log(newCommunity)
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/createCommunity`, {
        title: newCommunity.title,
        description: newCommunity.description,
        isPrivate: newCommunity.isPrivate,
        image: newCommunity.image,
        createdBy: userId
      })
      console.log(res.data)
    }


    React.useEffect(()=>{
        getCommunities()
    }, [])


  return (

    <div className="flex h-screen">
      <div className="w-80 shadow flex flex-col">
        <div className="p-4 flex items-center space-x-3">
          <h2 className="text-lg font-semibold">Communities</h2>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <div 
            className='flex mx-auto w-full gap-2 rounded bg-slate-400 p-3 justify-center'
            onClick={()=>setPopup(true)}
          >
            <Plus /> Create
          </div>
          {communities.map((community, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={()=>navigate(`/nquery/communities/${community._id}/chat`, 
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Create a Community</h2>
              
              <div>
                  <label className="block mb-2">Community Title</label>
                  <input 
                    type="text" 
                    name='title'
                    value={newCommunity.title}
                    className="w-full p-2 border rounded-md mb-3" 
                    placeholder="Enter name" 
                    onChange={(e)=>handleChange(e)}
                  />

                  <label className="block mb-2">Select image</label>
                  <input
                    type='file'
                    onChange={(e)=>handleFile(e)}
                  />
                  
                  <label className="block mb-2">Description</label>
                  <textarea 
                    name='description'
                    value={newCommunity.description}
                    className="w-full p-2 border rounded-md mb-3" 
                    placeholder="Enter description" 
                    onChange={(e)=>handleChange(e)}
                  />

                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      id="isPrivate" 
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded" 
                      onChange={(e)=>setNewCommunity(prev=>{
                        return{
                          ...prev,
                          isPrivate: e.target.checked
                        }
                      })}
                    />
                    <label htmlFor="isPrivate" className="ml-2 text-gray-700">Make this community private</label>
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
                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        onClick={()=>createNewCommunity()}
                      >
                        Create
                      </button>
                  </div>
              </div>
            </div>
        </div>
      }

      <div className='h-100 flex-1'>
        <Outlet />
      </div>
    </div>


      
  )
}
