import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { imgSrc } from '../url'

// One post in the list (used on Home, My blogs and Profile)
export default function PostCard({ post }) {
  const { user } = useContext(UserContext)
  const desc = post.desc.length > 200 ? post.desc.slice(0, 200) + ' ...Read more' : post.desc

  return (
    <Link to={user ? '/posts/post/' + post._id : '/login'}>
      <div className="mt-8 flex w-full flex-col space-x-0 md:flex-row md:space-x-4">
        <div className="flex h-[200px] w-full items-center justify-center md:w-[35%]">
          <img src={imgSrc(post.photo)} alt={post.title} className="h-full w-full rounded-md object-cover" />
        </div>
        <div className="flex w-full flex-col pt-3 md:w-[65%] md:pt-0">
          <h1 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">{post.title}</h1>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-gray-500 md:text-base">
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toDateString()}</p>
              <p>{new Date(post.updatedAt).toLocaleTimeString().slice(0, 5)}</p>
            </div>
          </div>
          <p className="text-sm md:text-lg">{desc}</p>
        </div>
      </div>
    </Link>
  )
}
