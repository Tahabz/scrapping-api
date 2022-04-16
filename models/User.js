const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  credit: {
    type: Number,
    default: 10,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = { User: mongoose.model('user', userSchema) }
