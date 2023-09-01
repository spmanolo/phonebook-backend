const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })

const personSchema = new Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = model('Person', personSchema)

module.exports = Person
