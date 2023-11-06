import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = ({ searchTerm, handleSearchTermChange }) => {
  return (
    <div>
      filter shown with <input 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={handleSearchTermChange}
        />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = ({personsToShow, handleDelete}) => (
  personsToShow.map((person, index) => 
    <p key={index + 1}>{person.name} {person.number}
    <button onClick={() => handleDelete(person.id)}>delete</button>
    </p>
  )
)

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  if (error === true) {
    return (
    <div className='error'>
      {message}
    </div>
    )
  } else {
    return (
      <div className='notification'>
      {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)
  const [errorStatus, setErrorStatus] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const updatePerson = (id, newPerson) => {
    personService
    .update(id, newPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        // Clear input fields
        setNewName('')
        setNewNumber('')
        console.log(`Updated ${returnedPerson.name} number to ${returnedPerson.number}`)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    // Trim whitespace
    const newNameTrimmed = newName.trim()
    // Check if name already exists
    if (persons.some(person => person.name === newNameTrimmed)) {
      if (window.confirm(`${newNameTrimmed} is already in the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newNameTrimmed)
        const newPerson = { 
          name: newNameTrimmed,
          number: newNumber 
        }
        updatePerson(person.id, newPerson)
      }
      return
    }
    const newPerson = { 
      name: newNameTrimmed,
      number: newNumber 
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        // Clear input fields
        setNewName('')
        setNewNumber('')
        setErrorStatus(false)
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }
  

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleSearchTermChange = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          console.log(`Deleted ${person.name}`)
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  console.log(newName)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={errorStatus} />
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange} />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        personsToShow={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App