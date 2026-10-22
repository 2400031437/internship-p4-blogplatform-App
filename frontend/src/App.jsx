import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetails from './pages/PostDetails'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import MyBlogs from './pages/MyBlogs'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/post/:id" element={<RequireAuth><PostDetails /></RequireAuth>} />
          <Route path="/write" element={<RequireAuth><CreatePost /></RequireAuth>} />
          <Route path="/edit/:id" element={<RequireAuth><EditPost /></RequireAuth>} />
          <Route path="/profile/:id" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/myblogs/:id" element={<RequireAuth><MyBlogs /></RequireAuth>} />
          <Route path="*" element={<p className="mt-16 text-center text-xl font-bold">Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
