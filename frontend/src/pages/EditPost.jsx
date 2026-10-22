import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { URL, errMsg } from '../url'
import { UserContext } from '../context/UserContext'
import PostForm from '../components/PostForm'
import Loader from '../components/Loader'

export default function EditPost() {
  const { id: postId } = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(URL + '/api/posts/' + postId)
        if (res.data.userId !== user._id) return navigate('/') // only the owner can edit
        setPost(res.data)
      } catch (err) {
        console.log(err)
        navigate('/')
      }
    }
    fetchPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const handleUpdate = async ({ title, desc, categories, file }) => {
    setError('')
    try {
      let photo = post.photo
      if (file) {
        const data = new FormData()
        data.append('file', file)
        const up = await axios.post(URL + '/api/upload', data, { withCredentials: true })
        photo = up.data.filename
      }
      await axios.put(URL + '/api/posts/' + postId, { title, desc, photo, categories }, { withCredentials: true })
      navigate('/posts/post/' + postId)
    } catch (err) {
      setError(errMsg(err, 'Could not update the post'))
    }
  }

  if (!post) return <Loader />
  return <PostForm heading="Update a post" submitLabel="Update" initial={post} onSubmit={handleUpdate} error={error} />
}
