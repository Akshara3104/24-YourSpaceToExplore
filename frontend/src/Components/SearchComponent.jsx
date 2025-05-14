import React from 'react'
import { Search } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export default function SearchComponent() {

    const [query, setQuery] = React.useState('')
    const [searchUsers, setSearchUsers] = React.useState([])
    const [searchCommunities, setSearchCommunities] = React.useState([])

    const navigate = useNavigate()

    const searchFunction = async ()=>{
        try {
            console.log(query)
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/search`, { query })
            console.log(res.data.users, res.data.communities)
            setSearchUsers(res.data.users)
            setSearchCommunities(res.data.communities)
        } catch (error) {
            return null
        }
    }

    const SearchRender = ({users, communities})=>{
        return(
            <div className=''>
                <div className='fs-3'>People</div>
                {users.map((user, index) => (
                    <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={()=>navigate(`/nquery/${user.name}/profile`, 
                        {state:{ targetId: user._id }})}
                    >
                    <div className="relative">
                        <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                        />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    </div>
                ))}
                <div className='fs-3'>Communities</div>
                {communities.map((community, index) => (
                    <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    // onClick={()=>navigate(`/nquery/messages/${friend._id}`, 
                    //     {state:{targetName: friend.name, targetProfilePicture: friend.profilePicture}})}
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
        )
    }

    return (
        <div className='p-4'>
            <div className='p-4 d-flex gap-2'>
                <input 
                    className='p-2 w-25'
                    type='text'
                    placeholder='Search for users, communities'
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                />
                <Search onClick={()=>searchFunction()} className='p-2 rounded bg-slate-400 w-10 h-10'/>
            </div>
            <SearchRender users={searchUsers} communities={searchCommunities} />
        </div>
    )
}
