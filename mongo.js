const mongoose = require('mongoose')
const password = require('./password.js')

const connectionString = `mongodb+srv://manolosan2001:${password}
@cluster0.robqroq.mongodb.net/meitexdb
?retryWrites=true&w=majority`

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })
