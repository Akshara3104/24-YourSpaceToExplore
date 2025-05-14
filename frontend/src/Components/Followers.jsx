import axios from 'axios'
import React from 'react'

function Followers() {


    const [followers, setFollowers] = React.useState([])

    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')

    const getFollowers = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/getFollowers`, {userId})
            if(res.data){
              console.log(res.data)
              setFollowers(res.data.followers)
            }
        } catch (error) {
            
        }
    }

    React.useEffect(()=>{
      getFollowers()
    }, [])


    return (
        <div>
          <div className='p-2 bg-pink-400 m-2'>Followers of {name}</div>
          <div className=''>
              {
                  followers.map((user, i)=>(
                      <div className='m-2 p-2 bg-orange-500' key={i}>
                          {user.name}
                      </div>
                  ))
              }
          </div>
        </div>
    )
}

export default Followers
