import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { URL, imgSrc } from '../url'
import { UserContext } from '../context/UserContext'
import Comment from '../components/Comment'
import Loader from '../components/Loader'

export default function PostDetails() {
  const { id: postId } = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [loader, setLoader] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + '/api/posts/' + postId)
      setPost(res.data)
    } catch (err) {
      console.log(err)
      setNotFound(true)
    } finally {
      setLoader(false)
    }
  }

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(URL + '/api/comments/post/' + postId)
      setComments(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setLoader(true)
    fetchPost()
    fetchPostComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await axios.delete(URL + '/api/posts/' + postId, { withCredentials: true })
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const postComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await axios.post(URL + '/api/comments/create', { comment, postId }, { withCredentials: true })
      setComment('')
      fetchPostComments() // refresh the list without reloading the page
    } catch (err) {
      console.log(err)
    }
  }

  const deleteComment = async (id) => {
    try {
      await axios.delete(URL + '/api/comments/' + id, { withCredentials: true })
      fetchPostComments()
    } catch (err) {
      console.log(err)
    }
  }

  if (loader) return <Loader />
  if (notFound || !post) return <p className="mt-16 text-center text-xl font-bold">Post not found</p>

  return (
    <div className="mt-8 px-8 md:px-[200px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
        {user?._id === post.userId && (
          <div className="flex items-center justify-center space-x-2">
            <p className="cursor-pointer" onClick={() => navigate('/edit/' + postId)}><BiEdit /></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete /></p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between md:mt-4">
        <p>@{post.username}</p>
        <div className="flex space-x-2">
          <p>{new Date(post.updatedAt).toDateString()}</p>
          <p>{new Date(post.updatedAt).toLocaleTimeString().slice(0, 5)}</p>
        </div>
      </div>

      <img src={imgSrc(post.photo)} alt={post.title} className="mx-auto mt-8 w-full rounded-md object-cover" />
      <p className="mx-auto mt-8 whitespace-pre-line">{post.desc}</p>

      <div className="mt-8 flex items-center space-x-4 font-semibold">
        <p>Categories:</p>
        <div className="flex items-center justify-center space-x-2">
          {post.categories?.map((c, i) => (
            <div key={i} className="rounded-lg bg-gray-300 px-3 py-1">{c}</div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="mb-4 mt-6 font-semibold">Comments ({comments.length}):</h3>
        {comments.map((c) => (
          <Comment key={c._id} c={c} canDelete={user?._id === c.userId} onDelete={deleteComment} />
        ))}
      </div>

      <form onSubmit={postComment} className="mt-4 flex w-full flex-col md:flex-row">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Write a comment"
          className="mt-4 border border-gray-300 px-4 py-2 outline-none md:mt-0 md:w-[80%]"
        />
        <button type="submit" className="mt-4 bg-black px-2 py-2 text-sm text-white md:mt-0 md:w-[20%]">
          Add Comment
        </button>
      </form>
    </div>
  )
}
