import { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({personsToShow}) => (
  personsToShow.map((person, index) => <p key={index + 1}>{person.name} {person.number}</p>)
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    // Trim whitespace
    const newNameTrimmed = newName.trim()
    // Check if name already exists
    if (persons.some(person => person.name === newNameTrimmed)) {
      alert(`'${newNameTrimmed}' is already added to phonebook`)
      return
    }
    const newPerson = { 
      name: newNameTrimmed,
      number: newNumber 
    }
    setPersons(persons.concat(newPerson))
    // Clear input fields
    setNewName('')
    setNewNumber('')
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

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  console.log(newName)
  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App