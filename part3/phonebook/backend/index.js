require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const Person = require('./models/person');
const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
];

const generateId = () => {
  const maxId = 1000;
  return String(Math.floor(Math.random() * maxId));
};

app.get('/info', (request, response) => {
  const entries = persons.length;
  const now = new Date();
  response.send(`<p>Phonebook has info for ${entries} people</p>
                 <p>${now}</p>`);
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
      if (person) {
        return response.json(person);
      } else {
        response.status(404).end();
      }
    }).catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (body?.name && body?.number) {
    if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      });
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then(savedPerson => {
      response.json(savedPerson);
    });

  } else {
    response.status(400).json({
      error: 'name or number is missing'
    });
  }
});

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id'});
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});