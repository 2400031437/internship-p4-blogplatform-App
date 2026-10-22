const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

dotenv.config()

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')
const verifyToken = require('./middleware/verifyToken')

const app = express()
const PORT = process.env.PORT || 5000
const imagesDir = path.join(__dirname, 'images')
fs.mkdirSync(imagesDir, { recursive: true })

// ---------- middlewares ----------
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
    credentials: true, // allow the JWT cookie to travel between 5173 and 5000
  })
)
app.use('/images', express.static(imagesDir)) // uploaded pictures are public

// ---------- routes ----------
app.get('/', (req, res) => res.json({ message: 'Blog API is running' }))
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

// ---------- image upload (multer) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /\.(jpe?g|png|gif|webp)$/i.test(file.originalname) ? cb(null, true) : cb(new Error('Only image files are allowed')),
})

app.post('/api/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image received' })
  res.status(200).json({ filename: req.file.filename })
})

// ---------- error handler ----------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'Something went wrong' })
})

// ---------- database + server ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Database connected successfully!')
  } catch (err) {
    console.log('Database connection FAILED:', err.message)
    console.log('-> Is MongoDB running? Check MONGO_URL in backend/.env')
  }
}

app.listen(PORT, () => {
  connectDB()
  console.log('App is running on port ' + PORT)
})
