require('./mongo.js')

const express = require('express')
const app = express()
const logger = require('./loggerMiddleware.js')
const cors = require('cors')
const Person = require('./models/Person.js')

app.use(express.json())
app.use(express.static('build'))

app.use(logger)

app.use(cors())

let persons = []

app.get('/', (request, response) => {
  response.send('<h1>Welcome to Phonebook Site Web</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(person => {
      response.json(person)
    })
})

app.get('/api/info', (request, response) => {
  const ids = persons.map(person => { return person.id })
  const maxId = Math.max(...ids)

  const date = new Date().toDateString()

  const res = `
  <h2>Phonebook has info for ${maxId} people</h2>
  <p>${date}</p>
  `

  response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const alreadyAdded = persons.find(p => p.name === person.name)

  if (alreadyAdded) {
    return response.status(400).json({
      error: `${person.name} is already added`
    })
  }

  const max = 200
  const min = 5
  const id = parseInt(Math.random() * (max - min) + min)

  const newPerson = {
    id,
    name: person.name,
    number: person.number
  }

  persons = [...persons, newPerson]

  response.status(201).json(newPerson)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
