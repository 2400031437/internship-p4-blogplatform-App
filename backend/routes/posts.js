const express = require('express')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// CREATE
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { title, desc, photo, categories } = req.body
    if (!title || !desc) return res.status(400).json({ message: 'Title and description are required' })
    const saved = await new Post({
      title,
      desc,
      photo: photo || '',
      categories: categories || [],
      username: req.user.username, // taken from the token, not from the client
      userId: req.userId,
    }).save()
    res.status(200).json(saved)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET ALL POSTS  (optional ?search=text  -> searches the title, case-insensitive)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    const filter = search ? { title: { $regex: escapeRegex(String(search)), $options: 'i' } } : {}
    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET POSTS OF ONE USER
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET ONE POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// UPDATE (only the owner)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.userId !== req.userId) return res.status(403).json({ message: 'You can edit only your own posts' })

    const { title, desc, photo, categories } = req.body
    if (title !== undefined) post.title = title
    if (desc !== undefined) post.desc = desc
    if (photo !== undefined) post.photo = photo
    if (categories !== undefined) post.categories = categories
    res.status(200).json(await post.save())
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE (only the owner) + its comments
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.userId !== req.userId) return res.status(403).json({ message: 'You can delete only your own posts' })

    await Comment.deleteMany({ postId: String(post._id) })
    await post.deleteOne()
    res.status(200).json({ message: 'Post has been deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
