const express = require('express')
const Comment = require('../models/Comment')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

// CREATE
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { comment, postId } = req.body
    if (!comment || !comment.trim() || !postId)
      return res.status(400).json({ message: 'Comment text and postId are required' })
    const saved = await new Comment({
      comment: comment.trim(),
      postId,
      author: req.user.username,
      userId: req.userId,
    }).save()
    res.status(200).json(saved)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET COMMENTS OF A POST
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 })
    res.status(200).json(comments)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// UPDATE (only the owner)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id)
    if (!c) return res.status(404).json({ message: 'Comment not found' })
    if (c.userId !== req.userId) return res.status(403).json({ message: 'You can edit only your own comments' })
    c.comment = req.body.comment || c.comment
    res.status(200).json(await c.save())
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE (only the owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id)
    if (!c) return res.status(404).json({ message: 'Comment not found' })
    if (c.userId !== req.userId) return res.status(403).json({ message: 'You can delete only your own comments' })
    await c.deleteOne()
    res.status(200).json({ message: 'Comment has been deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
