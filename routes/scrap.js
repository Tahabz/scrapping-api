const { Router } = require('express')
const { spawn } = require('child_process')
const { User } = require('../models/User')

const scrapRouter = Router()

scrapRouter.post('/scrap', async (req, res, next) => {
  let output = ''
  const username = req.user.username
  const user = await User.findOne({ username })
  if (user && user.credit > 0) {
    const python = spawn('python', ['utils/scrapper.py'])

    python.stdout.setEncoding('utf8')
    python.stdout.on('data', (chunk) => {
      output += chunk
    })

    python.stderr.on('data', (chunk) => {
      console.error(chunk.toString())
      res.status(500).json('internal server error')
    })

    python.on('close', async (code) => {
      if (code === 0) {
        const updated = await User.findOneAndUpdate({ username }, { credit: user.credit - 1 }, { new: true })
        res.json({ credit: updated.credit, data: JSON.parse(output) })
      }
    })

    python.on('error', (err) => {
      console.error(err)
      res.status(500).json('internal server error')
    })
  } else res.status(400).json('You do not have enough credit!')
})

module.exports = { scrapRouter }
