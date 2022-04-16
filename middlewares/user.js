const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

module.exports = async (req, res, next) => {
  try {
    let token
    if (Object.prototype.hasOwnProperty.call(req, 'cookies')) token = req.cookies.JWT
    if (!token) {
      token = req.headers.authorization?.split(' ')[1]
    }
    if (!token) token = req.headers.jwt
    if (!token) return res.status(401).json('not allowed')
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json(e.message)
  }
}
