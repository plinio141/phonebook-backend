const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();

const Person = require('./models/person')

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {    console.log('connected to MongoDB')  }) 
    .catch((error) => {    console.log('error connecting to MongoDB:', error.message)  })


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

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

app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<h1>Phonebook has info for ${people.length} people</h1><br> ${Date()} `)
})
  
app.get('/api/persons', (req, res) => {
    Person.find().then((people)=> {
        res.json(people);
    }).catch(err => {
        console.log(err);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findById(id).then((people)=> {
        res.json(people);
    }).catch(err => {
        console.log(err);
    });
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id).then((people)=> {
        response.status(204).end()
    }).catch(err => {
        console.log(err);
    });
});

const generateId = () => {
    const maxId = people.length > 0
      ? Math.max(...people.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', async (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'The name or number is missing ' 
      })
    }

    const personFind = await Person.findOne({ name: body.name });

    if (personFind) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
  
    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save()
        .then(person => {
            response.json(person)
        })
  
    
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})