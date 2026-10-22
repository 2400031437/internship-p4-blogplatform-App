import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BsSearch } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import Menu from './Menu'

export default function Navbar() {
  const [prompt, setPrompt] = useState('')
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const path = useLocation().pathname
  const { user } = useContext(UserContext)

  const doSearch = () => navigate(prompt.trim() ? `/?search=${encodeURIComponent(prompt.trim())}` : '/')

  return (
    <div className="flex items-center justify-between px-6 py-4 md:px-[200px]">
      <h1 className="text-lg font-extrabold md:text-xl">
        <Link to="/">Blog Market</Link>
      </h1>

      {path === '/' && (
        <div className="flex items-center justify-center space-x-0">
          <p onClick={doSearch} className="cursor-pointer"><BsSearch /></p>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            value={prompt}
            className="px-3 py-1 text-sm outline-none md:text-base"
            placeholder="Search a post"
            type="text"
          />
        </div>
      )}

      <div className="hidden items-center justify-center space-x-2 md:flex md:space-x-4">
        {user ? (
          <h3><Link to="/write">Write</Link></h3>
        ) : (
          <h3><Link to="/login">Login</Link></h3>
        )}
        {user ? (
          <div onClick={() => setMenu(!menu)} className="relative cursor-pointer">
            <p className="relative text-lg"><FaBars /></p>
            {menu && <Menu close={() => setMenu(false)} />}
          </div>
        ) : (
          <h3><Link to="/register">Register</Link></h3>
        )}
      </div>

      <div onClick={() => setMenu(!menu)} className="relative cursor-pointer text-lg md:hidden">
        <p><FaBars /></p>
        {menu && <Menu close={() => setMenu(false)} />}
      </div>
    </div>
  )
}
