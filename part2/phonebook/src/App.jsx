import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number : '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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


  console.log(newName)
  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map(person => <p>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App