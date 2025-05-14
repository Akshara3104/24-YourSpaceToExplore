import axios from 'axios'
import React from 'react'

export default function Posts() {


    const [posts, setPosts] = React.useState([])

    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')

    const getPosts = async ()=>{
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/getPosts`, {userId})

            if(res.data){
                console.log(res.data)
                setPosts(res.data.posts)
            }

        } catch (error) {
            alert('Error fetching posts')
        }
    }

    React.useEffect(()=>{
        getPosts()
    }, [])

  return (
    <div>
      <div className='bg-yellow-600 m-3 rounded-lg p-3'>
        Posts of {name}
      </div>
      <div className=''>
        {
            posts.map(post=>(
                <div className='w-fit p-2 bg-slate-300'>
                    <img 
                        className='w-[200px]'
                        src={post.image}
                        alt=''
                    />
                    <div className='p-2'>{post.caption}</div>
                </div>
            ))
        }
      </div>
    </div>
  )
}
