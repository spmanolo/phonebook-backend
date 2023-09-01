require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')
const logger = require('./middlewares/logger.js')

const Person = require('./models/Person.js')

app.use(express.json())

// servir frontend estatico usando la build
app.use(express.static('build'))

app.use(logger)
app.use(cors())

const persons = []

app.get('/', (request, response) => {
  response.send('<h1>Welcome to Phonebook Site Web</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/info', (request, response) => {
//   const ids = persons.map(person => { return person.id })
//   const maxId = Math.max(...ids)

//   const date = new Date().toDateString()

//   const res = `
//   <h2>Phonebook has info for ${maxId} people</h2>
//   <p>${date}</p>
//   `

//   response.send(res)
// })

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(next)
})

// app.post('/api/persons', (request, response) => {
//   const person = request.body

//   if (!person.name || !person.number) {
//     return response.status(400).json({
//       error: 'name or number is missing'
//     })
//   }

//   const alreadyAdded = persons.find(p => p.name === person.name)

//   if (alreadyAdded) {
//     return response.status(400).json({
//       error: `${person.name} is already added`
//     })
//   }

//   const max = 200
//   const min = 5
//   const id = parseInt(Math.random() * (max - min) + min)

//   const newPerson = {
//     id,
//     name: person.name,
//     number: person.number
//   }

//   persons = [...persons, newPerson]

//   response.status(201).json(newPerson)
// })

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save()
    .then(person => {
      response.status(201).json(person)
    })
    .catch(next)
})

// endpoint not found
app.use(notFound)

// handleErrors
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
