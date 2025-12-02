import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notfication'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({text: 'this is a success message', type: 'success'})

  useEffect(() => {
    personService.getAll().then(persons => {
      setPersons(persons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to phonebook,
                  replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }

        personService.update(person.id, changedPerson).then(returnedPerson => {
          setPersons(persons.map(p => p.id === changedPerson.id ? returnedPerson : p
          ))
        }).catch(error => {
            if (error.status === 404) {
              setMessage({text: `${newName} has been already removed`, type:'error'})
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== person.id))
            } else if (error.status === 400) {
              setMessage({text: error.response.data.error, type: 'error'})
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            }
          })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log("there was an error", error.response.data.error)
        setMessage({text: error.response.data.error, type: 'error'})
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const removePerson = (id, name) => {    
    if (confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter
                        ? persons.filter(
                          person => person.name.toLowerCase().includes(filter.toLowerCase())  
                          )
                        : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handler={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm formHandler={addPerson} 
                  name={newName}
                  nameHandler={handleNameChange}
                  number={newNumber}
                  numberHandler={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow}
               handler={removePerson} />
    </div>
  )
}

export default App
