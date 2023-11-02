import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    // Trim whitespace
    const newNameTrimmed = newName.trim()
    // Check if name already exists
    if (persons.some(person => person.name === newNameTrimmed)) {
      alert(`'${newNameTrimmed}' is already added to phonebook`)
      return
    }
    const newPerson = { name: newNameTrimmed }
    setPersons(persons.concat(newPerson))
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }


  console.log(newName)
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p>{person.name}</p>)}
    </div>
  )
}

export default App