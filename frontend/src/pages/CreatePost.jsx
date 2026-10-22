import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URL, errMsg } from '../url'
import PostForm from '../components/PostForm'

export default function CreatePost() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleCreate = async ({ title, desc, categories, file }) => {
    setError('')
    try {
      let photo = ''
      if (file) {
        const data = new FormData()
        data.append('file', file)
        const up = await axios.post(URL + '/api/upload', data, { withCredentials: true })
        photo = up.data.filename
      }
      const res = await axios.post(URL + '/api/posts/create', { title, desc, photo, categories }, { withCredentials: true })
      navigate('/posts/post/' + res.data._id)
    } catch (err) {
      setError(errMsg(err, 'Could not create the post'))
    }
  }

  return <PostForm heading="Create a post" submitLabel="Create" onSubmit={handleCreate} error={error} />
}
