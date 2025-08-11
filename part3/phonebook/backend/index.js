const morgan = require('morgan');
const express = require('express');
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
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (body?.name && body?.number) {
    if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      });
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    };

    persons = persons.concat(person);

    return response.json(person);
  } else {
    response.status(400).json({
      error: 'name or number is missing'
    });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});