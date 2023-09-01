const mongoose = require('mongoose')
// const password = require('./password.js')
const Person = require('./models/person.js')

const argv = process.argv.slice(2)

if (argv.length === 0 || argv.length === 2 || argv.length > 3) {
  console.log('Debe proporcionar los argumentos necesarios')
  process.exit()
}

const connectionString = `mongodb+srv://manolosan2001:${argv[0]}
@cluster0.robqroq.mongodb.net/meitexdb
?retryWrites=true&w=majority`

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })

if (argv.length === 1) {
  console.log('Ha dado la contraseña')

  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
    })
} else if (argv.length === 3) {
  const newName = argv[1]
  const newNumber = argv[2]

  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save()
    .then(result => {
      console.log(`added ${newName} number ${newNumber} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
    })
}
