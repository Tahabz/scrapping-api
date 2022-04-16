const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connect = require('./db/connect')

dotenv.config()
const app = express()

start().catch(console.error)

app.use(morgan('dev'))
app.use(express.json())

async function start () {
  await connect()
  app.listen(process.env.PORT, () => {
    console.log(`Server up and running on port ${process.env.PORT}!`)
  })
};
