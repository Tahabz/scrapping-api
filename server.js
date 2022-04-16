const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connect = require('./db/connect')
const userAuth = require('./middlewares/user')
const { userRouter } = require('./routes/user')
const { scrapRouter } = require('./routes/scrap')

const app = express()
dotenv.config()

start().catch(console.error)

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/', userRouter)
app.use(userAuth)
app.use('/', scrapRouter)

app.get('/', (req, res) => res.json(req.user))

app.get('*', (req, res) => res.status(404).json("service doesn't exist"))

async function start () {
  await connect()
  app.listen(process.env.PORT, () => {
    console.log(`Server up and running on port ${process.env.PORT}!`)
  })
};
