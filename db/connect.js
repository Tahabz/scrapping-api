const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

module.exports = async () => {
  const url = (await MongoMemoryServer.create()).getUri()
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Mongo successfully connected'))
    .catch((e) => console.error(e))
}
