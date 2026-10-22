const jwt = require('jsonwebtoken')

// Protects a route: the user must send the JWT cookie set at login.
const verifyToken = (req, res, next) => {
  const token = req.cookies && req.cookies.token
  if (!token) return res.status(401).json({ message: 'You are not authenticated' })

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' })
    req.userId = data.id
    req.user = { id: data.id, username: data.username, email: data.email }
    next()
  })
}

module.exports = verifyToken
