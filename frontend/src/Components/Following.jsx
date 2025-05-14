import React from 'react'
import axios from 'axios'

export default function Following() {


    const [following, setFollowing] = React.useState([])
    
    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')

    const getFollowers = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getFollowing`, {userId})
            if(res.data){
                console.log(res.data)
                setFollowing(res.data.following)
            }
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(()=>{
        getFollowers()
    }, [])

    return (
        <div>
            <div className='p-2 bg-pink-400 m-2'>Following of {name}</div>
            <div className=''>
                {
                    following.map((user, i)=>(
                        <div className='m-2 p-2 bg-orange-500' key={i}>
                            {user.name}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
