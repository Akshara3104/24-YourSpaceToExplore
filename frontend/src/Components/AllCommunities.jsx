import axios from 'axios'
import React from 'react'

export default function AllCommunities() {

    const [communities, setCommunities] =  React.useState([])

    const userId = localStorage.getItem('userId')
 
    const getAllCommunities = async ()=>{
        try {
            
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/getAllCommunities`)

            console.log(res.data)

            setCommunities(res.data.communities)

        } catch (error) {
            console.log(error.message)
        }
    }


    const joinCommunity = async (communityId)=>{
        try {
            
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/community/joinCommunity`, {userId, communityId})

            console.log(res.data)

        } catch (error) {
            console.log(error.message)
        }
    }

    React.useEffect(()=>{
        getAllCommunities()
    }, [])

    return (

        <div className=''>

            <div className='fs-4'>All communities</div>
            {
                communities.map(community=>(
                    <div 
                        className='m-2 p-2 bg-primary rounded row'
                    >
                        <div className='col-6'>{community.title}</div>
                        <button 
                            className='btn btn-info w-auto'
                            onClick={()=>joinCommunity(community._id)}
                        >
                            Join now
                        </button>
                     </div>
                ))
            }
            
        </div>
    )
}
