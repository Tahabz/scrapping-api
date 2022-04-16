const { Router } = require('express')
const jsonwebtoken = require('jsonwebtoken')
const dotenv = require('dotenv')
const { User } = require('../models/User')
const user = require('../middlewares/user')

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
    const token = jsonwebtoken.sign({ username, credit: user.credit }, process.env.JWT_SECRET)
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
    const user = await User.create({ username, password })
    const token = jsonwebtoken.sign({ username, credit: user.credit }, process.env.JWT_SECRET)
    return res.json(token)
  } catch (e) {
    console.error(e)
    return res.json('internal server error')
  }
})

module.exports = { userRouter }
