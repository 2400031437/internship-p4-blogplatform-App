const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const verifyToken = require('../middleware/verifyToken')
const { cookieOptions, signToken } = require('./auth')

const router = express.Router()

// GET USER (password is never sent)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// UPDATE USER (only yourself)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id !== req.userId) return res.status(403).json({ message: 'You can update only your own account' })

    const { username, email, password } = req.body
    const update = {}
    if (username) update.username = username
    if (email) update.email = email
    if (password) update.password = await bcrypt.hash(password, await bcrypt.genSalt(10))

    const updated = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).select('-password')
    if (!updated) return res.status(404).json({ message: 'User not found' })

    if (username) {
      // keep old posts/comments showing the new name
      await Post.updateMany({ userId: req.userId }, { $set: { username } })
      await Comment.updateMany({ userId: req.userId }, { $set: { author: username } })
    }
    res.cookie('token', signToken(updated), cookieOptions()).status(200).json(updated)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username or email already exists' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE USER (only yourself) + their posts and comments
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.params.id !== req.userId) return res.status(403).json({ message: 'You can delete only your own account' })

    const posts = await Post.find({ userId: req.userId }, '_id')
    await Comment.deleteMany({ postId: { $in: posts.map((p) => String(p._id)) } })
    await Post.deleteMany({ userId: req.userId })
    await Comment.deleteMany({ userId: req.userId })
    await User.findByIdAndDelete(req.userId)

    const { maxAge, ...opts } = cookieOptions()
    res.clearCookie('token', opts).status(200).json({ message: 'User has been deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
