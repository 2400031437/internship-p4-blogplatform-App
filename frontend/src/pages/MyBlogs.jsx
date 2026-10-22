import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { URL } from '../url'
import { UserContext } from '../context/UserContext'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

export default function MyBlogs() {
  const { user } = useContext(UserContext)
  const [posts, setPosts] = useState([])
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(URL + '/api/posts/user/' + user._id)
        setPosts(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoader(false)
      }
    }
    fetchMyPosts()
  }, [user._id])

  return (
    <div className="min-h-[80vh] px-8 md:px-[200px]">
      <h1 className="mt-4 text-xl font-bold md:text-2xl">My blogs</h1>
      {loader ? (
        <Loader />
      ) : posts.length ? (
        posts.map((p) => <PostCard key={p._id} post={p} />)
      ) : (
        <h3 className="mt-16 text-center font-bold">
          You have not written any posts yet. <Link className="underline" to="/write">Write one</Link>
        </h3>
      )}
    </div>
  )
}
