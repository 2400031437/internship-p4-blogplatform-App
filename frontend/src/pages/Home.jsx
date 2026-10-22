import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { URL } from '../url'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

export default function Home() {
  const { search } = useLocation() // e.g. "?search=react"
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      setLoader(true)
      setError('')
      try {
        const res = await axios.get(URL + '/api/posts' + search)
        setPosts(res.data)
        setNoResults(res.data.length === 0)
      } catch (err) {
        console.log(err)
        setError('Could not load posts. Is the backend running?')
      } finally {
        setLoader(false)
      }
    }
    fetchPosts()
  }, [search])

  return (
    <div className="min-h-[80vh] px-8 md:px-[200px]">
      {loader ? (
        <Loader />
      ) : error ? (
        <h3 className="mt-16 text-center font-bold text-red-500">{error}</h3>
      ) : !noResults ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <h3 className="mt-16 text-center font-bold">No posts available</h3>
      )}
      {!loader && !error && noResults && !search && (
        <p className="mt-4 text-center text-gray-500">
          Be the first to <Link className="underline" to="/write">write a post</Link>.
        </p>
      )}
    </div>
  )
}
