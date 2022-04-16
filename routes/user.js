const { Router } = require('express')
const jsonwebtoken = require('jsonwebtoken')
const dotenv = require('dotenv')
const { User } = require('../models/User')
const userAuth = require('../middlewares/user')

dotenv.config()
const userRouter = Router()

userRouter.post('/login', async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
      return res.status(400).json({ error: 'provide both username and password' })
    }

    const user = await User.findOne({ username }).lean().exec()
    if (user.password !== password) {
      return res.status(401).json({ error: 'incorrect credentials' })
    }
    const token = jsonwebtoken.sign({ username }, process.env.JWT_SECRET)
    return res.json(token)
  } catch (e) {
    console.error(e)
    return res.json('internal server error')
  }
})

userRouter.post('/register', async (req, res, next) => {
  try {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
      return res.status(400).json({ error: 'provide both username and password' })
    }
    await User.create({ username, password })
    const token = jsonwebtoken.sign({ username }, process.env.JWT_SECRET)
    return res.json(token)
  } catch (e) {
    console.error(e)
    if (e.code === 11000) return res.json('username already exists')
    return res.json('internal server error')
  }
})

userRouter.get('/credit', userAuth, async (req, res, next) => {
  const username = req.user.username
  const user = await User.findOne({ username })
  if (!user) return res.status(400).json('error occured')
  return res.json({ credit: user.credit })
})

module.exports = { userRouter }
