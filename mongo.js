const mongoose = require('mongoose')
const password = require('./password.js')

const connectionString = `mongodb+srv://manolosan2001:${password}@cluster0.robqroq.mongodb.net/phonebook?retryWrites=true&w=majority`

// conexion a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })
