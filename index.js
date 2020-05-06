const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

let people = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    }
]

morgan.token('host', function(req, res) {
	return req.hostname;
});

// define custom logging format
morgan.token('detailed', function (req, res, param) {                                    
    return JSON.stringify(req.body);
});  

// register logging middleware and use custom logging format
app.use(morgan('method :url :status :res[content-length] - :response-time ms :detailed'));

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<h1>Phonebook has info for ${people.length} people</h1><br> ${Date()} `)
})
  
app.get('/api/persons', (req, res) => {
    res.json(people)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)
    response.status(204).end()
});

const generateId = () => {
    const maxId = people.length > 0
      ? Math.max(...people.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'The name or number is missing ' 
      })
    }
    const personFind = people.find(person => person.name === body.name);
    if (personFind) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    people.push(person)
  
    response.json(people)
})
  
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})