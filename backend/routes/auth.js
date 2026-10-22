const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax', // localhost:5173 and localhost:5000 are the same "site"
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3 * 24 * 60 * 60 * 1000,
})

const signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Username, email and password are required' })
    if (password.length < 4)
      return res.status(400).json({ message: 'Password must be at least 4 characters' })

    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10))
    const saved = await new User({ username, email, password: hashed }).save()
    res.status(200).json(publicUser(saved))
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username or email already exists' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Wrong credentials' })

    res.cookie('token', signToken(user), cookieOptions()).status(200).json(publicUser(user))
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// LOGOUT
router.get('/logout', (req, res) => {
  const { maxAge, ...opts } = cookieOptions()
  res.clearCookie('token', opts).status(200).send('User logged out successfully!')
})

// REFETCH - keeps the user logged in after a page refresh
router.get('/refetch', (req, res) => {
  const token = req.cookies && req.cookies.token
  if (!token) return res.status(401).json({ message: 'Not logged in' })
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' })
    res.status(200).json({ _id: data.id, username: data.username, email: data.email })
  })
})

module.exports = router
module.exports.cookieOptions = cookieOptions
module.exports.signToken = signToken
