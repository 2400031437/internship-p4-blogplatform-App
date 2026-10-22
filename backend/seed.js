// Optional: adds a demo user and a few posts so you can see the app with data.
//   npm run seed        ->  login: demo@blog.com / demo123
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('./models/User')
const Post = require('./models/Post')

const posts = [
  ['Getting started with React', 'React lets you build user interfaces from small reusable components. In this post we look at JSX, props and state, and why hooks like useState and useEffect changed how we write React apps. Start small, build a counter, then a todo list, then something real.', ['React', 'Frontend']],
  ['Why Node.js and Express?', 'Node.js lets you write the backend in the same language as the frontend. Express adds routing and middleware on top of it, so building a REST API takes only a few lines. Combine it with MongoDB and you have the classic MERN stack.', ['Node', 'Backend']],
  ['Understanding JWT authentication', 'A JSON Web Token proves who you are without the server storing a session. After login the server signs a token and stores it in an httpOnly cookie; on every request the token is verified by a small middleware.', ['Security', 'JWT']],
  ['Tailwind CSS in 5 minutes', 'Utility classes such as flex, items-center and px-4 let you style elements without leaving your JSX. Responsive prefixes like md: make mobile-friendly layouts easy.', ['CSS', 'Design']],
]

;(async () => {
  await mongoose.connect(process.env.MONGO_URL)
  let user = await User.findOne({ email: 'demo@blog.com' })
  if (!user) {
    user = await User.create({ username: 'demo', email: 'demo@blog.com', password: await bcrypt.hash('demo123', 10) })
  }
  if ((await Post.countDocuments({ userId: String(user._id) })) === 0) {
    for (const [title, desc, categories] of posts) {
      await Post.create({ title, desc, categories, username: user.username, userId: String(user._id) })
    }
  }
  console.log('Seed done. Login with  demo@blog.com / demo123')
  await mongoose.disconnect()
})().catch((e) => { console.error('Seed failed:', e.message); process.exit(1) })
